import { useState, useCallback, useMemo, useEffect } from "react";
import { Task, Priority } from "../types/task";
import { LocalStorageProvider } from "../services/LocalStorageProvider";
import { IndexedDbProvider } from "../services/IndexedDbProvider";

export const useTaskStorage = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [storageType, setStorageType] = useState<"local" | "indexeddb">(
		"local"
	);

	const providers = useMemo(
		() => ({
			local: new LocalStorageProvider(),
			indexeddb: new IndexedDbProvider(),
		}),
		[]
	);

	const provider = providers[storageType];

	const loadTasks = useCallback(async () => {
		setIsLoading(true);
		try {
			const savedTasks = await provider.getAllTask();
			setTasks(savedTasks);
		} catch (error) {
			console.error("Ошибка загрузки задач:", error);
		} finally {
			setIsLoading(false);
		}
	}, [provider]);
	useEffect(() => {
		loadTasks();
	}, [loadTasks]);

	const addTask = useCallback(
		async (newTaskData: Omit<Task, "id" | "createdAt" | "completed">) => {
			const createdTask = await provider.createTask(newTaskData);
			setTasks((prev) => [...prev, createdTask]);
			return createdTask;
		},
		[provider]
	);

	const updateTask = useCallback(
		async (id: string, updates: Partial<Task>) => {
			await provider.updateTask(id, updates);
			setTasks((prev) =>
				prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
			);
		},
		[provider]
	);

	const deleteTask = useCallback(
		async (id: string) => {
			await provider.deleteTask(id);
			setTasks((prev) => prev.filter((task) => task.id !== id));
		},
		[provider]
	);

	return {
		tasks,
		isLoading,
		storageType,
		setStorageType,
		loadTasks,
		addTask,
		updateTask,
		deleteTask,
		provider,
	};
};
