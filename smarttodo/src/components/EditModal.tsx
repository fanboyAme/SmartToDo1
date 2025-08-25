import React, { useState } from "react";
import App from "../App";

function EditModalProps(tasks) {
	const [title, setTitle] = useState();
	const [description, setDescription] = useState();
	const [priority, setPriority] = useState();
	const [completed, setCompleted] = useState();
	return <div>EditModalProps</div>;
}
export default EditModalProps;
