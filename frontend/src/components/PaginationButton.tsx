import { useTask } from "./TaskManager";
import "../styles/PaginationButton.css";

function PaginationButton() {
	const { currentPage, totalPage, setCurrentPage, tasks, tasksPerPage } =
		useTask();

	const totalTasks = tasks.length;
	const startIndex = totalTasks > 0 ? (currentPage - 1) * tasksPerPage + 1 : 0;
	const endIndex = Math.min(currentPage * tasksPerPage, totalTasks);

	const getVisiblePages = (
		currentPage: number,
		totalPage: number
	): (number | string)[] => {
		if (totalPage <= 1) return [1];
		if (totalPage === 0) return [];

		const pages: (number | string)[] = [];
		const showPages = 5;

		let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
		let endPage = Math.min(totalPage, startPage + showPages - 1);

		if (endPage - startPage + 1 < showPages) {
			startPage = Math.max(1, endPage - showPages + 1);
		}

		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) pages.push("...");
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < totalPage) {
			if (endPage < totalPage - 1) pages.push("...");
			pages.push(totalPage);
		}

		return pages;
	};

	if (totalPage <= 1) return null;

	return (
		<>
			{totalTasks > 0 && (
				<div className="paginationInfo">
					Показано{" "}
					<strong>
						{startIndex}-{endIndex}
					</strong>{" "}
					из <strong>{totalTasks}</strong> задач
					{totalPage > 1 && ` (Страница ${currentPage} из ${totalPage})`}
				</div>
			)}

			{totalPage > 1 && (
				<div className="pagination">
					<button
						className="paginationButton"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage(currentPage - 1)}
					>
						←
					</button>

					{getVisiblePages(currentPage, totalPage).map((item, index) =>
						typeof item === "number" ? (
							<button
								key={index}
								className={`paginationButton ${
									currentPage === item ? "active" : ""
								}`}
								onClick={() => setCurrentPage(item)}
							>
								{item}
							</button>
						) : (
							<span key={index} className="paginationDots">
								{item}
							</span>
						)
					)}

					<button
						className="paginationButton"
						disabled={currentPage === totalPage}
						onClick={() => setCurrentPage(currentPage + 1)}
					>
						→
					</button>
				</div>
			)}
		</>
	);
}

export default PaginationButton;
