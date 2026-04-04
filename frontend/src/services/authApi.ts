import { apiRequest } from "./api";
import { AdminUser } from "../types/adminUser";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

interface LoginPayload {
	login: string;
	password: string;
}

interface RegisterPayload {
	login: string;
	password: string;
	email: string;
}

interface VerifyPayload {
	email: string;
	token: number;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

interface RefreshResponse {
	refreshToken: AuthTokens;
}

interface BackendAdminUser {
	id?: string;
	Id?: string;
	login?: string;
	Login?: string;
	email?: string;
	Email?: string;
	userRole?: string | number;
	UserRole?: string | number;
	emailConfirmed?: boolean;
	EmailConfirmed?: boolean;
}

const mapAdminUser = (user: BackendAdminUser): AdminUser => ({
	id: user.id ?? user.Id ?? "",
	login: user.login ?? user.Login ?? "",
	email: user.email ?? user.Email ?? "",
	userRole: user.userRole ?? user.UserRole ?? "",
	emailConfirmed:
		user.emailConfirmed ?? user.EmailConfirmed ?? false,
});

export const authApi = {
	register(payload: RegisterPayload) {
		return apiRequest<{ email: string }>("/api/users/Registration", {
			method: "POST",
			body: payload,
		});
	},
	login(payload: LoginPayload) {
		return apiRequest<LoginResponse>("/api/users/Auth", {
			method: "POST",
			body: payload,
		});
	},
	verifyEmail(payload: VerifyPayload) {
		return apiRequest<void>("/api/users/AuthToken", {
			method: "POST",
			body: payload,
		});
	},
	resendEmailCode(email: string) {
		return apiRequest<void>("/api/users/CodeGeneration", {
			method: "POST",
			query: { email },
		});
	},
	refresh(refreshToken: string) {
		return apiRequest<RefreshResponse>("/api/users", {
			method: "POST",
			query: { refreshtoken: refreshToken },
		});
	},
	validateToken() {
		return apiRequest<string>("/api/users/sercer", {
			method: "GET",
			auth: true,
		});
	},
	getAllUsers() {
		return apiRequest<BackendAdminUser[]>("/api/users", {
			method: "GET",
			auth: true,
		}).then((users) => users.map(mapAdminUser));
	},
};
