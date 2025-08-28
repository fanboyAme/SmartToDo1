import { Task } from "../types/task";

export interface IStorageProvider {
	getAllTask(): Promise<Task[]>;
	updateTask(id: string, update: Partial<Task>): Promise<void>;
	deleteTask(id: string): Promise<void>;
	createTask(task: Omit<Task, "id" | "createdAt">): Promise<Task>;
}
