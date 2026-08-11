import type { PageResponse } from './types';
/**
 * 数据库操作工具类（类似 Java 的 Mapper）
 * 使用方式：new DatabaseMapper<T>(storeName) 后调用增删改查方法
 */
export declare class DatabaseMapper<T> {
    private readonly dbName;
    private readonly storeName;
    constructor(databaseName: string, storeName: string);
    /**
     * 打开数据库连接
     */
    private openDB;
    /**
     * 获取数据库连接、事务和对象存储
     * @param mode 事务模式（readonly 或 readwrite）
     */
    private getStore;
    /**
     * 分页查询（支持过滤条件）
     * @param page 当前页码（从1开始）
     * @param pageSize 每页条数
     * @param filter 过滤函数
     */
    pageQuery(page: number, pageSize: number, filter?: (item: T) => boolean): Promise<PageResponse<T>>;
    /**
     * 统计记录数（支持过滤条件）
     * @param filter 过滤函数（可选）
     */
    count(filter?: (item: T) => boolean): Promise<number>;
    /**
     * 查询多条数据
     * @param filter 过滤函数
     */
    selectList(filter: (item: T) => boolean): Promise<T[]>;
    /**
     * 查询单条数据
     * @param filter 过滤函数
     */
    selectOne(filter: (item: T) => boolean): Promise<T | null>;
    /**
     * 根据主键获取单条数据
     * @param key 主键值
     */
    selectByKey(key: string | number): Promise<T | null>;
    /**
     * 根据主键获取多条数据
     * @param keys 主键值数组
     */
    selectByKeys(keys: (string | number)[]): Promise<T[]>;
    /**
     * 获取所有数据
     */
    selectAll(): Promise<T[]>;
    /**
     * 插入单条数据
     * @param item 要插入的数据
     */
    insert(item: T | Record<string, unknown>): Promise<IDBValidKey>;
    /**
     * 批量插入数据
     * @param items 要插入的数据数组
     */
    insertBatch(items: (T | Record<string, unknown>)[]): Promise<IDBValidKey[]>;
    /**
     * 更新数据
     * @param item 要更新的数据（必须包含主键）
     */
    update(item: T): Promise<IDBValidKey>;
    /**
     * 根据主键删除数据
     * @param key 主键值
     */
    deleteByKey(key: string | number): Promise<void>;
    /**
     * 清空所有数据
     */
    clear(): Promise<void>;
}
