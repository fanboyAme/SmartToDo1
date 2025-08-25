import React, { useEffect, useState } from "react";
import { Form } from "./types/task";
import TaskList from "./components/TaskList";
import { LocalStorageProvider } from "./services/LocalStorageProvider";
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
	return (
		<div>
			<TaskList
				tasks={tasks}
				onAddTask={addNewTask}
				onToggleTask={toggleTask}
				onDeleteTask={deleteTask}
				onStartEditing={startEditing}
			/>
		</div>
	);
}

export default App;
