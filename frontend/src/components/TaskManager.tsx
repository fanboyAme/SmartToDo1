import React, { createContext, useContext } from "react";
import { useTaskManager } from "../hooks/useTaskManager";
import EditModal from "./EditModal";
import TaskForm from "./TaskForm";
import Header from "./Header";
import AuthModal from "./AuthModal";
import AdminUsersModal from "./AdminUsersModal";

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
			{taskManager.isAuthenticated && <Header />}
			{taskManager.isFormVisible && taskManager.isAuthenticated && (
				<TaskForm
					onAddTask={taskManager.addNewTask}
					onClose={() => taskManager.setIsFormVisible(false)}
				/>
			)}
			{taskManager.editingTask && taskManager.isAuthenticated && (
				<EditModal
					task={taskManager.editingTask}
					onSave={taskManager.handleSaveEditedTask}
					onClose={() => taskManager.setEditingTask(null)}
				/>
			)}
			{taskManager.isAuthenticated &&
				taskManager.isAdmin &&
				taskManager.isAdminUsersVisible && (
					<AdminUsersModal
						users={taskManager.adminUsers}
						isLoading={taskManager.isAdminUsersLoading}
						error={taskManager.adminUsersError}
						onClose={taskManager.closeAdminUsersModal}
						onReload={taskManager.loadAdminUsers}
					/>
				)}
			{!taskManager.isAuthChecking && !taskManager.isAuthenticated && (
				<AuthModal
					mode={taskManager.authMode}
					error={taskManager.authError}
					verificationEmail={taskManager.verificationEmail}
					defaultLogin={taskManager.defaultLogin}
					defaultEmail={taskManager.defaultEmail}
					onModeChange={taskManager.setAuthMode}
					onLogin={taskManager.login}
					onRegister={taskManager.register}
					onVerify={taskManager.verifyEmail}
					onResend={taskManager.resendVerificationCode}
				/>
			)}
			{children}
		</TaskContext.Provider>
	);
}
