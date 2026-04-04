import { useCallback, useEffect, useRef, useState } from "react";
import { Task } from "../types/task";
import { ApiError } from "../services/api";
import { TaskQueryParams, taskApi } from "../services/taskApi";

interface UseTaskStorageOptions {
	isAuthenticated: boolean;
	onUnauthorized: () => void;
}

const defaultQuery: TaskQueryParams = {
	page: 1,
	pageSize: 20,
};

const isKnownUpdateSerializationError = (error: unknown) => {
	return (
		error instanceof ApiError &&
		error.status >= 500 &&
		error.message.includes("AsyncTaskMethodBuilder")
	);
};

const isNotFoundError = (error: unknown) => {
	return error instanceof ApiError && error.status === 404;
};

export const useTaskStorage = ({
	isAuthenticated,
	onUnauthorized,
}: UseTaskStorageOptions) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [totalTask, setTotalTask] = useState(0);
	const [totalPage, setTotalPage] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [isLoading, setIsLoading] = useState(true);
	const lastQueryRef = useRef<TaskQueryParams>(defaultQuery);

	const handleApiError = useCallback(
		(error: unknown) => {
			if (error instanceof ApiError && error.status === 401) {
				onUnauthorized();
			}
		},
		[onUnauthorized]
	);

	const loadTasks = useCallback(
		async (query?: TaskQueryParams) => {
			if (!isAuthenticated) {
				setTasks([]);
				setTotalTask(0);
				setTotalPage(0);
				setPage(1);
				setIsLoading(false);
				return;
			}

			const effectiveQuery = {
				...lastQueryRef.current,
				...query,
			};
			lastQueryRef.current = effectiveQuery;

			setIsLoading(true);
			try {
				const response = await taskApi.fetchTasks(effectiveQuery);
				setTasks(response.items);
				setTotalTask(response.totalTask);
				setTotalPage(response.totalPage);
				setPage(response.page);
				setPageSize(response.pageSize);
			} catch (error) {
				console.error("Ошибка загрузки задач:", error);
				handleApiError(error);
			} finally {
				setIsLoading(false);
			}
		},
		[handleApiError, isAuthenticated]
	);

	useEffect(() => {
		loadTasks(defaultQuery);
	}, [loadTasks]);

	const reloadLastQuery = useCallback(async () => {
		await loadTasks(lastQueryRef.current);
	}, [loadTasks]);

	const addTask = useCallback(
		async (newTaskData: Omit<Task, "id" | "createdAt" | "completed">) => {
			try {
				await taskApi.createTask(newTaskData);
				await reloadLastQuery();
			} catch (error) {
				handleApiError(error);
				throw error;
			}
		},
		[handleApiError, reloadLastQuery]
	);

	const updateTask = useCallback(
		async (id: string, updates: Partial<Task>) => {
			const currentTask = tasks.find((task) => task.id === id);
			if (!currentTask) {
				return;
			}

			try {
				await taskApi.updateTask(id, updates, currentTask);
				await reloadLastQuery();
			} catch (error) {
				if (isKnownUpdateSerializationError(error)) {
					await reloadLastQuery();
					return;
				}
				if (isNotFoundError(error)) {
					await reloadLastQuery();
					return;
				}
				handleApiError(error);
				throw error;
			}
		},
		[handleApiError, reloadLastQuery, tasks]
	);

	const deleteTask = useCallback(
		async (id: string) => {
			try {
				await taskApi.deleteTask(id);
				await reloadLastQuery();
			} catch (error) {
				if (isNotFoundError(error)) {
					await reloadLastQuery();
					return;
				}
				handleApiError(error);
				throw error;
			}
		},
		[handleApiError, reloadLastQuery]
	);

	return {
		tasks,
		totalTask,
		totalPage,
		page,
		pageSize,
		isLoading,
		loadTasks,
		addTask,
		updateTask,
		deleteTask,
	};
};
