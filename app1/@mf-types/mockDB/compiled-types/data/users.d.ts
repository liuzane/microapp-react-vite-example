export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: string;
    roleName: string;
    lastLoginTime: string;
    createTime: string;
    updateTime: string;
}
declare const users: User[];
export default users;
