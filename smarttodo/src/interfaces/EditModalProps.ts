import { Form } from "../types/task";
export interface EditModalProps {
	task: Form;
	onSave: (update: Partial<Form>) => Promise<void>;
	onClose: () => void;
}
