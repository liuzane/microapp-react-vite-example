export interface Role {
    id: number;
    name: string;
    code: string;
    status: string;
    description: string;
    createTime: string;
    updateTime: string;
}
declare const roles: Role[];
export default roles;
