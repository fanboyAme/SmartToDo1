import React from "react";
import { useTask } from "./TaskManager";
import { Priority } from "../types/task";

function FilterPanel() {
	const {
		filterTitle,
		setFilterTitle,
		filterPriorities,
		setFilterPriorities,
		filterCompleted,
		setFilterCompleted,
		handleResetFilter,
	} = useTask();

	return (
		<div>
			<div>
				<input
					value={filterTitle}
					onChange={(e) => setFilterTitle(e.target.value)}
					placeholder="Поиск по названию"
				/>
			</div>

			{/* Приоритеты */}
			<div>
				<input
					type="checkbox"
					id="priority-low"
					checked={filterPriorities.includes("low")}
					onChange={(e) => {
						if (e.target.checked) {
							setFilterPriorities([...filterPriorities, "low"]);
						} else {
							setFilterPriorities(filterPriorities.filter((p) => p !== "low"));
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
							setFilterPriorities([...filterPriorities, "medium"]);
						} else {
							setFilterPriorities(
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
							setFilterPriorities([...filterPriorities, "high"]);
						} else {
							setFilterPriorities(filterPriorities.filter((p) => p !== "high"));
						}
					}}
				/>
				<label htmlFor="priority-high">High</label>
			</div>

			{/* Статус выполнения */}
			<div>
				<button
					type="button"
					onClick={() => setFilterCompleted(null)}
					className={filterCompleted === null ? "active" : ""}
				>
					Все задачи
				</button>
				<button
					type="button"
					onClick={() => setFilterCompleted(true)}
					className={filterCompleted === true ? "active" : ""}
				>
					Выполненные
				</button>
				<button
					type="button"
					onClick={() => setFilterCompleted(false)}
					className={filterCompleted === false ? "active" : ""}
				>
					Не выполненные
				</button>
			</div>

			<div>
				<button type="button" onClick={handleResetFilter}>
					Сбросить фильтры
				</button>
			</div>
		</div>
	);
}

export default FilterPanel;
