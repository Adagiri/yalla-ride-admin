import React from 'react';
import {
  List,
  EditButton,
  ShowButton,
  Show,
  Edit,
  useForm,
  getDefaultSortOrder,
  FilterDropdown,
  useTable,
} from '@refinedev/antd';
import {  useShow } from '@refinedev/core';

import {
  Table,
  Space,
  Tag,
  Avatar,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Form,
  Input,
  Switch,
  Badge,
  Descriptions,
  Tabs,
  DatePicker,
  message,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Customer List Component
export const CustomerList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'customers',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  const handleSuspendCustomer = async (
    customerId: string,
    suspend: boolean
  ) => {
    try {
      // Call your suspend/unsuspend mutation
      message.success(
        `Customer ${suspend ? 'suspended' : 'unsuspended'} successfully`
      );
    } catch (error) {
      message.error('Failed to update customer status');
    }
  };

  return (
    <List
      headerButtons={[
        <Button key='refresh' onClick={() => window.location.reload()}>
          Refresh
        </Button>,
      ]}
    >
      {/* Quick Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Total Customers'
              value={1547}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Active Today'
              value={234}
              prefix={<span style={{ color: '#52c41a' }}>●</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='New This Week'
              value={45}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Total Spent'
              value={2350000}
              prefix={<DollarOutlined style={{ color: '#fa8c16' }} />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      <Table
        {...tableProps}
        rowKey='id'
        scroll={{ x: 1200 }}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} customers`,
        }}
      >
        {/* Customer Info Column */}
        <Table.Column
          title='Customer'
          render={(_, record: any) => (
            <Space>
              <Avatar
                src={record.profilePhoto}
                icon={<UserOutlined />}
                size='large'
              />
              <div>
                <Text strong>
                  {record.firstname} {record.lastname}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {record.email}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {record.phone?.fullPhone}
                </Text>
              </div>
            </Space>
          )}
          width={220}
        />

        {/* Verification Status Column */}
        <Table.Column
          title='Verification'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Badge
                status={record.isEmailVerified ? 'success' : 'error'}
                text={
                  record.isEmailVerified ? 'Email Verified' : 'Email Pending'
                }
              />
              <Badge
                status={record.isPhoneVerified ? 'success' : 'error'}
                text={
                  record.isPhoneVerified ? 'Phone Verified' : 'Phone Pending'
                }
              />
            </Space>
          )}
          width={150}
        />

        {/* Account Status Column */}
        <Table.Column
          title='Status'
          render={(_, record: any) => (
            <Tag color={record.isActive ? 'green' : 'red'}>
              {record.isActive ? 'Active' : 'Suspended'}
            </Tag>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select style={{ minWidth: 150 }} placeholder='Select Status'>
                <Option value={true}>Active</Option>
                <Option value={false}>Suspended</Option>
              </Select>
            </FilterDropdown>
          )}
          width={100}
        />

        {/* Trip Statistics Column */}
        <Table.Column
          title='Trip Stats'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Text style={{ fontSize: '12px' }}>
                Total: {record.stats?.totalTrips || 0}
              </Text>
              <Text style={{ fontSize: '12px' }}>
                Completed: {record.stats?.completedTrips || 0}
              </Text>
              <Text style={{ fontSize: '12px' }}>
                Cancelled: {record.stats?.cancelledTrips || 0}
              </Text>
            </Space>
          )}
          width={120}
        />

        {/* Spending Column */}
        <Table.Column
          title='Total Spent'
          render={(_, record: any) => (
            <Text strong>
              ₦{record.stats?.totalSpent?.toLocaleString() || 0}
            </Text>
          )}
          sorter
          width={120}
        />

        {/* Last Trip Column */}
        <Table.Column
          title='Last Trip'
          render={(_, record: any) => (
            <Text style={{ fontSize: '12px' }}>
              {record.stats?.lastTripDate
                ? new Date(record.stats.lastTripDate).toLocaleDateString()
                : 'No trips'}
            </Text>
          )}
          width={100}
        />

        {/* Registration Date */}
        <Table.Column
          dataIndex='createdAt'
          title='Joined'
          render={(value) => new Date(value).toLocaleDateString()}
          sorter
          defaultSortOrder={getDefaultSortOrder('createdAt', sorters)}
          width={100}
        />

        {/* Actions Column */}
        <Table.Column
          title='Actions'
          render={(_, record) => (
            <Space size='small'>
              <ShowButton hideText size='small' recordItemId={record.id} />
              <EditButton hideText size='small' recordItemId={record.id} />
              <Button
                size='small'
                type={record.isActive ? 'primary' : 'default'}
                danger={record.isActive}
                onClick={() =>
                  handleSuspendCustomer(record.id, record.isActive)
                }
              >
                {record.isActive ? 'Suspend' : 'Activate'}
              </Button>
            </Space>
          )}
          fixed='right'
          width={150}
        />
      </Table>
    </List>
  );
};

