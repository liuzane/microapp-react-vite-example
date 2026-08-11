import type { Result, PageResponse } from '@/types';
import type { DatabaseMapper } from '@/mapper';
import type { Product } from '@/data/products';
import BaseService from './base-service';
export default class ProductService extends BaseService {
    private productMapper;
    private init?;
    private initPromise?;
    private isReady;
    constructor(options: ProductServiceOptions);
    /**
     * 等待初始化任务完成
     */
    private ready;
    /**
     * 分页查询商品，支持名称模糊搜索和分类、状态筛选
     * @param params.currentPage 当前页码（从1开始）
     * @param params.pageSize 每页条数
     * @param params.searchText 商品编号或名称模糊匹配关键字
     * @param params.category 分类筛选（可选）
     * @param params.status 状态筛选（可选）
     * @returns 分页结果
     */
    getProductsByPage(params: ProductSearchParams): Promise<Result<PageResponse<Product> | void>>;
    /**
     * 获取全量商品
     * @returns 商品数组
     */
    getAllProducts(): Promise<Result<Product[]>>;
    /**
     * 获取单条商品
     * @param id 商品ID
     * @returns 商品对象
     */
    getProduct(id: number): Promise<Result<Product | void>>;
    /**
   * 更新或新增商品
   * @param dto 商品数据传输对象
   * @returns 更新的ID
   */
    updateProduct(dto: ProductUpdateDTO): Promise<Result<number | void>>;
    /**
     * 删除商品
     * @param id 商品ID
     */
    deleteProduct(id: number): Promise<Result<void>>;
}
export interface ProductServiceOptions {
    productMapper: DatabaseMapper<Product>;
    init?: () => Promise<void>;
}
export interface ProductSearchParams {
    currentPage?: number;
    pageSize?: number;
    searchText?: string;
    category?: string;
    status?: string;
}
export interface ProductUpdateDTO {
    id?: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    supplier: string;
    description?: string;
}
