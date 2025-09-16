import { Task } from "../types/task";
import { IStorageProvider } from "../interfaces/IStorageProvider";
export class LocalStorageProvider implements IStorageProvider {
	async getAllTask(): Promise<Task[]> {
		const savedData = localStorage.getItem("smarttodo-tasks");
		if (savedData == null) {
			return [];
		}
		try {
			const parsedTasks = JSON.parse(savedData);
			if (Array.isArray(parsedTasks)) {
				const filtredTask = parsedTasks.filter(
					(element) =>
						typeof element === "object" &&
						element !== null &&
						typeof element.title === "string" &&
						(typeof element.description === "string" ||
							element.description === undefined) &&
						typeof element.id === "string" &&
						["low", "medium", "high"].includes(element.priority)
				);
				return filtredTask;
			} else {
				return [];
			}
		} catch (error) {
			return [];
		}
	}
	private saveTasks(tasks: Task[]): void {
		const jsonString = JSON.stringify(tasks);
		localStorage.setItem("smarttodo-tasks", jsonString);
	}
	async createTask(
		task: Omit<Task, "id" | "createdAt" | "completed">
	): Promise<Task> {
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
	async updateTask(id: string, update: Partial<Task>): Promise<void> {
		const actualTask = await this.getAllTask();
		const taskMap = new Map(actualTask.map((task) => [task.id, task]));
		const taskToUpdate = taskMap.get(id);
		if (taskToUpdate) {
			taskMap.set(id, { ...taskToUpdate, ...update });
		}
		const updatedTask = Array.from(taskMap.values());
		this.saveTasks(updatedTask);
	}
	async deleteTask(id: string): Promise<void> {
		const actualTask = await this.getAllTask();
		const deleteTask = actualTask.filter((prevTask) => prevTask.id !== id);
		this.saveTasks(deleteTask);
	}
}
