import React, { createContext, useContext } from "react";
import { useTaskManager } from "../hooks/useTaskManager";
import EditModal from "./EditModal";
import TaskForm from "./TaskForm";
import Header from "./Header";

const TaskContext = createContext<ReturnType<typeof useTaskManager> | null>(
	null
);

export const useTask = () => {
	const context = useContext(TaskContext);
	if (!context) throw new Error("useTask must be used within TaskManager");
	return context;
};

interface TaskManagerProps {
	children: React.ReactNode;
}

export function TaskManager({ children }: TaskManagerProps) {
	const taskManager = useTaskManager();

	return (
		<TaskContext.Provider value={taskManager}>
			<Header />
			{taskManager.isFormVisible && (
				<TaskForm
					onAddTask={taskManager.addNewTask}
					onClose={() => taskManager.setIsFormVisible(false)}
					storageType={taskManager.storageType}
					onStorageType={taskManager.setStorageType}
				/>
			)}
			{children}
			{taskManager.editingTask && (
				<EditModal
					task={taskManager.editingTask}
					onSave={taskManager.handleSaveEditedTask}
					onClose={() => taskManager.setEditingTask(null)}
				/>
			)}
		</TaskContext.Provider>
	);
}
