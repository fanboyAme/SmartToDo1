export type Priority = "low" | "medium" | "high";
export interface Form {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	createdAt: Date;
	priority: Priority;
}
