import { Task } from "../types/task";
export interface TaskCardProps {
	task: Task;
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onStartEditing: (task: Task) => void;
}
