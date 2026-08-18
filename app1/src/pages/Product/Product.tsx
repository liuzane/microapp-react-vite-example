// 基础模块
import { lazy, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Input,
  Select,
  Button,
  Card,
  Space,
  Tag,
  message,
  Modal,
  Form,
  InputNumber,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';

// 枚举
import { ProductStatusEnum, ProductCategoryEnum } from '@/enums/product.enum';

// 类型
import type { TableProps } from 'antd';
import type { ProductSearchParams, ProductUpdateDTO } from 'mockDB/services/product-service';
import type { SharedTable } from 'shared/components/SharedTable';
import type { SharedPagination } from 'shared/components/SharedPagination';
import type {
  IProduct,
  IStatistics,
  ProductStatusType,
  ProductCategoryType,
  IStatusConfig,
  IProductEditForm,
} from '@/models/product';

// 数据服务
import productService from '@/services/productService';

// 模块联邦组件
const SharedTable: SharedTable = lazy(() => import('shared/components/SharedTable')) as SharedTable;
const SharedPagination: SharedPagination = lazy(() => import('shared/components/SharedPagination')) as SharedPagination;

const { Option } = Select;

const STATUS_MAP: Record<ProductStatusType, IStatusConfig> = {
  [ProductStatusEnum.OnSale]: { text: '上架', color: 'success' },
  [ProductStatusEnum.OffSale]: { text: '下架', color: 'default' },
  [ProductStatusEnum.OutOfStock]: { text: '缺货', color: 'error' },
  [ProductStatusEnum.LowStock]: { text: '库存紧张', color: 'warning' },
};

const CATEGORY_MAP: Record<ProductCategoryType, string> = {
  [ProductCategoryEnum.Electronics]: '电子商品',
  [ProductCategoryEnum.Clothing]: '服装',
  [ProductCategoryEnum.Home]: '家居用品',
  [ProductCategoryEnum.Beauty]: '美妆个护',
  [ProductCategoryEnum.Food]: '食品饮料',
};

export default function Product() {
  // 路由参数
  const [searchParams] = useSearchParams();

  // 状态管理
  const [dataSource, setDataSource] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // 筛选条件
  const [searchText, setSearchText] = useState<string>('');
  const [category, setCategory] = useState<ProductCategoryType | ''>('');
  const [productStatus, setProductStatus] = useState<ProductStatusType | ''>('');

  // 分页
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 统计数据
  const [statistics, setStatistics] = useState<IStatistics>({
    total: 0,
    onSale: 0,
    offSale: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  // 对话框相关状态
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<IProduct | null>(null);
  const [form] = Form.useForm<IProductEditForm>();

  /**
   * 加载数据函数
   * @param params 查询参数
   */
  const loadData = async (params?: ProductSearchParams) => {
    setLoading(true);
    try {
      const { code, data, msg } = await productService.getProductsByPage({
        currentPage: params && 'currentPage' in params ? params.currentPage : currentPage,
        pageSize: params && 'pageSize' in params ? params.pageSize : pageSize,
        searchText: params && 'searchText' in params ? params.searchText : searchText,
        category: params && 'category' in params ? params.category : category,
        status: params && 'status' in params ? params.status : productStatus,
      });
      if (code === 200 && data) {
        setDataSource(data.list as IProduct[]);
        setTotal(data.total);
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error('加载商品数据失败:', error);
      message.error(`加载商品数据失败: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
     * 加载统计数据函数
     */
  const loadStatistics = async () => {
    try {
      const { code, data, msg } = await productService.getAllProducts();
      if (code === 200 && data) {
        const allProducts: IProduct[] = data as IProduct[];
        setStatistics({
          total: allProducts.length,
          onSale: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OnSale).length,
          offSale: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OffSale).length,
          outOfStock: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OutOfStock).length,
          lowStock: allProducts.filter((item: IProduct) => item.stock > 0 && item.stock < 10).length,
        });
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
      message.error(`加载统计数据失败: ${(error as Error).message}`);
      return;
    }
  };

  // 初始化及筛选条件变化时加载数据
  useEffect(() => {
    const name: string | null = searchParams.get('name');
    if (name) {
      setSearchText(name);
      loadData({ searchText: name });
    } else {
      loadData();
    }
    loadStatistics();
  }, []);

  /**
   * 查看商品详情
   */
  const onView = (record: IProduct): void => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  /**
   * 编辑商品
   */
  const onEdit = (record: IProduct): void => {
    setCurrentRecord(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      stock: record.stock,
      category: record.category,
      status: record.status,
      supplier: record.supplier,
      description: record.description,
    });
    setEditModalVisible(true);
  };

  /**
   * 新增商品
   */
  const onAdd = (): void => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      category: ProductCategoryEnum.Electronics,
      status: ProductStatusEnum.OnSale,
      price: 0,
      stock: 0,
    });
    setEditModalVisible(true);
  };

  /**
   * 确认删除商品
   */
  const confirmDelete = (record: IProduct): void => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商品 ${record.code} 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { code, msg } = await productService.deleteProduct(record.id);
          if (code === 200) {
            const totalPages: number = Math.ceil((total - 1) / pageSize);
            if (currentPage > totalPages && totalPages > 0) {
              setCurrentPage(totalPages);
              loadData({ currentPage: totalPages });
            } else {
              loadData();
            }
            loadStatistics();
            message.success(`删除商品：${record.code} 成功`);
          } else {
            throw new Error(msg);
          }
        } catch (error) {
          console.error('删除商品失败:', error);
          message.error(`删除商品失败: ${(error as Error).message}`);
          return;
        }
      },
    });
  };

  /**
   * 保存编辑商品
   */
  const onEditSave = async (): Promise<void> => {
    try {
      const values: IProductEditForm = await form.validateFields();
      if (values) {
        const params: ProductUpdateDTO = {
          name: values.name,
          price: values.price,
          stock: values.stock,
          category: values.category,
          status: values.status,
          supplier: values.supplier,
          description: values.description,
        };
        if (currentRecord) {
          params.id = currentRecord.id;
        }
        const { code, msg } = await productService.updateProduct(params);
        if (code === 200) {
          loadData();
          loadStatistics();
          setEditModalVisible(false);
          message.success(`商品 ${params.id} ${params.id === -1 ? '创建' : '更新'}成功`);
        } else {
          throw new Error(msg);
        }
      }
    } catch (error) {
      console.error('保存商品失败:', error);
      message.error(`保存商品失败: ${(error as Error).message}`);
    }
  };

  /**
   * 重置筛选条件
   */
  const onReset = (): void => {
    setSearchText('');
    setCategory('');
    setProductStatus('');
    setCurrentPage(1);
    loadData({ searchText: '', category: '', status: '', currentPage: 1 });
  };

  /**
   * 状态筛选变化处理
   */
  const onStatusChange = (status: ProductStatusType): void => {
    setSearchText('');
    setCategory('');
    setProductStatus(status);
    setCurrentPage(1);
    loadData({ searchText: '', category: '', status, currentPage: 1 });
  };

  /**
   * 执行搜索
   */
  const onSearch = (): void => {
    setCurrentPage(1);
    loadData({ currentPage: 1 });
  };

  /**
   * 分页变化处理
   */
  const onPageChange = (page: number, size: number): void => {
    setCurrentPage(page);
    setPageSize(size);
    loadData({ currentPage: page, pageSize: size });
  };

  /**
   * 表格列定义
   */
  const columns: TableProps<IProduct>['columns'] = [
    {
      title: '商品编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: ProductCategoryType) => CATEGORY_MAP[category],
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `¥ ${price.toLocaleString()}`,
      sorter: (a: IProduct, b: IProduct) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock: number) => {
        let color: string = 'success';
        if (stock === 0) {
          color = 'error';
        } else if (stock < 10) {
          color = 'warning';
        }
        return <Tag color={color}>{stock}</Tag>;
      },
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      width: 100,
      sorter: (a: IProduct, b: IProduct) => a.sales - b.sales,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ProductStatusType) => {
        const config: IStatusConfig = STATUS_MAP[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a: IProduct, b: IProduct) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      sorter: (a: IProduct, b: IProduct) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_: unknown, record: IProduct) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="商品管理"
      variant="outlined"
    >
      {/* 统计卡片 */}
      <div className="mb-4 grid grid-cols-5 gap-4 text-center">
        <Card>
          <div className="text-sm text-[#666]">总商品</div>
          <div className="text-2xl">
            <span
              className="text-primary cursor-pointer hover:opacity-75"
              onClick={onReset}
            >
              {statistics.total}
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-[#666]">上架</div>
          <div className="text-2xl">
            <span
              className="text-success cursor-pointer hover:opacity-75"
              onClick={() => onStatusChange(ProductStatusEnum.OnSale)}
            >
              {statistics.onSale}
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-[#666]">缺货</div>
          <div className="text-2xl">
            <span
              className="text-danger cursor-pointer hover:opacity-75"
              onClick={() => onStatusChange(ProductStatusEnum.OutOfStock)}
            >
              {statistics.outOfStock}
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-[#666]">库存紧张</div>
          <div className="text-2xl">
            <span
              className="text-warning cursor-pointer hover:opacity-75"
              onClick={() => onStatusChange(ProductStatusEnum.LowStock)}
            >
              {statistics.lowStock}
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-[#666]">下架</div>
          <div className="text-2xl">
            <span
              className="text-gray-500 cursor-pointer hover:opacity-75"
              onClick={() => onStatusChange(ProductStatusEnum.OffSale)}
            >
              {statistics.offSale}
            </span>
          </div>
        </Card>
      </div>

      {/* 筛选项 */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <Input
          placeholder="搜索商品编号或名称"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e: InputElementChangeEvent) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="w-75"
          allowClear
        />
        <Select<ProductCategoryType | ''>
          placeholder="选择分类"
          className="w-35"
          value={category}
          onChange={(value: ProductCategoryType | '') => {
            setCategory(value);
            setCurrentPage(1);
          }}
        >
          <Option value="">全部分类</Option>
          {
            Object.keys(CATEGORY_MAP).map((key: string) => (
              <Option key={key} value={key}>{CATEGORY_MAP[key as ProductCategoryType]}</Option>
            ))
          }
        </Select>
        <Select<ProductStatusType | ''>
          placeholder="选择状态"
          className="w-35"
          value={productStatus}
          onChange={(value: ProductStatusType | '') => {
            setProductStatus(value);
            setCurrentPage(1);
          }}
        >
          <Option value="">全部状态</Option>
          {
            Object.keys(STATUS_MAP).map((key: string) => (
              <Option key={key} value={key}>{STATUS_MAP[key as ProductStatusType].text}</Option>
            ))
          }
        </Select>
        <Button type="primary" onClick={onSearch}>
          查询
        </Button>
        <Button onClick={onReset}>
          重置
        </Button>
        <Button className="ml-auto" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          新增商品
        </Button>
      </div>

      {/* 表格 */}
      <SharedTable<IProduct>
        columns={columns}
        dataSource={dataSource}
        rowKey="code"
        loading={loading}
        scroll={{ x: 1400 }}
      />

      {/* 分页 */}
      <SharedPagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        showSizeChanger
        showQuickJumper
      />

      {/* 查看商品对话框 */}
      <Modal
        title={`商品详情 - ${currentRecord?.code || ''}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {currentRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="商品编号">{currentRecord.code}</Descriptions.Item>
            <Descriptions.Item label="商品名称">{currentRecord.name}</Descriptions.Item>
            <Descriptions.Item label="商品分类">{CATEGORY_MAP[currentRecord.category]}</Descriptions.Item>
            <Descriptions.Item label="商品状态">
              <Tag color={STATUS_MAP[currentRecord.status].color}>
                {STATUS_MAP[currentRecord.status].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="商品价格">
              ¥
              {' '}
              {currentRecord.price.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="库存数量">
              {currentRecord.stock}
            </Descriptions.Item>
            <Descriptions.Item label="销量">{currentRecord.sales}</Descriptions.Item>
            <Descriptions.Item label="供应商">{currentRecord.supplier}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{currentRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间" span={2}>{currentRecord.updateTime}</Descriptions.Item>
            <Descriptions.Item label="商品描述" span={2}>{currentRecord.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 新增/编辑商品对话框 */}
      <Modal
        title={currentRecord ? `编辑商品 - ${currentRecord.code}` : '新增商品'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={onEditSave}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            price: 0,
            stock: 0,
            category: ProductCategoryEnum.Electronics,
            status: ProductStatusEnum.OnSale,
            supplier: '',
            description: '',
          }}
        >
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="price"
            label="商品价格"
            rules={[
              { required: true, message: '请输入商品价格' },
              { type: 'number', min: 0.01, message: '价格必须大于0' },
            ]}
          >
            <InputNumber
              className="w-full"
              precision={2}
              prefix="¥"
              placeholder="请输入价格"
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存数量"
            rules={[
              { required: true, message: '请输入库存数量' },
              { type: 'integer', min: 0, message: '库存数量必须大于等于0' },
            ]}
          >
            <InputNumber className="w-full" placeholder="请输入库存数量" />
          </Form.Item>
          <Form.Item
            name="category"
            label="商品分类"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择分类">
              {
                Object.values(ProductCategoryEnum).map((category: ProductCategoryEnum) => (
                  <Option key={category} value={category}>
                    {CATEGORY_MAP[category]}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="商品状态"
            rules={[{ required: true, message: '请选择商品状态' }]}
          >
            <Select placeholder="请选择状态">
              {
                Object.values(ProductStatusEnum).map((status: ProductStatusEnum) => (
                  <Option key={status} value={status}>
                    {STATUS_MAP[status].text}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="supplier"
            label="供应商"
            rules={[{ required: true, message: '请输入供应商' }]}
          >
            <Input placeholder="请输入供应商" />
          </Form.Item>
          <Form.Item
            name="description"
            label="商品描述"
          >
            <Input.TextArea rows={2} placeholder="请输入商品描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
