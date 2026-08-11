export interface Product {
    id: number;
    code: string;
    name: string;
    price: number;
    stock: number;
    sales: number;
    category: string;
    status: string;
    supplier: string;
    description: string;
    createTime: string;
    updateTime: string;
}
declare const products: Product[];
export default products;
