import React, { useEffect, useState } from "react";
import { Priority, Form } from "./types/task";
import TaskList from "./components/TaskList";

function App() {
	function loadInitialTasks() {
		const savedData = localStorage.getItem("smarttodo-tasks");
		if (savedData == null) {
			return [];
		}
		try {
			const parsedTasks = JSON.parse(savedData);
			if (Array.isArray(parsedTasks)) {
				return parsedTasks;
			} else {
				return [];
			}
		} catch (error) {
			return [];
		}
	}
	const [tasks, setTasks] = useState<Form[]>(loadInitialTasks);
	useEffect(() => {
		const localTask = JSON.stringify(tasks);
		localStorage.setItem("smarttodo-tasks", localTask);
	}, [tasks]);
	const addNewTask = (newTaskData: {
		title: string;
		description?: string;
		priority: Priority;
	}) => {
		const newTask = {
			id: crypto.randomUUID(),
			title: newTaskData.title,
			description: newTaskData.description,
			completed: false,
			createdAt: new Date(),
			priority: newTaskData.priority,
		};

		setTasks((prevTasks) => [...prevTasks, newTask]);
	};
	function toggleTask(id: string) {
		setTasks(
			tasks.map((currentTask) => {
				if (currentTask.id === id) {
					return { ...currentTask, completed: !currentTask.completed };
				} else {
					return currentTask;
				}
			})
		);
	}
	function deleteTask(id: string) {
		setTasks(tasks.filter((prevTask) => prevTask.id !== id));
	}
	return (
		<div>
			<TaskList
				tasks={tasks}
				onAddTask={addNewTask}
				onToggleTask={toggleTask}
				onDeleteTask={deleteTask}
			/>
		</div>
	);
}

export default App;
