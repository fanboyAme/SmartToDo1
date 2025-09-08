import React from "react";
import { useTask } from "./TaskManager";

function Header() {
	const { taskCount, setIsFormVisible, isFormVisible } = useTask();

	return (
		<div>
			<p>Количество Задач {taskCount}</p>
			<button onClick={() => setIsFormVisible(!isFormVisible)}>
				{isFormVisible ? "✕ Закрыть" : "+ Создать задачу"}
			</button>
		</div>
	);
}

export default Header;
