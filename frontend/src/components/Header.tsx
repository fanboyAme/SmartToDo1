import { useTask } from "./TaskManager";
import "../styles/main.css";

function Header() {
	const { taskCount, setIsFormVisible, isFormVisible } = useTask();

	return (
		<header className="header">
			<div>
				<h1 className="headerTitle">Менеджер задач</h1>
				<p className="headerStats">Количество задач: {taskCount}</p>
			</div>
			<button
				className="headerButton"
				onClick={() => setIsFormVisible(!isFormVisible)}
			>
				{isFormVisible ? "✕ Закрыть" : "+ Создать задачу"}
			</button>
		</header>
	);
}

export default Header;
