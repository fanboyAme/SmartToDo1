import React, { useEffect, useState } from "react";
import { Priority } from "../types/task";
import { EditModalProps } from "../interfaces/EditModalProps";
import "../styles/Modals.css";

function EditModal({ task, onSave, onClose }: EditModalProps) {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);
	const [priority, setPriority] = useState(task.priority);
	const [completed, setCompleted] = useState(task.completed);

	useEffect(() => {
		setTitle(task.title);
		setDescription(task.description);
		setPriority(task.priority);
		setCompleted(task.completed);
	}, [task]);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSave({ title, priority, description, completed });
	}

	return (
		<div className="modalOverlay" onClick={onClose}>
			<div className="ModalWindow" onClick={(e) => e.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">Редактирование задачи</h2>
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

						<div className="buttonGroup">
							<button type="button" onClick={onClose} className="cancelButton">
								Отменить
							</button>
							<button type="submit" className="submitButton">
								Сохранить
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditModal;
