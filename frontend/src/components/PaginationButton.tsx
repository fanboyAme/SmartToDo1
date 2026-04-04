import { useTask } from "./TaskManager";
import "../styles/PaginationButton.css";

function PaginationButton() {
	const { currentPage, totalPage, setCurrentPage, taskCount, tasksPerPage, currentTasks, t } =
		useTask();

	const totalTasks = taskCount;
	const startIndex = totalTasks > 0 ? (currentPage - 1) * tasksPerPage + 1 : 0;
	const endIndex = totalTasks > 0 ? startIndex + currentTasks.length - 1 : 0;

	const getVisiblePages = (
		currentPageValue: number,
		totalPageValue: number
	): (number | string)[] => {
		if (totalPageValue <= 1) return [1];
		if (totalPageValue === 0) return [];

		const pages: (number | string)[] = [];
		const showPages = 5;

		let startPage = Math.max(1, currentPageValue - Math.floor(showPages / 2));
		let endPage = Math.min(totalPageValue, startPage + showPages - 1);

		if (endPage - startPage + 1 < showPages) {
			startPage = Math.max(1, endPage - showPages + 1);
		}

		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) pages.push("...");
		}

		for (let index = startPage; index <= endPage; index += 1) {
			pages.push(index);
		}

		if (endPage < totalPageValue) {
			if (endPage < totalPageValue - 1) pages.push("...");
			pages.push(totalPageValue);
		}

		return pages;
	};

	if (totalPage <= 1) return null;

	return (
		<>
			{totalTasks > 0 && (
				<div className="paginationInfo">
					{t.shown} <strong>{startIndex}-{endIndex}</strong> {t.of} <strong>{totalTasks}</strong>
					{totalPage > 1 && ` (${t.page} ${currentPage} ${t.of} ${totalPage})`}
				</div>
			)}

			{totalPage > 1 && (
				<div className="pagination">
					<button
						className="paginationButton"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage(currentPage - 1)}
					>
						{"<"}
					</button>

					{getVisiblePages(currentPage, totalPage).map((item, index) =>
						typeof item === "number" ? (
							<button
								key={index}
								className={`paginationButton ${currentPage === item ? "active" : ""}`}
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
						{">"}
					</button>
				</div>
			)}
		</>
	);
}

export default PaginationButton;
