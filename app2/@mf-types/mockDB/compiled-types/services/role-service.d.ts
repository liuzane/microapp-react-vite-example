import type { Result, PageResponse } from '@/types';
import type { DatabaseMapper } from '@/mapper';
import type { Role } from '@/data/roles';
import BaseService from './base-service';
export default class RoleService extends BaseService {
    private roleMapper;
    private init?;
    private initPromise?;
    private isReady;
    constructor(options: RoleServiceOptions);
    /**
     * 等待初始化任务完成
     */
    private ready;
    /**
     * 分页查询角色，支持名称模糊搜索和状态筛选
     * @param params.currentPage 当前页码（从1开始）
     * @param params.pageSize 每页条数
     * @param params.searchText 角色名称或编码模糊匹配关键字
     * @param params.status 状态筛选（可选）
     * @returns 分页结果
     */
    getRolesByPage(params: RoleSearchParams): Promise<Result<PageResponse<Role> | void>>;
    /**
     * 获取全量角色
     * @returns 角色数组
     */
    getAllRoles(): Promise<Result<Role[]>>;
    /**
     * 获取单条角色
     * @param id 角色ID
     * @returns 角色对象
     */
    getRole(id: number): Promise<Result<Role | void>>;
    /**
     * 更新或新增角色
     * @param dto 角色数据传输对象
     * @returns 更新的ID
     */
    updateRole(dto: RoleUpdateDTO): Promise<Result<number | void>>;
    /**
     * 删除角色
     * @param id 角色ID
     */
    deleteRole(id: number): Promise<Result<void>>;
}
export interface RoleServiceOptions {
    roleMapper: DatabaseMapper<Role>;
    init?: () => Promise<void>;
}
export interface RoleSearchParams {
    currentPage?: number;
    pageSize?: number;
    searchText?: string;
    status?: string;
}
export interface RoleUpdateDTO {
    id?: number;
    name: string;
    code: string;
    status: string;
    description?: string;
}
