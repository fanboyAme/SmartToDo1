import { Task } from "../types/task";
export interface TaskListProps {
	tasks: Task[];
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onStartEditing: (task: Task) => void;
}
