import type { JSX } from 'react';
import type { TableProps } from 'antd';
export type SharedTable = <T>(props: TableProps<T>) => JSX.Element;
declare const SharedTable: SharedTable;
export default SharedTable;
