import { useState, useCallback } from "react";
import { Task, Priority } from "../types/task";
import { useTaskStorage } from "./useTaskStorage";
import { useTaskFilter } from "./useTaskFilter";
import { useTaskPagination } from "./useTaskPagination";

export const useTaskManager = () => {
	// Хранилище
	const {
		tasks,
		isLoading,
		storageType,
		setStorageType,
		loadTasks,
		addTask,
		updateTask,
		deleteTask,
	} = useTaskStorage();

	// Фильтрация
	const [filterTitle, setFilterTitle] = useState("");
	const [filterPriorities, setFilterPriorities] = useState<Priority[]>([]);
	const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

	const { filteredTasks } = useTaskFilter({
		tasks,
		filterTitle,
		filterPriorities,
		filterCompleted,
	});

	// Пагинация
	const [currentPage, setCurrentPage] = useState(1);
	const tasksPerPage = 20;

	const { currentTasks, totalPage } = useTaskPagination({
		tasks: filteredTasks,
		currentPage,
		tasksPerPage,
	});

	// UI состояния
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	// Методы
	const handleResetFilter = useCallback(() => {
		setFilterTitle("");
		setFilterPriorities([]);
		setFilterCompleted(null);
		setCurrentPage(1);
	}, []);

	const toggleTask = useCallback(
		async (id: string) => {
			const taskToToggle = tasks.find((task) => task.id === id);
			if (!taskToToggle) return;

			await updateTask(id, { completed: !taskToToggle.completed });
		},
		[tasks, updateTask]
	);

	const startEditing = useCallback((task: Task) => {
		setEditingTask(task);
	}, []);

	const handleSaveEditedTask = useCallback(
		async (updates: Partial<Task>) => {
			if (!editingTask) return;
			await updateTask(editingTask.id, updates);
			setEditingTask(null);
		},
		[editingTask, updateTask]
	);

	const addNewTask = useCallback(
		async (newTaskData: Omit<Task, "id" | "createdAt" | "completed">) => {
			await addTask(newTaskData);
			setIsFormVisible(false);
		},
		[addTask]
	);
	const closeEditModal = useCallback(() => {
		setEditingTask(null);
	}, []);

	return {
		// Состояния
		tasks,
		isLoading,
		taskCount: tasks.length,
		currentTasks,
		totalPage,
		currentPage,
		tasksPerPage,
		isFormVisible,
		editingTask,
		storageType,

		// Фильтры
		filterTitle,
		filterPriorities,
		filterCompleted,

		// Сеттеры
		setFilterTitle,
		setFilterPriorities,
		setFilterCompleted,
		setCurrentPage,
		setIsFormVisible,
		setEditingTask,
		setStorageType,

		// Методы
		closeEditModal,
		loadTasks,
		addNewTask,
		deleteTask,
		toggleTask,
		startEditing,
		handleSaveEditedTask,
		handleResetFilter,
	};
};
