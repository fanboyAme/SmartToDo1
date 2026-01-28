import React, { useState } from "react";
import { Priority } from "../types/task";
import { TaskFormProps } from "../interfaces/TaskFormProps";
import "../styles/Modals.css";

function TaskForm({
	onAddTask,
	storageType,
	onStorageType,
	onClose,
}: TaskFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<Priority>("low");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onAddTask({ title, description, priority });
		setTitle("");
		setDescription("");
		setPriority("low");
	};

	return (
		<div className="modalOverlay" onClick={onClose}>
			<div className="ModalWindow" onClick={(e) => e.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">Создание новой задачи</h2>
					<button className="closeButton" onClick={onClose}>
						×
					</button>
				</div>

				<div className="modalBody">
					<form onSubmit={handleSubmit}>
						<div className="formGroup">
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="formInput"
								placeholder=" "
								required
							/>
							<label className="formLabel">Название</label>
						</div>

						<div className="formGroup">
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="formTextarea"
								placeholder=" "
								rows={4}
							/>
							<label className="formLabel">Описание</label>
						</div>

						<div className="selectGroup">
							<label>Приоритет</label>
							<select
								value={priority}
								onChange={(e) => setPriority(e.target.value as Priority)}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>

						<div className="selectGroup">
							<label>Сохранить в:</label>
							<select
								value={storageType}
								onChange={(e) =>
									onStorageType(e.target.value as "local" | "indexeddb")
								}
							>
								<option value="local">LocalStorage</option>
								<option value="indexeddb">IndexedDB</option>
							</select>
						</div>

						<div className="buttonGroup">
							<button type="button" onClick={onClose} className="cancelButton">
								Отменить
							</button>
							<button type="submit" className="submitButton">
								Добавить задачу
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default TaskForm;
