import React from "react";
import { Priority, Task } from "../types/task";
import TaskCard from "./TaskCard";

interface TaskListProps {
	tasks: Task[];
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onStartEditing: (task: Task) => void;
}
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
				{tasks.map((task) => (
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
