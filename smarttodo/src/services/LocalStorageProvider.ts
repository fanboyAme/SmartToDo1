import { Form } from "../types/task";
import { IStorageProvider } from "../interfaces/IStorageProvider";
export class LocalStorageProvider implements IStorageProvider {
	async getAllTask(): Promise<Form[]> {
		const savedData = localStorage.getItem("smarttodo-tasks");
		if (savedData == null) {
			return [];
		}
		try {
			const parsedTasks = JSON.parse(savedData);
			if (Array.isArray(parsedTasks)) {
				return parsedTasks;
			} else {
				return [];
			}
		} catch (error) {
			return [];
		}
	}
	private saveTasks(tasks: Form[]): void {
		const jsonString = JSON.stringify(tasks);
		localStorage.setItem("smarttodo-tasks", jsonString);
	}
	async createTask(
		task: Omit<Form, "id" | "createdAt" | "completed">
	): Promise<Form> {
		const newTask = {
			id: crypto.randomUUID(),
			title: task.title,
			description: task.description,
			completed: false,
			createdAt: new Date(),
			priority: task.priority,
		};

		const allTask = await this.getAllTask();
		allTask.push(newTask);
		await this.saveTasks(allTask);
		return newTask;
	}
	async updateTask(id: string, update: Partial<Form>): Promise<void> {
		const actualTask = await this.getAllTask();
		const updateTask = actualTask.map((currentTask) => {
			if (currentTask.id === id) {
				return { ...currentTask, ...update };
			} else {
				return currentTask;
			}
		});
		this.saveTasks(updateTask);
	}
	async deleteTask(id: string): Promise<void> {
		const actualTask = await this.getAllTask();
		const deleteTask = actualTask.filter((prevTask) => prevTask.id !== id);
		this.saveTasks(deleteTask);
	}
}
