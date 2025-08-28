import React, { useEffect, useState } from "react";
import { Task } from "./types/task";
import TaskList from "./components/TaskList";
import { LocalStorageProvider } from "./services/LocalStorageProvider";
import EditModal from "./components/EditModal";
import { IndexedDbProvider } from "./services/IndexedDbProvider";
import TaskForm from "./components/TaskForm";

const providers = {
	local: new LocalStorageProvider(),
	indexeddb: new IndexedDbProvider(),
};

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [storageType, setStorageType] = useState<"local" | "indexeddb">(
		"local"
	);
	const provider = providers[storageType];

	useEffect(() => {
		const loadTasks = async () => {
			setIsLoading(true);
			const savedTasks = await provider.getAllTask();
			setTasks(savedTasks);
			setIsLoading(false);
		};
		loadTasks();
	}, [provider]);
	const addNewTask = async (
		newTaskData: Omit<Task, "id" | "createdAt" | "completed">
	) => {
		const createdTask = await provider.createTask(newTaskData);
		setTasks((prevTasks) => [...prevTasks, createdTask]);
	};

	const deleteTask = async (id: string) => {
		await provider.deleteTask(id);
		setTasks((prevTask) => prevTask.filter((tasks) => tasks.id !== id));
	};

	const toggleTask = async (id: string) => {
		const taskToToggle = tasks.find((currentTask) => currentTask.id === id);
		if (!taskToToggle) {
			return;
		}
		const updates = { completed: !taskToToggle.completed };
		await provider.updateTask(id, updates);
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};
	const startEditing = (task: Task): void => {
		setEditingTask(task);
	};
	const handleSaveEditedTask = async (updates: Partial<Task>) => {
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
		function Load() {
			if (isLoading == true) {
				return <div>загрузка</div>;
			}
		}
		const selectStorage = (event: React.ChangeEvent<HTMLSelectElement>) => {
			setStorageType(event.target.value as "local" | "indexeddb");
		};
	};
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
					/>
					<TaskList
						tasks={tasks}
						onToggleTask={toggleTask}
						onDeleteTask={deleteTask}
						onStartEditing={startEditing}
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
		</div>
	);
}
export default App;
