import { Task } from "../types/task";
export interface EditModalProps {
	task: Task;
	onSave: (update: Partial<Task>) => Promise<void>;
	onClose: () => void;
}
