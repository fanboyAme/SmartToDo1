import React, { useState } from "react";
import { Priority } from "../types/task";
import { TaskFormProps } from "../interfaces/TaskFormProps";
import { useTask } from "./TaskManager";
import "../styles/Modals.css";

function TaskForm({ onAddTask, onClose }: TaskFormProps) {
	const { t } = useTask();
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
			<div className="ModalWindow" onClick={(event) => event.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">{t.createTaskTitle}</h2>
					<button className="closeButton" onClick={onClose}>
						x
					</button>
				</div>

				<div className="modalBody">
					<form onSubmit={handleSubmit}>
						<div className="formGroup">
							<input
								type="text"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								className="formInput"
								placeholder=" "
								required
							/>
							<label className="formLabel">{t.title}</label>
						</div>

						<div className="formGroup">
							<textarea
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								className="formTextarea"
								placeholder=" "
								rows={4}
							/>
							<label className="formLabel">{t.description}</label>
						</div>

						<div className="selectGroup">
							<label>{t.priority}</label>
							<select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
								<option value="low">{t.priorityLowLabel}</option>
								<option value="medium">{t.priorityMediumLabel}</option>
								<option value="high">{t.priorityHighLabel}</option>
							</select>
						</div>

						<div className="buttonGroup">
							<button type="button" onClick={onClose} className="cancelButton">
								{t.cancel}
							</button>
							<button type="submit" className="submitButton">
								{t.addTask}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default TaskForm;
