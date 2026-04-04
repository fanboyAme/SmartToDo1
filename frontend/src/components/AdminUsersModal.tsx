import { AdminUser } from "../types/adminUser";
import { useTask } from "./TaskManager";
import "../styles/Modals.css";

interface AdminUsersModalProps {
	users: AdminUser[];
	isLoading: boolean;
	error: string | null;
	onClose: () => void;
	onReload: () => void;
}

function AdminUsersModal({
	users,
	isLoading,
	error,
	onClose,
	onReload,
}: AdminUsersModalProps) {
	const { t } = useTask();
	const getRoleLabel = (role: string | number) => {
		const normalized = String(role).toLowerCase();
		if (normalized === "1" || normalized === "admin") return "Admin";
		if (normalized === "0" || normalized === "user") return "User";
		return String(role);
	};

	return (
		<div className="modalOverlay" onClick={onClose}>
			<div className="ModalWindow adminUsersWindow" onClick={(event) => event.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">{t.adminUsers}</h2>
					<button className="closeButton" onClick={onClose} type="button">
						x
					</button>
				</div>

				<div className="modalBody">
					{error && <p className="authMessage">{error}</p>}

					{isLoading ? (
						<p className="adminUsersState">{t.usersLoading}</p>
					) : users.length === 0 ? (
						<p className="adminUsersState">{t.usersEmpty}</p>
					) : (
						<div className="adminUsersTableWrap">
							<table className="adminUsersTable">
								<thead>
									<tr>
										<th>{t.userLogin}</th>
										<th>{t.email}</th>
										<th>{t.role}</th>
										<th>{t.validity}</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id}>
											<td>{user.login}</td>
											<td>{user.email}</td>
											<td>{getRoleLabel(user.userRole)}</td>
											<td>
												<span className={user.emailConfirmed ? "validBadge" : "invalidBadge"}>
													{user.emailConfirmed ? t.confirmed : t.notConfirmed}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<div className="adminUsersActions bottom">
						<button type="button" className="submitButton" onClick={onReload} disabled={isLoading}>
							{isLoading ? t.loading : t.refresh}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminUsersModal;
