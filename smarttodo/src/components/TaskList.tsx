import { useTask } from "./TaskManager";
import TaskCard from "./TaskCard";
import "../styles/main.css";

function TaskList() {
	const { currentTasks, toggleTask, deleteTask, startEditing } = useTask();

	return (
		<div>
			<h2>Список задач:</h2>
			<ul className="TaskList">
				{currentTasks.length === 0 ? (
					<li>Задач не найдено</li>
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
		</div>
	);
}

export default TaskList;
