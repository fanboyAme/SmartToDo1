import { useState, useCallback, useEffect } from "react";
import { Priority, Task } from "../types/task";
import { TaskSortBy } from "../services/taskApi";
import { ApiError } from "../services/api";
import { authApi } from "../services/authApi";
import { AdminUser } from "../types/adminUser";
import { Language, translations } from "../i18n/translations";
import { useTaskStorage } from "./useTaskStorage";
import { useAuth } from "./useAuth";

interface AppliedFilters {
	title: string;
	priority: Priority | "all";
	completed: boolean | null;
	sortBy: TaskSortBy | "";
}

const initialAppliedFilters: AppliedFilters = {
	title: "",
	priority: "all",
	completed: null,
	sortBy: "SortNewDate",
};

export const useTaskManager = () => {
	const auth = useAuth();
	const isAuthenticated = auth.isAuthenticated;
	const isAdmin = auth.isAdmin;
	const logout = auth.logout;
	const [theme, setTheme] = useState<"light" | "dark">("dark");
	const [language, setLanguage] = useState<Language>(() => {
		const stored = localStorage.getItem("smarttodo_language");
		return stored === "ru" || stored === "en" ? stored : "ru";
	});

	const {
		tasks,
		totalTask,
		totalPage,
		isLoading,
		loadTasks,
		addTask,
		updateTask,
		deleteTask,
	} = useTaskStorage({
		isAuthenticated,
		onUnauthorized: logout,
	});

	const [filterTitle, setFilterTitle] = useState(initialAppliedFilters.title);
	const [filterPriority, setFilterPriority] = useState<Priority | "all">(initialAppliedFilters.priority);
	const [filterCompleted, setFilterCompleted] = useState<boolean | null>(initialAppliedFilters.completed);
	const [sortBy, setSortBy] = useState<TaskSortBy | "">(initialAppliedFilters.sortBy);
	const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(initialAppliedFilters);
	const [currentPage, setCurrentPage] = useState(1);
	const [tasksPerPage, setTasksPerPage] = useState(20);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isAdminUsersVisible, setIsAdminUsersVisible] = useState(false);
	const [isAdminUsersLoading, setIsAdminUsersLoading] = useState(false);
	const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
	const [adminUsersError, setAdminUsersError] = useState<string | null>(null);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		localStorage.setItem("smarttodo_language", language);
	}, [language]);

	useEffect(() => {
		if (!isAuthenticated) {
			setIsFormVisible(false);
			setEditingTask(null);
			setIsAdminUsersVisible(false);
			setAdminUsers([]);
			setAdminUsersError(null);
			return;
		}

		loadTasks({
			title: appliedFilters.title || undefined,
			priority: appliedFilters.priority === "all" ? undefined : appliedFilters.priority,
			isCompleted: appliedFilters.completed === null ? undefined : appliedFilters.completed,
			sortBy: appliedFilters.sortBy || undefined,
			page: currentPage,
			pageSize: tasksPerPage,
		});
	}, [isAuthenticated, appliedFilters, currentPage, loadTasks, tasksPerPage]);

	const applyFilters = useCallback(() => {
		setCurrentPage(1);
		setAppliedFilters({
			title: filterTitle.trim(),
			priority: filterPriority,
			completed: filterCompleted,
			sortBy,
		});
	}, [filterCompleted, filterPriority, filterTitle, sortBy]);

	const handleResetFilter = useCallback(() => {
		setFilterTitle(initialAppliedFilters.title);
		setFilterPriority(initialAppliedFilters.priority);
		setFilterCompleted(initialAppliedFilters.completed);
		setSortBy(initialAppliedFilters.sortBy);
		setAppliedFilters(initialAppliedFilters);
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

	const toggleTheme = useCallback(() => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	}, []);

	const toggleLanguage = useCallback(() => {
		setLanguage((prev) => (prev === "ru" ? "en" : "ru"));
	}, []);

	const handleSetTasksPerPage = useCallback((pageSize: number) => {
		setTasksPerPage(pageSize);
		setCurrentPage(1);
	}, []);

	const loadAdminUsers = useCallback(async () => {
		if (!isAdmin) return;

		setAdminUsersError(null);
		setIsAdminUsersLoading(true);
		try {
			const users = await authApi.getAllUsers();
			setAdminUsers(users);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				logout();
				return;
			}
			setAdminUsersError(error instanceof Error ? error.message : translations[language].usersLoadError);
		} finally {
			setIsAdminUsersLoading(false);
		}
	}, [isAdmin, language, logout]);

	const openAdminUsersModal = useCallback(async () => {
		setIsAdminUsersVisible(true);
		await loadAdminUsers();
	}, [loadAdminUsers]);

	const closeAdminUsersModal = useCallback(() => {
		setIsAdminUsersVisible(false);
	}, []);

	return {
		tasks,
		isLoading,
		taskCount: totalTask,
		currentTasks: tasks,
		totalPage,
		currentPage,
		tasksPerPage,
		isFormVisible,
		isAdminUsersVisible,
		isAdminUsersLoading,
		editingTask,
		filterTitle,
		filterPriority,
		filterCompleted,
		sortBy,
		theme,
		language,
		t: translations[language],
		adminUsers,
		adminUsersError,
		setTasksPerPage: handleSetTasksPerPage,
		setFilterTitle,
		setFilterPriority,
		setFilterCompleted,
		setSortBy,
		setCurrentPage,
		setIsFormVisible,
		setEditingTask,
		openAdminUsersModal,
		closeAdminUsersModal,
		loadAdminUsers,
		closeEditModal,
		toggleTheme,
		toggleLanguage,
		loadTasks,
		addNewTask,
		deleteTask,
		toggleTask,
		startEditing,
		handleSaveEditedTask,
		applyFilters,
		handleResetFilter,
		...auth,
	};
};
