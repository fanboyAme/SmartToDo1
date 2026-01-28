import { useTask } from "./components/TaskManager";
import TaskList from "./components/TaskList";
import PaginationButton from "./components/PaginationButton";
import FilterPanel from "./components/FilterPanel";
import "./styles/Main.css";
import "./styles/Base.css";

function App() {
	const { isLoading } = useTask();

	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				padding: "2rem",
				gap: "2rem",
			}}
		>
			{isLoading ? (
				<div>Загрузка...</div>
			) : (
				<>
					<FilterPanel />
					<TaskList />
				</>
			)}
		</div>
	);
}

export default App;
