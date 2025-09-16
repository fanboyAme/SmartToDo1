import { Priority } from "../types/task";
export interface TaskFormProps {
	onAddTask: (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => void;
	storageType: "local" | "indexeddb";
	onStorageType: (type: "local" | "indexeddb") => void;
	onClose: () => void;
}
