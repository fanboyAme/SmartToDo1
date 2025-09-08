import { useTask } from "./TaskManager";

function Pagination() {
	const { currentPage, totalPage, setCurrentPage } = useTask();
	function getVisiblePages(
		currentPage: number,
		totalPage: number
	): (number | string)[] {
		const pages: (number | string)[] = [];
		pages.push(1);
		const leftBorder = Math.max(2, currentPage - 2);
		const rightBorder = Math.min(totalPage - 1, currentPage + 2);
		if (leftBorder - 1 > 1) {
			pages.push("...");
		}
		if (totalPage === 1) {
			return [1];
		}
		if (totalPage === 0) {
			return [];
		}
		for (let i = leftBorder; i <= rightBorder; i++) {
			pages.push(i);
		}
		if (rightBorder + 1 < totalPage) {
			pages.push("...");
		}
		pages.push(totalPage);
		return pages;
	}
	return (
		<div>
			<button
				type="button"
				disabled={currentPage === 1 || currentPage === 0}
				onClick={() => setCurrentPage(currentPage - 1)}
			>
				Назад
			</button>
			{getVisiblePages(currentPage, totalPage).map((item) => {
				if (typeof item === "number") {
					return (
						<div>
							<button onClick={() => setCurrentPage(item)}>{item}</button>
						</div>
					);
				} else {
					return <span>...</span>;
				}
			})}

			<button
				type="button"
				disabled={currentPage === totalPage || totalPage === 0}
				onClick={() => setCurrentPage(currentPage + 1)}
			>
				Вперед
			</button>
		</div>
	);
}
export default Pagination;
