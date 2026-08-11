import type { JSX } from 'react';
import type { PaginationProps } from 'antd';
import './SharedPagination.css';
export type SharedPagination = (props: PaginationProps) => JSX.Element;
declare const SharedPagination: SharedPagination;
export default SharedPagination;
