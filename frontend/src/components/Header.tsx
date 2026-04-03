import { useTask } from "./TaskManager";
import "../styles/main.css";

function Header() {
	const {
		taskCount,
		setIsFormVisible,
		isFormVisible,
		logout,
		theme,
		toggleTheme,
		toggleLanguage,
		isAdmin,
		openAdminUsersModal,
		t,
	} = useTask();

	return (
		<header className="header">
			<div>
				<h1 className="headerTitle">{t.headerTitle}</h1>
				<p className="headerStats">{t.totalTasks}: {taskCount}</p>
			</div>
			<div className="headerActions">
				<button className="themeButton" onClick={toggleTheme}>
					{theme === "dark" ? t.lightTheme : t.darkTheme}
				</button>
				<button className="themeButton" onClick={toggleLanguage}>
					{t.language}
				</button>
				<button className="headerButton" onClick={() => setIsFormVisible(!isFormVisible)}>
					{isFormVisible ? t.closeForm : `+ ${t.createTask}`}
				</button>
				{isAdmin && (
					<button className="adminButton" onClick={openAdminUsersModal}>
						{t.admin}
					</button>
				)}
				<button className="logoutButton" onClick={logout}>
					{t.logout}
				</button>
			</div>
		</header>
	);
}

export default Header;
