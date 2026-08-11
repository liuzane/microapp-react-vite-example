// 类型
import type { DatabaseMapper } from 'mockDB/mapper';
import type { Order } from 'mockDB/data/orders';

// 远程模块
const [
  { DATABASE_NAME }, // 数据库名称
  { ORDER_STORE_NAME }, // 订单表名称
  { DatabaseMapper: Mapper }, // 数据库映射器
  { default: OrderService }, // 订单服务
] = await Promise.all([
  import('shared/consts'),
  import('mockDB/store-names'),
  import('mockDB/mapper'),
  import('mockDB/services/order-service'),
]);

const orderMapper: DatabaseMapper<Order> = new Mapper<Order>(DATABASE_NAME, ORDER_STORE_NAME);

export default new OrderService({
  orderMapper,
  init: async () => {
    // 初始化订单表数据
    const orderCount: number = await orderMapper.count();
    if (orderCount === 0) {
      console.log('订单表为空，开始初始化...');
      const { default: orders } = await import('mockDB/data/orders');
      await orderMapper.insertBatch(orders);
    }
  },
});
