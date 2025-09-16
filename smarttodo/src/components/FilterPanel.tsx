import { useTask } from "./TaskManager";
import "../styles/FilterPanel.css";

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
		<aside className="filterPanel">
			<h3>Фильтры</h3>

			{/* Search input */}
			<div className="searchGroup">
				<input
					type="text"
					value={filterTitle}
					onChange={(e) => setFilterTitle(e.target.value)}
					className="searchInput"
					placeholder=" "
				/>
				<span className="searchLabel">Поиск по названию</span>
			</div>

			{/* Priorities */}
			<div className="filterSection">
				<h4>Приоритет</h4>
				{["high", "medium", "low"].map((priority) => (
					<div key={priority} className="checkboxGroup">
						<input
							type="checkbox"
							id={`priority-${priority}`}
							checked={filterPriorities.includes(priority as any)}
							onChange={(e) => {
								if (e.target.checked) {
									setFilterPriorities([...filterPriorities, priority as any]);
								} else {
									setFilterPriorities(
										filterPriorities.filter((p) => p !== priority)
									);
								}
							}}
						/>
						<label htmlFor={`priority-${priority}`}>
							{priority.charAt(0).toUpperCase() + priority.slice(1)}
						</label>
					</div>
				))}
			</div>

			{/* Status */}
			<div className="filterSection">
				<h4>Статус</h4>
				<div className="statusButtons">
					<button
						type="button"
						onClick={() => setFilterCompleted(null)}
						className={`statusButton ${
							filterCompleted === null ? "active" : ""
						}`}
					>
						Все задачи
					</button>
					<button
						type="button"
						onClick={() => setFilterCompleted(true)}
						className={`statusButton ${
							filterCompleted === true ? "active" : ""
						}`}
					>
						Выполненные
					</button>
					<button
						type="button"
						onClick={() => setFilterCompleted(false)}
						className={`statusButton ${
							filterCompleted === false ? "active" : ""
						}`}
					>
						Не выполненные
					</button>
				</div>
			</div>

			<button type="button" onClick={handleResetFilter} className="resetButton">
				Сбросить фильтры
			</button>
		</aside>
	);
}

export default FilterPanel;
