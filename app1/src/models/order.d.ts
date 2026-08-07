// 类型
import type { Order } from 'mockDB/data/orders';

// 枚举
import { OrderStatusEnum } from '@/enums/order.enum';

export interface IOrder extends Omit<Order, 'status'> {
  status: OrderStatusType;
}

export interface IStatistics {
  total: number;
  pending: number;
  paid: number;
  shipped: number;
  completed: number;
  cancelled: number;
}

export type OrderStatusType = typeof OrderStatusEnum[keyof typeof OrderStatusEnum];

export interface IStatusConfig {
  text: string;
  color: 'warning' | 'processing' | 'success' | 'default' | 'error';
}

export interface IOrderEditForm {
  productName: string;
  amount: number;
  status: OrderStatusType;
  customerName: string;
  phone: string;
  address: string;
}
