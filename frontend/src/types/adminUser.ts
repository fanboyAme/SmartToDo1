export interface AdminUser {
	id: string;
	login: string;
	email: string;
	userRole: string | number;
	emailConfirmed: boolean;
}
