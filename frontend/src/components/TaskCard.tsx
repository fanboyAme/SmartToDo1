import { TaskCardProps } from "../interfaces/TaskCardProps";
import "../styles/TaskCard.css";

function TaskCard({
	task,
	onToggleTask,
	onDeleteTask,
	onStartEditing,
}: TaskCardProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const handleCheckboxChange = () => {
		onToggleTask(task.id);
	};

	const handleEditClick = () => {
		onStartEditing(task);
	};

	const handleDeleteClick = () => {
		onDeleteTask(task.id);
	};

	return (
		<div
			className="taskCard"
			data-priority={task.priority}
			data-completed={task.completed}
		>
			<div className="taskHeader">
				<div className="taskTitleSection">
					<h3 className={`taskTitle ${task.completed ? "completed" : ""}`}>
						{task.title}
					</h3>
					<input
						type="checkbox"
						checked={task.completed}
						onChange={handleCheckboxChange}
						className="taskCheckbox"
						aria-label={
							task.completed
								? "Отметить как невыполненную"
								: "Отметить как выполненную"
						}
					/>
				</div>

				{task.description && (
					<p className="taskDescription">{task.description}</p>
				)}
			</div>

			<div className="taskMeta">
				<span className={`taskPriority ${task.priority}`}>{task.priority}</span>
				<span className="taskDate">{formatDate(task.createdAt)}</span>
			</div>

			<div className="taskActions">
				<button
					onClick={handleEditClick}
					className="taskButton editButton"
					aria-label="Редактировать задачу"
				>
					Редактировать
				</button>
				<button
					onClick={handleDeleteClick}
					className="taskButton deleteButton"
					aria-label="Удалить задачу"
				>
					Удалить
				</button>
			</div>
		</div>
	);
}

export default TaskCard;
