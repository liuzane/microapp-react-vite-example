import type { Result, PageResponse } from '@/types';
import type { DatabaseMapper } from '@/mapper';
import type { Order } from '@/data/orders';
import BaseService from './base-service';
export default class OrderService extends BaseService {
    private orderMapper;
    private init?;
    private initPromise?;
    private isReady;
    constructor(options: OrderServiceOptions);
    /**
     * 等待初始化任务完成
     */
    private ready;
    /**
     * 分页查询订单，支持订单号模糊搜索和状态筛选
     * @param params.currentPage 当前页码（从1开始）
     * @param params.pageSize 每页条数
     * @param params.searchText 订单号模糊匹配关键字
     * @param params.status 状态筛选（可选）
     * @returns 分页结果
     */
    getOrdersByPage(params: OrderSearchParams): Promise<Result<PageResponse<Order> | void>>;
    /**
     * 获取全量订单
     * @returns 订单数组
     */
    getAllOrders(): Promise<Result<Order[]>>;
    /**
     * 获取单条订单
     * @param id 订单ID
     * @returns 订单对象
     */
    getOrder(id: number): Promise<Result<Order | void>>;
    /**
     * 更新或新增订单
     * @param dto 订单数据传输对象
     * @returns 更新的ID
     */
    updateOrder(dto: OrderUpdateDTO): Promise<Result<number | void>>;
    /**
     * 删除订单
     * @param id 订单ID
     */
    deleteOrder(id: number): Promise<Result<void>>;
}
export interface OrderServiceOptions {
    orderMapper: DatabaseMapper<Order>;
    init?: () => Promise<void>;
}
export interface OrderSearchParams {
    currentPage?: number;
    pageSize?: number;
    searchText?: string;
    status?: string;
}
export interface OrderUpdateDTO {
    id?: number;
    productName: string;
    customerName: string;
    amount: number;
    status: string;
    phone: string;
    address: string;
}
