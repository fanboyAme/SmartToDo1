import TaskCard from "./TaskCard";
import { TaskListProps } from "../interfaces/TaskListProps";
import "../styles/main.css";

function TaskList({
	tasks,
	onToggleTask,
	onDeleteTask,
	onStartEditing,
	currentPage,
	totalPage,
}: TaskListProps) {
	return (
		<div>
			<h2>Список задач:</h2>
			<ul className="TaskList">
				{tasks.length === 0 ? (
					<li>Задач не найдено</li>
				) : (
					tasks.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							onToggleTask={onToggleTask}
							onDeleteTask={onDeleteTask}
							onStartEditing={onStartEditing}
						/>
					))
				)}
			</ul>
		</div>
	);
}
export default TaskList;
