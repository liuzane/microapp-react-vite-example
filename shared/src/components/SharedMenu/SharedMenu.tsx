// Ant Design 组件
import { Menu } from 'antd';

// 类型
import type { JSX } from 'react';
import type { MenuProps } from 'antd';

export type SharedMenu = (props: MenuProps) => JSX.Element;

const SharedMenu: SharedMenu = (props) => {
  return (
    <Menu {...props} />
  );
};

export default SharedMenu;
