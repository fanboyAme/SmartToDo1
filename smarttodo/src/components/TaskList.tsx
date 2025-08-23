import React from "react";
import TaskForm from "../components/TaskForm";
import { Priority, Form } from "../types/task";
import TaskCard from "./TaskCard";

interface TaskListProps {
	tasks: Form[];
	onAddTask: (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => void;
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
}
function TaskList({
	tasks,
	onAddTask,
	onToggleTask,
	onDeleteTask,
}: TaskListProps) {
	return (
		<div>
			<TaskForm onAddTask={onAddTask} />
			<h2>Список задач:</h2>
			<ul>
				{tasks.map((task) => (
					<TaskCard
						task={task}
						key={task.id}
						onToggleTask={onToggleTask}
						onDeleteTask={onDeleteTask}
					/>
				))}
			</ul>
		</div>
	);
}
export default TaskList;
