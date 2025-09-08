import { useMemo } from "react";
import { Task } from "../types/task";

interface UseTaskPaginationProps {
	tasks: Task[];
	currentPage: number;
	tasksPerPage: number;
}

export const useTaskPagination = ({
	tasks,
	currentPage,
	tasksPerPage,
}: UseTaskPaginationProps) => {
	const { currentTasks, totalPage } = useMemo(() => {
		const indexOfLastTask = currentPage * tasksPerPage;
		const indexOfFirstTask = indexOfLastTask - tasksPerPage;
		const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
		const totalPage = Math.ceil(tasks.length / tasksPerPage);

		return { currentTasks, totalPage };
	}, [tasks, currentPage, tasksPerPage]);

	return { currentTasks, totalPage };
};
