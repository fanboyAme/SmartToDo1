import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TaskManager } from "./components/TaskManager";

import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<TaskManager>
			<App /> <Toaster position="bottom-center" />
		</TaskManager>
	</React.StrictMode>
);
