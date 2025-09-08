import { useTask } from "./components/TaskManager";
import TaskList from "./components/TaskList";
import Pagination from "./components/Pagination";
import FilterPanel from "./components/FilterPanel";

function App() {
	const { isLoading } = useTask();

	return (
		<div>
			{isLoading ? (
				<div>Загрузка...</div>
			) : (
				<>
					<FilterPanel />
					<TaskList />
					<Pagination />
				</>
			)}
		</div>
	);
}

export default App;
