import { useState, useCallback, useEffect } from "react";
import { Task, Priority } from "../types/task";
import { useTaskStorage } from "./useTaskStorage";
import { useTaskFilter } from "./useTaskFilter";
import { useTaskPagination } from "./useTaskPagination";

export const useTaskManager = () => {
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

	const [filterTitle, setFilterTitle] = useState("");
	const [filterPriorities, setFilterPriorities] = useState<Priority[]>([]);
	const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

	const { filteredTasks } = useTaskFilter({
		tasks,
		filterTitle,
		filterPriorities,
		filterCompleted,
	});

	const [currentPage, setCurrentPage] = useState(1);
	const [tasksPerPage, setTasksPerPage] = useState(20);

	const { paginatedTasks, totalPage } = useTaskPagination({
		tasks: filteredTasks,
		currentPage,
		tasksPerPage,
	});

	const [isFormVisible, setIsFormVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

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
	useEffect(() => {
		const newTotalPage = Math.ceil(filteredTasks.length / tasksPerPage);

		if (currentPage > newTotalPage && newTotalPage > 0) {
			setCurrentPage(1);
		} else if (currentPage < 1 && filteredTasks.length > 0) {
			setCurrentPage(1);
		}
	}, [tasksPerPage, filteredTasks.length, currentPage, setCurrentPage]);

	return {
		tasks,
		isLoading,
		taskCount: tasks.length,
		currentTasks: paginatedTasks,
		totalPage,
		currentPage,
		tasksPerPage,
		isFormVisible,
		editingTask,
		storageType,
		filterTitle,
		filterPriorities,
		filterCompleted,
		setTasksPerPage,
		setFilterTitle,
		setFilterPriorities,
		setFilterCompleted,
		setCurrentPage,
		setIsFormVisible,
		setEditingTask,
		setStorageType,
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
