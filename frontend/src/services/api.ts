import { tokenStorage } from "./tokenStorage";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:5088";

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

interface RequestOptions {
	method?: "GET" | "POST" | "PATCH" | "DELETE";
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined | null>;
	auth?: boolean;
	extraHeaders?: Record<string, string>;
}

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = new URL(`${API_BASE_URL}${normalizedPath}`);

	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			if (value === undefined || value === null || value === "") {
				return;
			}
			url.searchParams.set(key, String(value));
		});
	}

	return url.toString();
};

export const apiRequest = async <T>(
	path: string,
	{ method = "GET", body, query, auth = false, extraHeaders = {} }: RequestOptions = {}
): Promise<T> => {
	const headers: Record<string, string> = {
		...extraHeaders,
	};

	if (body !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	if (auth) {
		const accessToken = tokenStorage.getAccessToken();
		if (accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}
	}

	const response = await fetch(buildUrl(path, query), {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	const contentType = response.headers.get("content-type") ?? "";
	const isJson = contentType.includes("application/json");
	const payload = isJson ? await response.json() : null;

	if (!response.ok) {
		const message =
			(payload && typeof payload.message === "string" && payload.message) ||
			`Request failed with status ${response.status}`;

		throw new ApiError(response.status, message);
	}

	return payload as T;
};
