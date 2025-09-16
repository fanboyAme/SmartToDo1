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
	const { paginatedTasks, totalPage } = useMemo(() => {
		const indexOfLastTask = currentPage * tasksPerPage;
		const indexOfFirstTask = indexOfLastTask - tasksPerPage;
		const paginatedTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
		const totalPage = Math.ceil(tasks.length / tasksPerPage);

		return { paginatedTasks, totalPage };
	}, [tasks, currentPage, tasksPerPage]);

	return { paginatedTasks, totalPage };
};
