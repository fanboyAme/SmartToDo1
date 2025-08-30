import TaskCard from "./TaskCard";
import { TaskListProps } from "../interfaces/TaskListProps";

function TaskList({
	tasks,
	onToggleTask,
	onDeleteTask,
	onStartEditing,
}: TaskListProps) {
	return (
		<div>
			<h2>Список задач:</h2>
			<ul>
				{tasks
					.filter((task) => task && task.id)
					.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							onToggleTask={onToggleTask}
							onDeleteTask={onDeleteTask}
							onStartEditing={onStartEditing}
						/>
					))}
			</ul>
		</div>
	);
}
export default TaskList;
