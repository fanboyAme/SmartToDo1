export interface PaginationProps {
	currentPage: number;
	totalPage: number;
	onCurrentPage: (value: number) => void;
}
