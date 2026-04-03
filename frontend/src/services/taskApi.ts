import { apiRequest } from "./api";
import { Priority, Task } from "../types/task";

interface BackendTask {
	id: string;
	title: string;
	description?: string;
	isCompleted: boolean;
	createdAt: string;
	priority: string | number;
}

interface TasksResponse {
	item: BackendTask[];
	totalTask: number;
	totalPage: number;
	page: number;
	pageSize: number;
}

export type TaskSortBy =
	| "SortNameA"
	| "SortNameZ"
	| "SortNewDate"
	| "SortOldDate"
	| "SortHighPriority"
	| "SortLowPriotrity";

export interface TaskQueryParams {
	title?: string;
	isCompleted?: boolean;
	priority?: Priority;
	sortBy?: TaskSortBy;
	page?: number;
	pageSize?: number;
}

interface TaskPageResult {
	items: Task[];
	totalTask: number;
	totalPage: number;
	page: number;
	pageSize: number;
}

const normalizePriority = (priority: string | number): Priority => {
	if (typeof priority === "number") {
		if (priority === 2) return "high";
		if (priority === 1) return "medium";
		return "low";
	}

	switch (priority.toLowerCase()) {
		case "high":
			return "high";
		case "medium":
			return "medium";
		default:
			return "low";
	}
};

const toTask = (backendTask: BackendTask): Task => ({
	id: backendTask.id,
	title: backendTask.title,
	description: backendTask.description,
	completed: backendTask.isCompleted,
	createdAt: backendTask.createdAt,
	priority: normalizePriority(backendTask.priority),
});

const toBackendPriority = (priority: Priority) => {
	switch (priority) {
		case "high":
			return 2;
		case "medium":
			return 1;
		default:
			return 0;
	}
};

export const taskApi = {
	fetchTasks(query: TaskQueryParams): Promise<TaskPageResult> {
		return apiRequest<TasksResponse>("/api/tasks", {
			method: "GET",
			auth: true,
			query: {
				title: query.title,
				isCompleted: query.isCompleted,
				priority:
					query.priority === undefined
						? undefined
						: toBackendPriority(query.priority),
				sortBy: query.sortBy,
				page: query.page,
				pageSize: query.pageSize,
			},
		}).then((response) => ({
			items: response.item.map(toTask),
			totalTask: response.totalTask,
			totalPage: response.totalPage,
			page: response.page,
			pageSize: response.pageSize,
		}));
	},
	createTask(payload: Pick<Task, "title" | "description" | "priority">) {
		return apiRequest<BackendTask>("/api/tasks/Addendum", {
			method: "POST",
			auth: true,
			body: {
				title: payload.title,
				description: payload.description,
				priority: toBackendPriority(payload.priority),
			},
		}).then(toTask);
	},
	updateTask(id: string, payload: Partial<Task>, currentTask: Task) {
		const mergedTask = {
			title: payload.title ?? currentTask.title,
			description: payload.description ?? currentTask.description,
			priority: payload.priority ?? currentTask.priority,
			completed: payload.completed ?? currentTask.completed,
		};

		return apiRequest<unknown>(`/api/tasks/Update/${id}`, {
			method: "PATCH",
			auth: true,
			body: {
				title: mergedTask.title,
				description: mergedTask.description,
				priority: toBackendPriority(mergedTask.priority),
				isCompleted: mergedTask.completed,
			},
		});
	},
	deleteTask(id: string) {
		return apiRequest<unknown>(`/api/tasks/Delete/${id}`, {
			method: "DELETE",
			auth: true,
		});
	},
};
