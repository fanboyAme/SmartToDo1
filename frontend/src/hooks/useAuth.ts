import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { authApi } from "../services/authApi";
import { tokenStorage } from "../services/tokenStorage";
import { Language, translations } from "../i18n/translations";

export type AuthModalMode = "login" | "register" | "verify";

const getCurrentLanguage = (): Language => {
	const stored = localStorage.getItem("smarttodo_language");
	return stored === "en" || stored === "ru" ? stored : "ru";
};

const getAuthText = (key: keyof (typeof translations)["ru"]) => {
	return translations[getCurrentLanguage()][key];
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
	const parts = token.split(".");
	if (parts.length < 2) return null;

	try {
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
		const json = atob(normalized);
		return JSON.parse(json) as Record<string, unknown>;
	} catch {
		return null;
	}
};

const isTokenAdmin = (token: string | null): boolean => {
	if (!token) return false;

	const payload = parseJwtPayload(token);
	if (!payload) return false;

	const roleClaim =
		payload.role ??
		payload.roles ??
		payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

	if (Array.isArray(roleClaim)) {
		return roleClaim.some((role) => String(role).toLowerCase() === "admin");
	}

	return String(roleClaim ?? "").toLowerCase() === "admin";
};

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthChecking, setIsAuthChecking] = useState(true);
	const [authMode, setAuthMode] = useState<AuthModalMode>("login");
	const [verificationEmail, setVerificationEmail] = useState("");
	const [defaultLogin, setDefaultLogin] = useState("");
	const [defaultEmail, setDefaultEmail] = useState("");
	const [authError, setAuthError] = useState<string | null>(null);

	const logout = useCallback(() => {
		tokenStorage.clearTokens();
		setIsAuthenticated(false);
		setIsAdmin(false);
		setAuthMode("login");
		setAuthError(null);
	}, []);

	const validateCurrentAccessToken = useCallback(async () => {
		const accessToken = tokenStorage.getAccessToken();
		if (!accessToken) return false;

		try {
			await authApi.validateToken();
			return true;
		} catch {
			return false;
		}
	}, []);

	const refreshAuth = useCallback(async () => {
		const refreshToken = tokenStorage.getRefreshToken();
		if (!refreshToken) return false;

		try {
			const refreshResponse = await authApi.refresh(refreshToken);
			const tokens = refreshResponse.refreshToken;
			tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
			setIsAdmin(isTokenAdmin(tokens.accessToken));
			return true;
		} catch {
			return false;
		}
	}, []);

	const checkAuth = useCallback(async () => {
		setIsAuthChecking(true);
		setAuthError(null);

		const isValidToken = await validateCurrentAccessToken();
		if (isValidToken) {
			setIsAuthenticated(true);
			setIsAdmin(isTokenAdmin(tokenStorage.getAccessToken()));
			setIsAuthChecking(false);
			return;
		}

		const isRefreshed = await refreshAuth();
		if (isRefreshed) {
			const isValidAfterRefresh = await validateCurrentAccessToken();
			if (isValidAfterRefresh) {
				setIsAuthenticated(true);
				setIsAdmin(isTokenAdmin(tokenStorage.getAccessToken()));
				setIsAuthChecking(false);
				return;
			}
		}

		tokenStorage.clearTokens();
		setIsAuthenticated(false);
		setIsAdmin(false);
		setAuthMode("login");
		setIsAuthChecking(false);
	}, [refreshAuth, validateCurrentAccessToken]);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const login = useCallback(
		async (loginValue: string, password: string) => {
			setAuthError(null);
			try {
				const response = await authApi.login({ login: loginValue, password });
				tokenStorage.setTokens(response.accessToken, response.refreshToken);
				setDefaultLogin(loginValue);
				setIsAdmin(isTokenAdmin(response.accessToken));
				setIsAuthenticated(true);
				setAuthMode("login");
			} catch (error) {
				if (error instanceof ApiError && error.status === 403) {
					const email = verificationEmail || defaultEmail;
					setVerificationEmail(email);
					setAuthMode("verify");
					setAuthError(
						email
							? getAuthText("emailNotVerifiedWithEmail")
							: getAuthText("emailNotVerifiedNoEmail")
					);
					return;
				}

				setAuthError(error instanceof Error ? error.message : getAuthText("authError"));
			}
		},
		[defaultEmail, verificationEmail]
	);

	const register = useCallback(async (loginValue: string, email: string, password: string) => {
		setAuthError(null);
		try {
			await authApi.register({ login: loginValue, email, password });
			setVerificationEmail(email);
			setDefaultLogin(loginValue);
			setDefaultEmail(email);
			setAuthMode("verify");
		} catch (error) {
			setAuthError(error instanceof Error ? error.message : getAuthText("registerError"));
		}
	}, []);

	const verifyEmail = useCallback(async (email: string, token: string) => {
		setAuthError(null);
		try {
			await authApi.verifyEmail({ email, token: Number(token) });
			setAuthMode("login");
			setVerificationEmail(email);
			setDefaultEmail(email);
			setAuthError(getAuthText("verifySuccess"));
		} catch (error) {
			setAuthError(error instanceof Error ? error.message : getAuthText("verifyError"));
		}
	}, []);

	const resendVerificationCode = useCallback(async (email: string) => {
		setAuthError(null);
		try {
			await authApi.resendEmailCode(email);
			setVerificationEmail(email);
			setDefaultEmail(email);
			setAuthError(getAuthText("resendSuccess"));
		} catch (error) {
			setAuthError(error instanceof Error ? error.message : getAuthText("resendError"));
		}
	}, []);

	return {
		isAuthenticated,
		isAdmin,
		isAuthChecking,
		authMode,
		authError,
		verificationEmail,
		defaultLogin,
		defaultEmail,
		setAuthMode,
		setAuthError,
		login,
		logout,
		register,
		verifyEmail,
		resendVerificationCode,
		checkAuth,
	};
};
