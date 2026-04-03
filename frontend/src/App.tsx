import { useTask } from "./components/TaskManager";
import TaskList from "./components/TaskList";
import FilterPanel from "./components/FilterPanel";
import "./styles/main.css";
import "./styles/Base.css";

function App() {
	const { isLoading, isAuthChecking, isAuthenticated, t } = useTask();

	if (isAuthChecking) {
		return <div className="authCheck">{t.checkingAuth}</div>;
	}

	if (!isAuthenticated) {
		return <div className="authPlaceholder" />;
	}

	return (
		<div className="appShell">
			<div className="appLayout">
				{isLoading ? (
					<div className="loadingState">{t.loading}</div>
				) : (
					<>
						<FilterPanel />
						<TaskList />
					</>
				)}
			</div>
		</div>
	);
}

export default App;
