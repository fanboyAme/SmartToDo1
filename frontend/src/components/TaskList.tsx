import { useCallback, useState } from "react";
import { useTask } from "./TaskManager";
import TaskCard from "./TaskCard";
import Pagination from "./PaginationButton";
import "../styles/TaskList.css";

function TaskList() {
	const {
		currentTasks,
		toggleTask,
		deleteTask,
		startEditing,
		tasksPerPage,
		setTasksPerPage,
		t,
	} = useTask();
	const [busyTaskIds, setBusyTaskIds] = useState<Set<string>>(new Set());

	const runWithBusy = useCallback(async (id: string, action: () => Promise<void>) => {
		setBusyTaskIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});

		try {
			await action();
		} finally {
			setBusyTaskIds((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
		}
	}, []);

	const handleToggleTask = useCallback(
		async (id: string) => {
			if (busyTaskIds.has(id)) return;
			await runWithBusy(id, async () => {
				await toggleTask(id);
			});
		},
		[busyTaskIds, runWithBusy, toggleTask]
	);

	const handleDeleteTask = useCallback(
		async (id: string) => {
			if (busyTaskIds.has(id)) return;
			await runWithBusy(id, async () => {
				await deleteTask(id);
			});
		},
		[busyTaskIds, deleteTask, runWithBusy]
	);

	return (
		<div className="taskListContainer">
			<h2 className="taskListTitle">{t.tasks}</h2>

			<div className="tasksPerPageSelector">
				<span className="tasksPerPageLabel">{t.tasksPerPage}:</span>
				<select
					value={tasksPerPage}
					onChange={(event) => setTasksPerPage(Number(event.target.value))}
					className="tasksPerPageSelect"
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>

			<ul className="taskGrid">
				{currentTasks.length === 0 ? (
					<li className="emptyState">{t.noTasksFound}</li>
				) : (
					currentTasks.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							onToggleTask={handleToggleTask}
							onDeleteTask={handleDeleteTask}
							onStartEditing={startEditing}
							isBusy={busyTaskIds.has(task.id)}
						/>
					))
				)}
			</ul>

			<Pagination />
		</div>
	);
}

export default TaskList;
