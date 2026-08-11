// 类型
import type { DatabaseMapper } from 'mockDB/mapper';
import type { Role } from 'mockDB/data/roles';

// 远程模块
const [
  { DATABASE_NAME }, // 数据库名称
  { ROLE_STORE_NAME }, // 角色表名称
  { DatabaseMapper: Mapper }, // 数据库映射器
  { default: RoleService }, // 角色服务
] = await Promise.all([
  import('shared/consts'),
  import('mockDB/store-names'),
  import('mockDB/mapper'),
  import('mockDB/services/role-service'),
]);

const roleMapper: DatabaseMapper<Role> = new Mapper<Role>(DATABASE_NAME, ROLE_STORE_NAME);

export default new RoleService({
  roleMapper,
  init: async () => {
    // 初始化角色表数据
    const roleCount: number = await roleMapper.count();
    if (roleCount === 0) {
      console.log('角色表为空，开始初始化...');
      const { default: roles } = await import('mockDB/data/roles');
      await roleMapper.insertBatch(roles);
    }
  },
});
