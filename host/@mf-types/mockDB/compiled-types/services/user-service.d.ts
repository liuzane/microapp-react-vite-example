import type { Result, PageResponse } from '@/types';
import type { DatabaseMapper } from '@/mapper';
import type { User } from '@/data/users';
import BaseService from './base-service';
export default class UserService extends BaseService {
    private userMapper;
    private init?;
    private initPromise?;
    private isReady;
    constructor(options: UserServiceOptions);
    /**
     * 等待初始化任务完成
     */
    private ready;
    /**
     * 分页查询用户，支持姓名模糊搜索和状态筛选
     * @param params.currentPage 当前页码（从1开始）
     * @param params.pageSize 每页条数
     * @param params.searchText 用户姓名或邮箱模糊匹配关键字
     * @param params.status 状态筛选（可选）
     * @returns 分页结果
     */
    getUsersByPage(params: UserSearchParams): Promise<Result<PageResponse<User> | void>>;
    /**
     * 获取全量用户
     * @returns 用户数组
     */
    getAllUsers(): Promise<Result<User[]>>;
    /**
     * 获取单条用户
     * @param id 用户ID
     * @returns 用户对象
     */
    getUser(id: number): Promise<Result<User | void>>;
    /**
     * 更新或新增用户
     * @param dto 用户数据传输对象
     * @returns 更新的ID
     */
    updateUser(dto: UserUpdateDTO): Promise<Result<number | void>>;
    /**
     * 删除用户
     * @param id 用户ID
     */
    deleteUser(id: number): Promise<Result<void>>;
}
export interface UserServiceOptions {
    userMapper: DatabaseMapper<User>;
    init?: () => Promise<void>;
}
export interface UserSearchParams {
    currentPage?: number;
    pageSize?: number;
    searchText?: string;
    status?: string;
}
export interface UserUpdateDTO {
    id?: number;
    name: string;
    phone: string;
    email: string;
    status: string;
    roleName: string;
}
