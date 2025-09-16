import { useTask } from "./TaskManager";
import TaskCard from "./TaskCard";
import Pagination from "./PaginationButton";
import "../styles/TaskList.css";

function TaskList() {
	const {
		currentTasks,
		toggleTask,
		deleteTask,
		startEditing,
		tasksPerPage,
		setTasksPerPage,
	} = useTask();

	return (
		<div className="taskListContainer">
			<h2 className="taskListTitle">Список задач</h2>

			{/* Tasks per page selector */}
			<div className="tasksPerPageSelector">
				<span className="tasksPerPageLabel">Задач на странице:</span>
				<select
					value={tasksPerPage}
					onChange={(e) => setTasksPerPage(Number(e.target.value))}
					className="tasksPerPageSelect"
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>

			{/* Tasks grid */}
			<ul className="taskGrid">
				{currentTasks.length === 0 ? (
					<li className="emptyState">Задач не найдено</li>
				) : (
					currentTasks.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							onToggleTask={toggleTask}
							onDeleteTask={deleteTask}
							onStartEditing={startEditing}
						/>
					))
				)}
			</ul>

			{/* Pagination */}
			<Pagination />
		</div>
	);
}

export default TaskList;
