import { Task } from "../types/task";
import { IStorageProvider } from "../interfaces/IStorageProvider";
import { openDB } from "idb";

export class IndexedDbProvider implements IStorageProvider {
	private dbPromise;

	constructor() {
		this.dbPromise = openDB("SmartToDoDB", 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains("tasks")) {
					db.createObjectStore("tasks", { keyPath: "id" });
				}
			},
		});
	}

	async getAllTask(): Promise<Task[]> {
		const db = await this.dbPromise;
		const allTask = await db.getAll("tasks");
		return allTask;
	}
	async updateTask(id: string, update: Partial<Task>): Promise<void> {
		try {
			const db = await this.dbPromise;
			const task = await db.get("tasks", id);
			if (!task) {
				throw new Error("id задачи не найден");
			}
			const updateTask = { ...task, ...update };
			await db.put("tasks", updateTask);
		} catch (error) {
			console.error("Ошибка обновления задачи", error);
			throw error;
		}
	}
	async deleteTask(id: string): Promise<void> {
		const db = await this.dbPromise;
		await db.delete("tasks", id);
	}
	async createTask(
		task: Omit<Task, "id" | "createdAt" | "completed">
	): Promise<Task> {
		const db = await this.dbPromise;
		const createdTaskForm = {
			id: crypto.randomUUID(),
			title: task.title,
			description: task.description,
			completed: false,
			createdAt: new Date(),
			priority: task.priority,
		};
		await db.put("tasks", createdTaskForm);
		return createdTaskForm;
	}
}
