import type { JSX } from 'react';
import type { MenuProps } from 'antd';
export type SharedMenu = (props: MenuProps) => JSX.Element;
declare const SharedMenu: SharedMenu;
export default SharedMenu;
