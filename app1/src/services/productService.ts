// 类型
import type { DatabaseMapper } from 'mockDB/mapper';
import type { Product } from 'mockDB/data/products';

// 模块联邦模块
const [
  { DATABASE_NAME }, // 数据库名称
  { PRODUCT_STORE_NAME }, // 商品表名称
  { DatabaseMapper: Mapper }, // 数据库映射器
  { default: ProductService }, // 商品服务
] = await Promise.all([
  import('shared/consts'),
  import('mockDB/store-names'),
  import('mockDB/mapper'),
  import('mockDB/services/product-service'),
]);

const productMapper: DatabaseMapper<Product> = new Mapper<Product>(DATABASE_NAME, PRODUCT_STORE_NAME);

export default new ProductService({
  productMapper,
  init: async () => {
    // 初始化商品表数据
    const productCount: number = await productMapper.count();
    if (productCount === 0) {
      console.log('商品表为空，开始初始化...');
      const { default: products } = await import('mockDB/data/products');
      await productMapper.insertBatch(products);
    }
  },
});
