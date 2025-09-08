import React, { useState } from "react";
import { Priority } from "../types/task";
import { TaskFormProps } from "../interfaces/TaskFormProps";
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
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						Название
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</label>
				</div>

				<div>
					<label>
						Описание
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>
				</div>

				<div>
					<label>
						Приоритет
						<select
							value={priority}
							onChange={(e) => setPriority(e.target.value as Priority)}
						>
							<option value="low">low</option>
							<option value="medium">medium</option>
							<option value="high">high</option>
						</select>
					</label>
				</div>

				<div>
					<label>
						Сохранить в:
						<select
							value={storageType}
							onChange={(e) =>
								onStorageType(e.target.value as "local" | "indexeddb")
							}
						>
							<option value="local">LocalStorage</option>
							<option value="indexeddb">IndexedDB</option>
						</select>
					</label>
				</div>

				<button type="submit">Добавить задачу</button>
			</form>
		</div>
	);
}

export default TaskForm;
