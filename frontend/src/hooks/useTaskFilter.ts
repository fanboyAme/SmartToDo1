import { useMemo } from "react";
import { Task, Priority } from "../types/task";

interface UseTaskFilterProps {
	tasks: Task[];
	filterTitle: string;
	filterPriorities: Priority[];
	filterCompleted: boolean | null;
}

const priorityWeight: Record<Priority, number> = {
	high: 3,
	medium: 2,
	low: 1,
};

export const useTaskFilter = ({
	tasks,
	filterTitle,
	filterPriorities,
	filterCompleted,
}: UseTaskFilterProps) => {
	const filteredTasks = useMemo(() => {
		let result = tasks;

		if (filterTitle) {
			result = result.filter((task) =>
				task.title.toLowerCase().includes(filterTitle.toLowerCase())
			);
		}

		if (filterCompleted !== null) {
			result = result.filter((task) => task.completed === filterCompleted);
		}

		if (filterPriorities.length > 0) {
			result = result.filter((task) =>
				filterPriorities.includes(task.priority)
			);
		}

		return result.sort((a, b) => {
			const weightA = priorityWeight[a.priority];
			const weightB = priorityWeight[b.priority];
			return weightB - weightA;
		});
	}, [tasks, filterTitle, filterCompleted, filterPriorities]);

	return { filteredTasks };
};