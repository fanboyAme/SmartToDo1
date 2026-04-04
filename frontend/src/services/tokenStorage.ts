const ACCESS_TOKEN_COOKIE = "smarttodo_access_token";
const REFRESH_TOKEN_COOKIE = "smarttodo_refresh_token";

const setSessionCookie = (name: string, value: string) => {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
	const prefix = `${name}=`;
	const value = document.cookie
		.split(";")
		.map((item) => item.trim())
		.find((item) => item.startsWith(prefix));

	if (!value) {
		return null;
	}

	return decodeURIComponent(value.slice(prefix.length));
};

const clearCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

export const tokenStorage = {
	setTokens(accessToken: string, refreshToken: string) {
		setSessionCookie(ACCESS_TOKEN_COOKIE, accessToken);
		setSessionCookie(REFRESH_TOKEN_COOKIE, refreshToken);
	},
	getAccessToken() {
		return getCookie(ACCESS_TOKEN_COOKIE);
	},
	getRefreshToken() {
		return getCookie(REFRESH_TOKEN_COOKIE);
	},
	clearTokens() {
		clearCookie(ACCESS_TOKEN_COOKIE);
		clearCookie(REFRESH_TOKEN_COOKIE);
	},
};
