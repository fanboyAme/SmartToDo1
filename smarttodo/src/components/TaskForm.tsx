import React, { useState } from "react";
import { Task, Priority } from "../types/task";
import { TaskFormProps } from "../interfaces/TaskFormProps";

function TaskForm({
	onAddTask,
	storageType,
	onStorageType,
	filterCompleted,
	filterPriorities,
	filterTitle,
	onFilterCompleted,
	onFilterPriorities,
	onFiltredTitle,
	onResetFilter,
}: TaskFormProps) {
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
		const newValue = event.target.value as "local" | "indexeddb";
		localStorage.setItem("smarttodo-storage-types", newValue);
		onStorageType(newValue);
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
			<div>
				<input
					value={filterTitle}
					onChange={(e) => onFiltredTitle(e.target.value)}
				></input>
			</div>
			<div>
				<input
					type="checkbox"
					id="priority-low"
					checked={filterPriorities.includes("low")}
					onChange={(e) => {
						if (e.target.checked) {
							onFilterPriorities([...filterPriorities, "low"]);
						} else {
							onFilterPriorities(filterPriorities.filter((p) => p !== "low"));
						}
					}}
				/>
				<label htmlFor="priority-low">Low</label>
			</div>
			<div>
				<input
					type="checkbox"
					id="priority-medium"
					checked={filterPriorities.includes("medium")}
					onChange={(e) => {
						if (e.target.checked) {
							onFilterPriorities([...filterPriorities, "medium"]);
						} else {
							onFilterPriorities(
								filterPriorities.filter((p) => p !== "medium")
							);
						}
					}}
				/>
				<label htmlFor="priority-medium">Medium</label>
			</div>
			<div>
				<input
					type="checkbox"
					id="priority-high"
					checked={filterPriorities.includes("high")}
					onChange={(e) => {
						if (e.target.checked) {
							onFilterPriorities([...filterPriorities, "high"]);
						} else {
							onFilterPriorities(filterPriorities.filter((p) => p !== "high"));
						}
					}}
				/>
				<label htmlFor="priority-high">High</label>
			</div>
			<div>
				<button
					type="button"
					onClick={() => onFilterCompleted(null)}
					className={filterCompleted === null ? "active" : ""}
				>
					Все задачи
				</button>
				<button
					type="button"
					onClick={() => onFilterCompleted(true)}
					className={filterCompleted === true ? "active" : ""}
				>
					Выполненные
				</button>
				<button
					type="button"
					onClick={() => onFilterCompleted(false)}
					className={filterCompleted === false ? "active" : ""}
				>
					Не выполненные
				</button>
			</div>
			<div>
				<button type="button" onClick={onResetFilter}>
					Сбросить фильтры
				</button>
			</div>
		</form>
	);
}
export default TaskForm;
