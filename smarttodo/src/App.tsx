import React, { useEffect, useState } from "react";
import { Form } from "./types/task";
import TaskList from "./components/TaskList";
import { LocalStorageProvider } from "./services/LocalStorageProvider";
import EditModal from "./components/EditModal";

const provider = new LocalStorageProvider();

function App() {
	const [tasks, setTasks] = useState<Form[]>([]);
	const [editingTask, setEditingTask] = useState<Form | null>(null);

	useEffect(() => {
		const loadTasks = async () => {
			const savedTasks = await provider.getAllTask();
			setTasks(savedTasks);
		};
		loadTasks();
	}, []);
	const addNewTask = async (
		newTaskData: Omit<Form, "id" | "createdAt" | "completed">
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
	const startEditing = (task: Form): void => {
		setEditingTask(task);
	};
	const handleSaveEditedTask = async (updates: Partial<Form>) => {
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
	};
	return (
		<div>
			<TaskList
				tasks={tasks}
				onAddTask={addNewTask}
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
		</div>
	);
}

export default App;
