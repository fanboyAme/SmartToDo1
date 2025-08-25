import { Form } from "../types/task";

export interface IStorageProvider {
	getAllTask(): Promise<Form[]>;
	updateTask(id: string, update: Partial<Form>): Promise<void>;
	deleteTask(id: string): Promise<void>;
	createTask(task: Omit<Form, "id" | "createdAt">): Promise<Form>;
}
