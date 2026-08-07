import type { Result } from '@/types';
export default class BaseService {
    /**
     * 创建成功 Result 对象
     * @param data 数据
     * @param msg 消息
     * @returns Result 对象
     */
    success<T>(data?: T, msg?: string): Result<T>;
    /**
     * 创建失败 Result 对象
     * @param msg 消息
     * @param code 状态码
     * @returns Result 对象
     */
    fail<T extends void>(msg?: string, code?: number): Result<T>;
}
