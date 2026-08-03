// 基础模块
import { useState } from 'react';
import { Card } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  SettingOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

// 组件
import SharedMenu from '@/components/SharedMenu';

export default function SharedMenuUsage() {
  // 示例1: 基础菜单状态
  const [selectedKey, setSelectedKey] = useState('home');
  const [openKeys, setOpenKeys] = useState(['system']);

  // 示例1: 基础侧边栏菜单
  const basicMenuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <LaptopOutlined />,
      label: '首页',
    },
    {
      key: 'order',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
    },
    {
      key: 'product',
      icon: <FolderOpenOutlined />,
      label: '产品管理',
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'report',
      icon: <BarChartOutlined />,
      label: '数据报表',
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 示例2: 嵌套菜单
  const nestedMenuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <LaptopOutlined />,
      label: '数据看板',
    },
    {
      key: 'system',
      icon: <FolderOpenOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'system-user',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: 'system-role',
          icon: <FileTextOutlined />,
          label: '角色管理',
        },
        {
          key: 'system-permission',
          icon: <SettingOutlined />,
          label: '权限配置',
        },
      ],
    },
    {
      key: 'business',
      icon: <ShoppingCartOutlined />,
      label: '业务管理',
      children: [
        {
          key: 'business-order',
          icon: <ShoppingCartOutlined />,
          label: '订单管理',
        },
        {
          key: 'business-product',
          icon: <FolderOpenOutlined />,
          label: '产品管理',
        },
      ],
    },
    {
      key: 'report',
      icon: <BarChartOutlined />,
      label: '报表中心',
      children: [
        {
          key: 'report-sales',
          icon: <BarChartOutlined />,
          label: '销售报表',
        },
        {
          key: 'report-user',
          icon: <UserOutlined />,
          label: '用户分析',
        },
      ],
    },
    {
      key: 'message',
      icon: <MessageOutlined />,
      label: '消息通知',
    },
  ];

  const onBasicMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    setSelectedKey(key);
    console.log('基础菜单点击:', key);
  };

  const onNestedMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    console.log('嵌套菜单点击:', key);
  };

  const onNestedOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <div className="m-4 space-y-6">
      {/* 示例1: 基础菜单 */}
      <Card title="基础菜单示例" variant="outlined">
        <div className="flex justify-center">
          <SharedMenu
            mode="horizontal"
            items={basicMenuItems}
            selectedKeys={[selectedKey]}
            onClick={onBasicMenuClick}
            className="w-full"
          />
        </div>
        <div className="mt-4 text-center text-gray-500">
          当前选中:
          {' '}
          <span className="font-bold text-primary">{selectedKey}</span>
        </div>
      </Card>

      {/* 示例2: 嵌套菜单 */}
      <Card title="嵌套菜单示例" variant="outlined">
        <div className="flex">
          <SharedMenu
            mode="inline"
            items={nestedMenuItems}
            openKeys={openKeys}
            onOpenChange={onNestedOpenChange}
            onClick={onNestedMenuClick}
            style={{ width: 256 }}
          />
          <div className="flex-1 ml-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">菜单内容区域</p>
            <p className="text-gray-400 text-sm mt-2">点击左侧菜单查看详情</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