// Customer Show Component
export const CustomerShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: 'customers',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Profile' key='1'>
          <Row gutter={16}>
            <Col span={8}>
              <Card style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={record?.profilePhoto}
                  icon={<UserOutlined />}
                />
                <h3 style={{ marginTop: 16 }}>
                  {record?.firstname} {record?.lastname}
                </h3>
                <Tag color={record?.isActive ? 'green' : 'red'}>
                  {record?.isActive ? 'Active' : 'Suspended'}
                </Tag>
              </Card>
            </Col>
            <Col span={16}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label='Email'>
                  <Space>
                    {record?.email}
                    {record?.isEmailVerified && (
                      <CheckOutlined style={{ color: '#52c41a' }} />
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Phone'>
                  <Space>
                    {record?.phone?.fullPhone}
                    {record?.isPhoneVerified && (
                      <CheckOutlined style={{ color: '#52c41a' }} />
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Registration Date'>
                  {new Date(record?.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Last Login'>
                  {record?.lastLoginAt
                    ? new Date(record.lastLoginAt).toLocaleDateString()
                    : 'Never'}
                </Descriptions.Item>
                <Descriptions.Item label='MFA Enabled'>
                  {record?.isMFAEnabled ? 'Yes' : 'No'}
                </Descriptions.Item>
                <Descriptions.Item label='Preferred Payment'>
                  {record?.preferredPaymentMethod || 'Not set'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Trip History' key='2'>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Total Trips'
                  value={record?.stats?.totalTrips || 0}
                  prefix={<CarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Completed'
                  value={record?.stats?.completedTrips || 0}
                  prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Cancelled'
                  value={record?.stats?.cancelledTrips || 0}
                  prefix={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Success Rate'
                  value={
                    record?.stats?.totalTrips > 0
                      ? Math.round(
                          (record?.stats?.completedTrips /
                            record?.stats?.totalTrips) *
                            100
                        )
                      : 0
                  }
                  suffix='%'
                />
              </Card>
            </Col>
          </Row>

          {/* Recent trips would be loaded here */}
          <Card title='Recent Trips'>
            <Text type='secondary'>
              Recent trip history will be displayed here
            </Text>
          </Card>
        </TabPane>

        <TabPane tab='Financial' key='3'>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title='Total Spent'
                  value={record?.stats?.totalSpent || 0}
                  prefix='₦'
                  formatter={(value) => value?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title='Wallet Balance'
                  value={record?.walletBalance || 0}
                  prefix='₦'
                  formatter={(value) => value?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title='Average Trip Cost'
                  value={
                    record?.stats?.totalTrips > 0
                      ? record?.stats?.totalSpent / record?.stats?.totalTrips
                      : 0
                  }
                  prefix='₦'
                  precision={0}
                  formatter={(value) => value?.toLocaleString()}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Show>
  );
};

// Customer Edit Component
export const CustomerEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: 'customers',
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='First Name'
              name='firstname'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Last Name'
              name='lastname'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Phone' name={['phone', 'fullPhone']}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Email Verified'
              name='isEmailVerified'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Phone Verified'
              name='isPhoneVerified'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Account Active'
              name='isActive'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Notes' name='adminNotes'>
          <Input.TextArea
            rows={4}
            placeholder='Admin notes about this customer...'
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
