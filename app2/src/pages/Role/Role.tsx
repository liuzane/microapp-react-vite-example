// 基础模块
import { lazy, useState, useEffect } from 'react';
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
  Switch,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

// 枚举
import { RoleStatusEnum } from '@/enums/role.enum';

// 类型
import type { TableProps } from 'antd';
import type { Role } from 'mockDB/data/roles';
import type { User } from 'mockDB/data/users';
import type { RoleSearchParams, RoleUpdateDTO } from 'mockDB/services/role-service';
import type { SharedTable } from 'shared/components/SharedTable';
import type { SharedPagination } from 'shared/components/SharedPagination';
import type {
  IRole,
  IStatusConfig,
  RoleStatusType,
  IRoleEditForm,
} from '@/models/role';

// 数据服务
import roleService from '@/services/roleService';
import userService from '@/services/userService';

// 模块联邦组件
const SharedTable: SharedTable = lazy(() => import('shared/components/SharedTable')) as SharedTable;
const SharedPagination: SharedPagination = lazy(() => import('shared/components/SharedPagination')) as SharedPagination;

const { Option } = Select;

const STATUS_MAP: Record<RoleStatusType, IStatusConfig> = {
  [RoleStatusEnum.Active]: { text: '启用', color: 'success' },
  [RoleStatusEnum.Inactive]: { text: '停用', color: 'default' },
};

