export type Priority = "low" | "medium" | "high";

export interface Task {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	createdAt: string;
	priority: Priority;
}
