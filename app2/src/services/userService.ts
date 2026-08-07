// 类型
import type { DatabaseMapper } from 'mockDB/mapper';
import type { User } from 'mockDB/data/users';

// 远程模块
const [
  { DATABASE_NAME }, // 数据库名称
  { USER_STORE_NAME }, // 用户表名称
  { DatabaseMapper: Mapper }, // 数据库映射器
  { default: UserService }, // 用户服务
] = await Promise.all([
  import('shared/consts'),
  import('mockDB/store-names'),
  import('mockDB/mapper'),
  import('mockDB/services/UserService'),
]);

const userMapper: DatabaseMapper<User> = new Mapper<User>(DATABASE_NAME, USER_STORE_NAME);

export default new UserService({
  userMapper,
  init: async () => {
    // 初始化用户表数据
    const userCount: number = await userMapper.count();
    if (userCount === 0) {
      console.log('用户表为空，开始初始化...');
      const { default: users } = await import('mockDB/data/users');
      await userMapper.insertBatch(users);
    }
  },
});
