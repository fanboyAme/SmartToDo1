import { TaskCardProps } from "../interfaces/TaskCardProps";
import { useTask } from "./TaskManager";
import "../styles/TaskCard.css";

function TaskCard({ task, onToggleTask, onDeleteTask, onStartEditing, isBusy }: TaskCardProps) {
	const { t } = useTask();

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const priorityLabel =
		task.priority === "high"
			? t.priorityHighLabel
			: task.priority === "medium"
				? t.priorityMediumLabel
				: t.priorityLowLabel;

	return (
		<div className="taskCard" data-priority={task.priority} data-completed={task.completed}>
			<div className="taskHeader">
				<div className="taskTitleSection">
					<h3 className={`taskTitle ${task.completed ? "completed" : ""}`}>{task.title}</h3>
					<input
						type="checkbox"
						checked={task.completed}
						onChange={() => onToggleTask(task.id)}
						className="taskCheckbox"
						disabled={isBusy}
						aria-label={task.completed ? t.undoneTasks : t.doneTasks}
					/>
				</div>

				<p className="taskDescription">{task.description || "\u00A0"}</p>
			</div>

			<div className="taskMeta">
				<span className={`taskPriority ${task.priority}`}>{priorityLabel}</span>
				<span className="taskDate">{formatDate(task.createdAt)}</span>
			</div>

			<div className="taskActions">
				<button
					onClick={() => onStartEditing(task)}
					className="taskButton editButton"
					aria-label={t.edit}
					disabled={isBusy}
				>
					{t.edit}
				</button>
				<button
					onClick={() => onDeleteTask(task.id)}
					className="taskButton deleteButton"
					aria-label={t.delete}
					disabled={isBusy}
				>
					{isBusy ? "..." : t.delete}
				</button>
			</div>
		</div>
	);
}

export default TaskCard;