export default function Role() {
  // 状态管理
  const [dataSource, setDataSource] = useState<IRole[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // 筛选条件
  const [searchText, setSearchText] = useState<string>('');
  const [roleStatus, setRoleStatus] = useState<RoleStatusType | ''>('');

  // 分页
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 对话框相关状态
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<IRole | null>(null);
  const [form] = Form.useForm<IRoleEditForm>();

  /**
   * 加载数据函数
   * @param params 查询参数
   */
  const loadData = async (params?: RoleSearchParams) => {
    setLoading(true);
    try {
      const [rolesResult, usersResult] = await Promise.allSettled([
        roleService.getRolesByPage({
          currentPage: params && 'currentPage' in params ? params.currentPage : currentPage,
          pageSize: params && 'pageSize' in params ? params.pageSize : pageSize,
          searchText: params && 'searchText' in params ? params.searchText : searchText,
          status: params && 'status' in params ? params.status : roleStatus,
        }),
        userService.getAllUsers(),
      ]);
      let dataSource: Role[] = [];
      let users: User[] = [];
      if (rolesResult.status === 'fulfilled' && rolesResult.value) {
        const { code, data, msg } = rolesResult.value;
        if (code === 200 && data) {
          dataSource = data.list;
          setTotal(data.total);
        } else {
          throw new Error(msg);
        }
      }
      if (usersResult.status === 'fulfilled' && usersResult.value) {
        const { code, data, msg } = usersResult.value;
        if (code === 200 && data) {
          users = data;
        } else {
          console.error('加载用户数据选项失败:', msg);
        }
      }
      if (dataSource.length > 0) {
        setDataSource(dataSource.map((role: Role) => ({
          ...role,
          userCount: users.length > 0 ? users.filter(user => user.roleName === role.name).length : -1,
        })) as IRole[]);
      }
    } catch (error) {
      console.error('加载角色数据失败:', error);
      message.error(`加载角色数据失败: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // 初始化及筛选条件变化时加载数据
  useEffect(() => {
    loadData();
  }, []);

  /**
   * 查看角色详情
   */
  const onView = (record: IRole): void => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  /**
   * 编辑角色
   */
  const onEdit = (record: IRole): void => {
    setCurrentRecord(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      status: record.status,
      description: record.description,
    });
    setEditModalVisible(true);
  };

  /**
   * 新增角色
   */
  const onAdd = (): void => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: RoleStatusEnum.Active,
    });
    setEditModalVisible(true);
  };

  /**
   * 确认删除角色
   */
  const confirmDelete = (record: IRole): void => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 ${record.name} 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { code, msg } = await roleService.deleteRole(record.id);
          if (code === 200) {
            const totalPages: number = Math.ceil((total - 1) / pageSize);
            if (currentPage > totalPages && totalPages > 0) {
              setCurrentPage(totalPages);
              loadData({ currentPage: totalPages });
            } else {
              loadData();
            }
            message.success(`删除角色：${record.name} 成功`);
          } else {
            throw new Error(msg);
          }
        } catch (error) {
          console.error('删除角色失败:', error);
          message.error(`删除角色失败: ${(error as Error).message}`);
          return;
        }
      },
    });
  };

  /**
   * 保存编辑角色
   */
  const onEditSave = async (): Promise<void> => {
    try {
      const values: IRoleEditForm = await form.validateFields();
      if (values) {
        const params: RoleUpdateDTO = {
          name: values.name,
          code: values.code,
          status: values.status,
          description: values.description,
        };
        if (currentRecord) {
          params.id = currentRecord.id;
        }
        const { code, msg } = await roleService.updateRole(params);
        if (code === 200) {
          await loadData();
          setEditModalVisible(false);
          message.success(`角色 ${params.name} ${params.id === -1 ? '创建' : '更新'}成功`);
        } else {
          throw new Error(msg);
        }
      }
    } catch (error) {
      console.error('保存角色失败:', error);
      message.error(`保存角色失败: ${(error as Error).message}`);
    }
  };

  /**
   * 切换角色状态
   */
  const onToggleStatus = async (checked: boolean, record: IRole): Promise<void> => {
    try {
      const newStatus: RoleStatusType = checked ? RoleStatusEnum.Active : RoleStatusEnum.Inactive;
      const updatedRecord: IRole = {
        ...record,
        status: newStatus,
      };
      const { code, msg } = await roleService.updateRole(updatedRecord);
      if (code === 200) {
        await loadData();
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error('状态切换失败:', error);
      message.error(`状态切换失败: ${(error as Error).message}`);
    }
  };

  /**
   * 重置筛选条件
   */
  const onReset = (): void => {
    setSearchText('');
    setRoleStatus('');
    setCurrentPage(1);
    loadData({ searchText: '', status: '', currentPage: 1 });
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
  const columns: TableProps<IRole>['columns'] = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      fixed: 'left',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: RoleStatusType, record: IRole) => (
        <Space>
          <Tag color={STATUS_MAP[status].color}>{STATUS_MAP[status].text}</Tag>
          <Switch
            size="small"
            checked={status === RoleStatusEnum.Active}
            onChange={(checked: boolean) => onToggleStatus(checked, record)}
          />
        </Space>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 100,
      render: (count: number) => count !== -1 ? `${count} 人` : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a: IRole, b: IRole) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      sorter: (a: IRole, b: IRole) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      minWidth: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_: unknown, record: IRole) => (
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
      title="角色管理"
      variant="outlined"
    >
      {/* 筛选项 */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <Input
          placeholder="搜索角色名称或编码"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e: InputElementChangeEvent) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="w-75"
          allowClear
        />
        <Select<RoleStatusType | ''>
          placeholder="选择状态"
          className="w-35"
          value={roleStatus}
          onChange={(value: RoleStatusType | '') => {
            setRoleStatus(value);
            setCurrentPage(1);
          }}
          allowClear
        >
          <Option value="">全部状态</Option>
          {
            Object.keys(STATUS_MAP).map((key: string) => (
              <Option key={key} value={key}>{STATUS_MAP[key as RoleStatusType].text}</Option>
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
          新增角色
        </Button>
      </div>

      {/* 表格 */}
      <SharedTable<IRole>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
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

      {/* 查看角色对话框 */}
      <Modal
        title={`角色详情 - ${currentRecord?.name || ''}`}
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
            <Descriptions.Item label="角色编码">{currentRecord.code}</Descriptions.Item>
            <Descriptions.Item label="角色名称">{currentRecord.name}</Descriptions.Item>
            <Descriptions.Item label="角色状态">
              <Tag color={STATUS_MAP[currentRecord.status].color}>
                {STATUS_MAP[currentRecord.status].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户数量">
              {currentRecord.userCount}
              {' '}
              人
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{currentRecord.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间" span={2}>{currentRecord.updateTime}</Descriptions.Item>
            <Descriptions.Item label="角色描述" span={2}>{currentRecord.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 新增/编辑角色对话框 */}
      <Modal
        title={currentRecord ? `编辑角色 - ${currentRecord.name}` : '新增角色'}
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
            status: RoleStatusEnum.Active,
          }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '编码只能包含字母、数字和下划线，且不能以数字开头' },
            ]}
          >
            <Input placeholder="请输入角色编码（如：admin）" disabled={!!currentRecord} />
          </Form.Item>
          <Form.Item
            name="status"
            label="角色状态"
            rules={[{ required: true, message: '请选择角色状态' }]}
          >
            <Select placeholder="请选择状态">
              {
                Object.values(RoleStatusEnum).map((status: RoleStatusEnum) => (
                  <Option key={status} value={status}>
                    {STATUS_MAP[status].text}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
