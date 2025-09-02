import { useEffect, useState, useMemo } from "react";
import { Priority, Task } from "./types/task";
import TaskList from "./components/TaskList";
import { LocalStorageProvider } from "./services/LocalStorageProvider";
import EditModal from "./components/EditModal";
import { IndexedDbProvider } from "./services/IndexedDbProvider";
import TaskForm from "./components/TaskForm";
import Pagination from "./components/Pagination";
import toast from "react-hot-toast";

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [storageType, setStorageType] = useState<"local" | "indexeddb">(() => {
		const newValue = localStorage.getItem("smarttodo-storage-types");
		if (newValue === "local" || newValue === "indexeddb") {
			return newValue;
		} else {
			return "local";
		}
	});
	const providers = useMemo(
		() => ({
			local: new LocalStorageProvider(),
			indexeddb: new IndexedDbProvider(),
		}),
		[]
	);
	const provider = providers[storageType];
	const [filterTitle, setFiltredTitle] = useState<string>("");
	const [filterPriorities, setFilterPriorities] = useState<Priority[]>([]);
	const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

	useEffect(() => {
		const loadTasks = async () => {
			setIsLoading(true);
			const savedTasks = await provider.getAllTask();
			setTasks(savedTasks);
			setIsLoading(false);
		};
		loadTasks();
	}, [provider]);
	useEffect(() => {
		if (editingTask && !tasks.find((t) => t.id === editingTask.id)) {
			setEditingTask(null);
		}
	}, [tasks, setEditingTask]);
	const priorityWeight = {
		high: 3,
		medium: 2,
		low: 1,
	};
	const [currentPage, setCurrentPage] = useState(1);
	const tasksPerPage = 9;
	const indexLastTask = tasksPerPage * currentPage;
	const indexFirstTask = indexLastTask - tasksPerPage;
	const filteredTask = getFiltredTask();
	const currentTask = filteredTask.slice(indexFirstTask, indexLastTask);
	const totalPage = Math.ceil(filteredTask.length / tasksPerPage);
	const addNewTask = async (
		newTaskData: Omit<Task, "id" | "createdAt" | "completed">
	) => {
		const createdTask = await provider.createTask(newTaskData);
		setTasks((prevTasks) => [...prevTasks, createdTask]);
		toast.success("Задача добавлена! ");
	};

	const deleteTask = async (id: string) => {
		await provider.deleteTask(id);
		setTasks((prevTask) => prevTask.filter((tasks) => tasks.id !== id));
		toast.success("Задача удалена! ");
	};

	const toggleTask = async (id: string) => {
		const taskToToggle = tasks.find((currentTask) => currentTask.id === id);
		if (!taskToToggle) {
			toast.error(" Что-то пошло не так");
			return;
		}
		const updates = { completed: !taskToToggle.completed };
		await provider.updateTask(id, updates);
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
		setEditingTask(null);
		toast.success("Статус изменен! ");
	};
	const startEditing = (task: Task): void => {
		setEditingTask(task);
	};
	const handleSaveEditedTask = async (
		updates: Partial<Task>
	): Promise<void> => {
		if (editingTask == null) {
			return;
		}
		const updateTask = await provider.updateTask(editingTask.id, updates);
		setTasks((prevTask) =>
			prevTask.map((task) =>
				task.id === editingTask.id ? { ...task, ...updates } : task
			)
		);
		setEditingTask(null);
		toast.success("Задача обновлена! ");
	};
	function getFiltredTask() {
		let res = tasks;
		if (filterTitle) {
			res = res.filter((task) =>
				task.title.toLowerCase().includes(filterTitle.toLowerCase())
			);
		}
		if (filterCompleted !== null) {
			res = res.filter((task) => task.completed === filterCompleted);
		}
		if (filterPriorities.length > 0) {
			res = res.filter((task) => filterPriorities.includes(task.priority));
		}
		res.sort((A, B) => {
			const weightA = priorityWeight[A.priority];
			const weightB = priorityWeight[B.priority];
			return weightB - weightA;
		});
		return res;
	}
	function handleResetFilter() {
		setFiltredTitle("");
		setFilterCompleted(null);
		setFilterPriorities([]);
	}

	return (
		<div>
			{isLoading ? (
				<div>загрузка</div>
			) : (
				<>
					{" "}
					<TaskForm
						onAddTask={addNewTask}
						storageType={storageType}
						onStorageType={setStorageType}
						filterTitle={filterTitle}
						onFiltredTitle={setFiltredTitle}
						filterPriorities={filterPriorities}
						onFilterPriorities={setFilterPriorities}
						filterCompleted={filterCompleted}
						onFilterCompleted={setFilterCompleted}
						onResetFilter={handleResetFilter}
					/>
					<TaskList
						tasks={currentTask}
						onToggleTask={toggleTask}
						onDeleteTask={deleteTask}
						onStartEditing={startEditing}
						currentPage={currentPage}
						totalPage={totalPage}
					/>
					{editingTask && (
						<EditModal
							task={editingTask}
							onSave={handleSaveEditedTask}
							onClose={() => setEditingTask(null)}
						/>
					)}
				</>
			)}
			<Pagination
				currentPage={currentPage}
				totalPage={totalPage}
				onCurrentPage={setCurrentPage}
			/>
		</div>
	);
}
export default App;
