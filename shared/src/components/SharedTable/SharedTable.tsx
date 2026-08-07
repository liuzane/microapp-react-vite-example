// Ant Design 组件
import { Table } from 'antd';

// 类型
import type { JSX } from 'react';
import type { TableProps } from 'antd';

export type SharedTable = <T>(props: TableProps<T>) => JSX.Element;

const SharedTable: SharedTable = (props) => {
  return (
    <Table
      bordered
      pagination={false}
      size="middle"
      {...props}
    />
  );
};

export default SharedTable;
