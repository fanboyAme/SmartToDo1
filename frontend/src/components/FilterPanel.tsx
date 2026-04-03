import { useTask } from "./TaskManager";
import { Priority } from "../types/task";
import { TaskSortBy } from "../services/taskApi";
import "../styles/FilterPanel.css";

function FilterPanel() {
	const {
		filterTitle,
		setFilterTitle,
		filterPriority,
		setFilterPriority,
		filterCompleted,
		setFilterCompleted,
		sortBy,
		setSortBy,
		applyFilters,
		handleResetFilter,
		t,
	} = useTask();

	return (
		<aside className="filterPanel">
			<h3>{t.filterTitle}</h3>

			<div className="searchGroup">
				<input
					type="text"
					value={filterTitle}
					onChange={(event) => setFilterTitle(event.target.value)}
					className="searchInput"
					placeholder=" "
				/>
				<span className="searchLabel">{t.searchByTitle}</span>
			</div>

			<div className="filterSection">
				<h4>{t.priority}</h4>
				<select
					value={filterPriority}
					onChange={(event) => setFilterPriority(event.target.value as Priority | "all")}
					className="filterSelect"
				>
					<option value="all">{t.all}</option>
					<option value="high">{t.priorityHighLabel}</option>
					<option value="medium">{t.priorityMediumLabel}</option>
					<option value="low">{t.priorityLowLabel}</option>
				</select>
			</div>

			<div className="filterSection">
				<h4>{t.status}</h4>
				<div className="statusButtons">
					<button
						type="button"
						onClick={() => setFilterCompleted(null)}
						className={`statusButton ${filterCompleted === null ? "active" : ""}`}
					>
						{t.allTasks}
					</button>
					<button
						type="button"
						onClick={() => setFilterCompleted(true)}
						className={`statusButton ${filterCompleted === true ? "active" : ""}`}
					>
						{t.doneTasks}
					</button>
					<button
						type="button"
						onClick={() => setFilterCompleted(false)}
						className={`statusButton ${filterCompleted === false ? "active" : ""}`}
					>
						{t.undoneTasks}
					</button>
				</div>
			</div>

			<div className="filterSection">
				<h4>{t.sorting}</h4>
				<select
					value={sortBy}
					onChange={(event) => setSortBy(event.target.value as TaskSortBy)}
					className="filterSelect"
				>
					<option value="SortNewDate">{t.newFirst}</option>
					<option value="SortOldDate">{t.oldFirst}</option>
					<option value="SortNameA">{t.nameAZ}</option>
					<option value="SortNameZ">{t.nameZA}</option>
					<option value="SortHighPriority">{t.priorityHigh}</option>
					<option value="SortLowPriotrity">{t.priorityLow}</option>
				</select>
			</div>

			<div className="filterActions">
				<button type="button" onClick={applyFilters} className="applyButton">
					{t.apply}
				</button>
				<button type="button" onClick={handleResetFilter} className="resetButton">
					{t.resetFilters}
				</button>
			</div>
		</aside>
	);
}

export default FilterPanel;
