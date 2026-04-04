import { Priority } from "../types/task";

export interface TaskFormProps {
	onAddTask: (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => void;
	onClose: () => void;
}
