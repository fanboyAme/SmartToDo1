import React from "react";
import { Form, Priority } from "../types/task";
interface TaskCardProps {
	task: Form;
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onStartEditing: (task: Form) => void;
}
function TaskCard({
	task,
	onToggleTask,
	onDeleteTask,
	onStartEditing,
}: TaskCardProps) {
	function handleCheckboxChange() {
		onToggleTask(task.id);
	}
	function handleDeleteClick() {
		onDeleteTask(task.id);
	}
	function handleEditingClick() {
		onStartEditing(task);
	}
	return (
		<li>
			<div>
				<input
					type="checkbox"
					checked={task.completed}
					onChange={handleCheckboxChange}
				/>
			</div>
			<span
				style={{ textDecoration: task.completed ? "line-through" : "none" }}
			>
				<h2>{task.title}</h2>
			</span>
			<h3>{task.description}</h3>
			<p>Приоритет {task.priority}</p>
			<div>
				<button onClick={handleDeleteClick}>Удалить</button>
				<button onClick={handleEditingClick}>Редактировать</button>
			</div>
		</li>
	);
}
export default TaskCard;
