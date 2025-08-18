import React from 'react';
import {
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  Show,
  Edit,
  Create,
  useForm,
  getDefaultSortOrder,
  FilterDropdown,
  useSelect,
  useTable,
} from '@refinedev/antd';
import { useShow } from '@refinedev/core';

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
  Rate,
  Badge,
  Descriptions,
  Tabs,
  Modal,
  message,
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  SafetyOutlined,
  WalletOutlined,
  StarOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Driver List Component
export const DriverList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'drivers',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  // Payment model filter options
  const { selectProps: paymentModelSelectProps } = useSelect({
    resource: 'drivers',
    optionLabel: 'paymentModel',
    optionValue: 'paymentModel',
  });

  const handleVerifyDriver = async (
    driverId: string,
    verificationType: string
  ) => {
    try {
      // Call your verification mutation
      message.success(`Driver ${verificationType} verification updated`);
    } catch (error) {
      message.error('Failed to update verification');
    }
  };

  return (
    <List
      headerButtons={[
        <CreateButton key='create'>Add Driver</CreateButton>,
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
              title='Total Drivers'
              value={234}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Online Now'
              value={89}
              prefix={<span style={{ color: '#52c41a' }}>●</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Pending Verification'
              value={12}
              prefix={<SafetyOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Avg Rating'
              value={4.7}
              prefix={<StarOutlined style={{ color: '#fa8c16' }} />}
              precision={1}
              suffix='/ 5'
            />
          </Card>
        </Col>
      </Row>

      <Table
        {...tableProps}
        rowKey='id'
        scroll={{ x: 1400 }}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} drivers`,
        }}
      >
        {/* Driver Info Column */}
        <Table.Column
          title='Driver'
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
          width={200}
        />

        {/* Status Column */}
        <Table.Column
          title='Status'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Badge
                status={record.isOnline ? 'success' : 'default'}
                text={record.isOnline ? 'Online' : 'Offline'}
              />
              <Badge
                status={record.isAvailable ? 'processing' : 'default'}
                text={record.isAvailable ? 'Available' : 'Busy'}
              />
            </Space>
          )}
          width={100}
        />

        {/* Payment Model Column */}
        <Table.Column
          dataIndex='paymentModel'
          title='Payment Model'
          render={(model) => (
            <Tag color={model === 'SUBSCRIPTION' ? 'blue' : 'green'}>
              {model}
            </Tag>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                placeholder='Select Payment Model'
                {...paymentModelSelectProps}
              />
            </FilterDropdown>
          )}
          width={120}
        />

        {/* Performance Column */}
        <Table.Column
          title='Performance'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Text style={{ fontSize: '12px' }}>
                Trips: {record.stats?.totalTrips || 0}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Rate
                  disabled
                  defaultValue={record.stats?.averageRating || 0}
                  allowHalf
                  style={{ fontSize: '12px' }}
                />
                <Text style={{ fontSize: '12px', marginLeft: 8 }}>
                  {record.stats?.averageRating || 0}
                </Text>
              </div>
            </Space>
          )}
          width={150}
        />

        {/* Verification Status Column */}
        <Table.Column
          title='Verification'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Text
                style={{
                  fontSize: '12px',
                  color: record.personalInfoSet ? '#52c41a' : '#ff4d4f',
                }}
              >
                {record.personalInfoSet ? '✓' : '✗'} Profile
              </Text>
              <Text
                style={{
                  fontSize: '12px',
                  color: record.driverLicenseVerified ? '#52c41a' : '#ff4d4f',
                }}
              >
                {record.driverLicenseVerified ? '✓' : '✗'} License
              </Text>
              <Text
                style={{
                  fontSize: '12px',
                  color: record.vehicleInspectionDone ? '#52c41a' : '#ff4d4f',
                }}
              >
                {record.vehicleInspectionDone ? '✓' : '✗'} Vehicle
              </Text>
            </Space>
          )}
          width={100}
        />

        {/* Earnings Column */}
        <Table.Column
          title='Earnings'
          render={(_, record: any) => (
            <Text strong>
              ₦{record.stats?.totalEarnings?.toLocaleString() || 0}
            </Text>
          )}
          sorter
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
                icon={<SafetyOutlined />}
                onClick={() => handleVerifyDriver(record.id, 'license')}
                disabled={record.driverLicenseVerified}
              >
                Verify
              </Button>
            </Space>
          )}
          fixed='right'
          width={120}
        />
      </Table>
    </List>
  );
};

// Driver Show Component
export const DriverShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: 'drivers',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Personal Info' key='1'>
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
                <Tag color={record?.isOnline ? 'green' : 'red'}>
                  {record?.isOnline ? 'Online' : 'Offline'}
                </Tag>
              </Card>
            </Col>
            <Col span={16}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label='Email'>
                  {record?.email}
                </Descriptions.Item>
                <Descriptions.Item label='Phone'>
                  {record?.phone?.fullPhone}
                </Descriptions.Item>
                <Descriptions.Item label='Payment Model'>
                  <Tag
                    color={
                      record?.paymentModel === 'SUBSCRIPTION' ? 'blue' : 'green'
                    }
                  >
                    {record?.paymentModel}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Registration Date'>
                  {new Date(record?.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Email Verified'>
                  {record?.isEmailVerified ? '✓ Yes' : '✗ No'}
                </Descriptions.Item>
                <Descriptions.Item label='Phone Verified'>
                  {record?.isPhoneVerified ? '✓ Yes' : '✗ No'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Performance' key='2'>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Total Trips'
                  value={record?.stats?.totalTrips || 0}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Average Rating'
                  value={record?.stats?.averageRating || 0}
                  precision={1}
                  suffix='/ 5'
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Total Earnings'
                  value={record?.stats?.totalEarnings || 0}
                  prefix='₦'
                  formatter={(value) => value?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title='Completion Rate'
                  value={record?.stats?.completionRate || 0}
                  suffix='%'
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Verification' key='3'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Card title='Document Verification'>
              <Descriptions bordered>
                <Descriptions.Item label='Profile Complete'>
                  {record?.personalInfoSet ? (
                    <Tag color='green'>Complete</Tag>
                  ) : (
                    <Tag color='red'>Incomplete</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Driver License'>
                  {record?.driverLicenseVerified ? (
                    <Tag color='green'>Verified</Tag>
                  ) : (
                    <Tag color='orange'>Pending</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Vehicle Inspection'>
                  {record?.vehicleInspectionDone ? (
                    <Tag color='green'>Done</Tag>
                  ) : (
                    <Tag color='red'>Pending</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </TabPane>
      </Tabs>
    </Show>
  );
};

// Driver Edit Component
export const DriverEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: 'drivers',
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
            <Form.Item label='Payment Model' name='paymentModel'>
              <Select>
                <Option value='SUBSCRIPTION'>Subscription</Option>
                <Option value='COMMISSION'>Commission</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='License Verified'
              name='driverLicenseVerified'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Vehicle Inspection'
              name='vehicleInspectionDone'
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
      </Form>
    </Edit>
  );
};

// Driver Create Component
export const DriverCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: 'drivers',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
            <Form.Item
              label='Phone Number'
              name={['phone', 'fullPhone']}
              rules={[{ required: true }]}
            >
              <Input placeholder='+234...' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Payment Model'
              name='paymentModel'
              initialValue='COMMISSION'
            >
              <Select>
                <Option value='SUBSCRIPTION'>Subscription</Option>
                <Option value='COMMISSION'>Commission</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
