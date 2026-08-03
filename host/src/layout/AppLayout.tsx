// 基础模块
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

// 组件
import AppSider from './AppSider';
import AppHeader from './AppHeader';

const { Content } = Layout;

/**
 * 主布局组件
 * 负责整体布局
 */
export function AppLayout() {
  return (
    <Layout className="h-full">
      <AppSider />
      <Layout className="h-full">
        <AppHeader />
        <Content
          className="m-4 rounded-md overflow-auto relative"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
