import React, { useState } from "react";
import { Task, Priority } from "../types/task";
interface TaskFormProps {
	onAddTask: (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => void;
	storageType: "local" | "indexeddb";
	onStorageType: (type: "local" | "indexeddb") => void;
}

function TaskForm({ onAddTask, storageType, onStorageType }: TaskFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<Priority>("low");

	const inputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};
	const inputDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};
	const selectPriopity = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setPriority(event.target.value as Priority);
	};
	const selectStorage = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onStorageType(event.target.value as "local" | "indexeddb");
	};
	function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
		event.preventDefault();
		onAddTask({ title, priority, description });
	}
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>
					Название
					<input type="text" value={title} onChange={inputTitle}></input>
				</label>
			</div>
			<div>
				<label>
					Описание
					<textarea
						value={description}
						onChange={inputDescription}
					></textarea>{" "}
				</label>
			</div>
			<div>
				<label>
					Приоритет
					<select value={priority} onChange={selectPriopity}>
						<option value={"low"}>low</option>
						<option value={"medium"}>medium</option>
						<option value={"high"}>high</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Сохранить:
					<select value={storageType} onChange={selectStorage}>
						<option value={"local"}>LocalStorage</option>
						<option value={"indexeddb"}>IndexedDb</option>
					</select>
				</label>
			</div>
			<button type="submit">Добавить</button>
		</form>
	);
}
export default TaskForm;
