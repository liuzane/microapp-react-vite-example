export interface Order {
    id: number;
    orderNo: string;
    productName: string;
    customerName: string;
    amount: number;
    status: string;
    phone: string;
    address: string;
    createTime: string;
    updateTime: string;
}
export declare const orders: Order[];
export default orders;
