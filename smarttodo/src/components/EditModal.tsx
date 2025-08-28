import React, { useState } from "react";
import App from "../App";
import { Task, Priority } from "../types/task";
import { EditModalProps } from "../interfaces/EditModalProps";
import "../styles/main.css";

function EditModal({ task, onSave, onClose }: EditModalProps) {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);
	const [priority, setPriority] = useState(task.priority);
	const [completed, setCompleted] = useState(task.completed);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSave({ title, priority, description, completed });
	}

	return (
		<form onSubmit={handleSubmit} className="ModalWindow">
			<div>
				<label>
					Название
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					></input>
				</label>
			</div>
			<div>
				<label>
					Описание
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
				</label>
			</div>
			<div>
				<label>
					Приоритет
					<select
						value={priority}
						onChange={(e) => setPriority(e.target.value as Priority)}
					>
						<option value={"low"}>low</option>
						<option value={"medium"}>medium</option>
						<option value={"high"}>high</option>
					</select>
				</label>
			</div>
			<button type="submit">Сохранить</button>
			<button onClick={onClose}>Отменить</button>
		</form>
	);
}
export default EditModal;
