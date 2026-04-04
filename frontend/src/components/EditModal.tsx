import React, { useEffect, useState } from "react";
import { Priority } from "../types/task";
import { EditModalProps } from "../interfaces/EditModalProps";
import { useTask } from "./TaskManager";
import "../styles/Modals.css";

function EditModal({ task, onSave, onClose }: EditModalProps) {
	const { t } = useTask();
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);
	const [priority, setPriority] = useState(task.priority);
	const [completed, setCompleted] = useState(task.completed);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setTitle(task.title);
		setDescription(task.description);
		setPriority(task.priority);
		setCompleted(task.completed);
	}, [task]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onSave({ title, priority, description, completed });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="modalOverlay" onClick={onClose}>
			<div className="ModalWindow" onClick={(event) => event.stopPropagation()}>
				<div className="modalHeader">
					<h2 className="modalTitle">{t.editTask}</h2>
					<button className="closeButton" onClick={onClose} type="button" disabled={isSubmitting}>
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
								disabled={isSubmitting}
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
								disabled={isSubmitting}
							/>
							<label className="formLabel">{t.description}</label>
						</div>

						<div className="selectGroup">
							<label>{t.priority}</label>
							<select
								value={priority}
								onChange={(event) => setPriority(event.target.value as Priority)}
								disabled={isSubmitting}
							>
								<option value="low">{t.priorityLowLabel}</option>
								<option value="medium">{t.priorityMediumLabel}</option>
								<option value="high">{t.priorityHighLabel}</option>
							</select>
						</div>

						<div className="selectGroup">
							<label className="completionToggle">
								<span className="completionToggleText">{t.completed}</span>
								<input
									type="checkbox"
									checked={completed}
									onChange={(event) => setCompleted(event.target.checked)}
									disabled={isSubmitting}
								/>
								<span className="completionToggleControl" />
							</label>
						</div>

						<div className="buttonGroup">
							<button type="button" onClick={onClose} className="cancelButton" disabled={isSubmitting}>
								{t.cancel}
							</button>
							<button type="submit" className="submitButton" disabled={isSubmitting}>
								{isSubmitting ? t.loading : t.save}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditModal;
