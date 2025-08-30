import { Priority } from "../types/task";
export interface TaskFormProps {
	onAddTask: (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => void;
	storageType: "local" | "indexeddb";
	onStorageType: (type: "local" | "indexeddb") => void;
	filterTitle: string;
	onFiltredTitle: (type: string) => void;
	filterPriorities: Priority[];
	onFilterPriorities: (type: Priority[]) => void;
	filterCompleted: boolean | null;
	onFilterCompleted: (type: boolean | null) => void;
	onResetFilter: () => void;
}
