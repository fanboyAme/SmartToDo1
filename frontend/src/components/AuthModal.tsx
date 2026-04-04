import { FormEvent, useEffect, useState } from "react";
import { AuthModalMode } from "../hooks/useAuth";
import { useTask } from "./TaskManager";
import "../styles/Modals.css";

interface AuthModalProps {
	mode: AuthModalMode;
	error: string | null;
	verificationEmail: string;
	defaultLogin: string;
	defaultEmail: string;
	onModeChange: (mode: AuthModalMode) => void;
	onLogin: (login: string, password: string) => Promise<void>;
	onRegister: (login: string, email: string, password: string) => Promise<void>;
	onVerify: (email: string, token: string) => Promise<void>;
	onResend: (email: string) => Promise<void>;
}

function AuthModal({
	mode,
	error,
	verificationEmail,
	defaultLogin,
	defaultEmail,
	onModeChange,
	onLogin,
	onRegister,
	onVerify,
	onResend,
}: AuthModalProps) {
	const { t } = useTask();
	const [login, setLogin] = useState(defaultLogin);
	const [email, setEmail] = useState(defaultEmail);
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setLogin(defaultLogin);
	}, [defaultLogin]);

	useEffect(() => {
		setEmail(defaultEmail);
	}, [defaultEmail]);

	useEffect(() => {
		if (mode !== "verify") {
			setToken("");
		}
	}, [mode]);

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			await onLogin(login, password);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			await onRegister(login, email, password);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting || !verificationEmail) return;
		setIsSubmitting(true);
		try {
			await onVerify(verificationEmail, token);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResend = async () => {
		if (!verificationEmail || isSubmitting) return;
		setIsSubmitting(true);
		try {
			await onResend(verificationEmail);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="modalOverlay">
			<div className="ModalWindow authWindow" onClick={(event) => event.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">
						{mode === "login" && t.authSignIn}
						{mode === "register" && t.authSignUp}
						{mode === "verify" && t.authVerify}
					</h2>
					<p className="authSubtitle">Smart ToDo</p>
				</div>

				{mode !== "verify" && (
					<div className="authTabs">
						<button
							type="button"
							className={`authTab ${mode === "login" ? "active" : ""}`}
							onClick={() => onModeChange("login")}
							disabled={isSubmitting}
						>
							{t.authSignIn}
						</button>
						<button
							type="button"
							className={`authTab ${mode === "register" ? "active" : ""}`}
							onClick={() => onModeChange("register")}
							disabled={isSubmitting}
						>
							{t.authSignUp}
						</button>
					</div>
				)}

				<div className="modalBody">
					{mode === "login" && (
						<form onSubmit={handleLogin}>
							<div className="formGroup">
								<input
									type="text"
									value={login}
									onChange={(event) => setLogin(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting}
								/>
								<label className="formLabel">{t.login}</label>
							</div>
							<div className="formGroup">
								<input
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting}
								/>
								<label className="formLabel">{t.password}</label>
							</div>
							<div className="buttonGroup">
								<button type="submit" className="submitButton" disabled={isSubmitting}>
									{isSubmitting ? t.loading : t.authSignIn}
								</button>
							</div>
						</form>
					)}

					{mode === "register" && (
						<form onSubmit={handleRegister}>
							<div className="formGroup">
								<input
									type="text"
									value={login}
									onChange={(event) => setLogin(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting}
								/>
								<label className="formLabel">{t.login}</label>
							</div>
							<div className="formGroup">
								<input
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting}
								/>
								<label className="formLabel">{t.email}</label>
							</div>
							<div className="formGroup">
								<input
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting}
								/>
								<label className="formLabel">{t.password}</label>
							</div>
							<div className="buttonGroup">
								<button type="submit" className="submitButton" disabled={isSubmitting}>
									{isSubmitting ? t.loading : t.createAccount}
								</button>
							</div>
						</form>
					)}

					{mode === "verify" && (
						<form onSubmit={handleVerify}>
							<div className="verificationEmailBlock">
								<p className="verificationEmailLabel">{t.email}</p>
								<p className="verificationEmailValue">{verificationEmail || t.notSet}</p>
							</div>
							<div className="formGroup">
								<input
									type="number"
									value={token}
									onChange={(event) => setToken(event.target.value)}
									className="formInput"
									placeholder=" "
									required
									disabled={isSubmitting || !verificationEmail}
								/>
								<label className="formLabel">{t.codeFromEmail}</label>
							</div>
							<div className="buttonGroup verifyActionGroup">
								<button
									type="button"
									onClick={handleResend}
									className="cancelButton"
									disabled={isSubmitting || !verificationEmail}
								>
									{t.resendCode}
								</button>
								<button
									type="submit"
									className="submitButton"
									disabled={isSubmitting || !verificationEmail}
								>
									{isSubmitting ? t.loading : t.verify}
								</button>
							</div>
							<div className="buttonGroup authSwitchGroup">
								<button
									type="button"
									onClick={() => onModeChange("login")}
									className="cancelButton"
									disabled={isSubmitting}
								>
									{t.backToSignIn}
								</button>
							</div>
						</form>
					)}

					{error && <p className="authMessage">{error}</p>}
				</div>
			</div>
		</div>
	);
}

export default AuthModal;
