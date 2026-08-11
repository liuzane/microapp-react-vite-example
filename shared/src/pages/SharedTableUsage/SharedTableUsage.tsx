// 基础模块
import { useState } from 'react';
import { Button, Tag, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

// 组件
import SharedTable from '@/components/SharedTable';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Product {
  id: number;
  productNo: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  status: 'onsale' | 'offsale' | 'outofstock';
}

interface StatusColor {
  text: string;
  color: string;
}

// Mock 数据
const mockUsers: User[] = [
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', status: 'inactive' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', status: 'active' },
  { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', status: 'pending' },
  { id: 5, name: '钱七', age: 29, email: 'qianqi@example.com', status: 'active' },
];

const mockProducts: Product[] = [
  { id: 1, productNo: 'P001', name: '笔记本电脑', price: 5999, stock: 100, sales: 520, status: 'onsale' },
  { id: 2, productNo: 'P002', name: '无线鼠标', price: 199, stock: 500, sales: 1200, status: 'onsale' },
  { id: 3, productNo: 'P003', name: '机械键盘', price: 499, stock: 0, sales: 890, status: 'outofstock' },
  { id: 4, productNo: 'P004', name: '显示器', price: 1299, stock: 50, sales: 320, status: 'offsale' },
  { id: 5, productNo: 'P005', name: '耳机', price: 299, stock: 200, sales: 1500, status: 'onsale' },
];

export default function SharedTableUsage() {
  const [users] = useState<User[]>(mockUsers);
  const [products] = useState<Product[]>(mockProducts);

  // 示例1: 基本表格 - 用户列表
  const userColumns: TableProps<User>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: User, b: User) => a.age - b.age,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, StatusColor> = {
          active: { text: '活跃', color: 'success' },
          inactive: { text: '禁用', color: 'default' },
          pending: { text: '待审核', color: 'warning' },
        };
        const config: StatusColor = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // 示例2: 带操作列的表格 - 商品列表
  const productColumns: TableProps<Product>['columns'] = [
    {
      title: '商品编号',
      dataIndex: 'productNo',
      key: 'productNo',

      fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥ ${price.toLocaleString()}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => {
        if (stock === 0) return <Tag color="error">缺货</Tag>;
        if (stock < 10) return <Tag color="warning">库存紧张</Tag>;
        return <Tag color="success">{stock}</Tag>;
      },
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a: Product, b: Product) => a.sales - b.sales,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, StatusColor> = {
          onsale: { text: '上架', color: 'success' },
          offsale: { text: '下架', color: 'default' },
          outofstock: { text: '缺货', color: 'error' },
        };
        const config: StatusColor = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_: unknown, _record: Product) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="m-4 space-y-6">
      {/* 示例1: 基本表格 */}
      <Card title="基本表格示例 - 用户列表" variant="outlined">
        <SharedTable<User>
          columns={userColumns}
          dataSource={users}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 示例2: 带操作列的表格 */}
      <Card title="带操作列的表格示例 - 商品列表" variant="outlined">
        <SharedTable<Product>
          columns={productColumns}
          dataSource={products}
          rowKey="productNo"
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
