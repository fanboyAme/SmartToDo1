import { Task } from "../types/task";
export interface TaskCardProps {
	task: Task;
	onToggleTask: (id: string) => Promise<void>;
	onDeleteTask: (id: string) => Promise<void>;
	onStartEditing: (task: Task) => void;
	isBusy: boolean;
}
