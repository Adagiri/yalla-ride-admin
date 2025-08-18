import React from 'react';
import {
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  Show,
  FilterDropdown,
  useTable,
} from '@refinedev/antd';

import { useShow } from '@refinedev/core';
import {
  Table,
  Space,
  Tag,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Form,
  Input,
  InputNumber,
  Switch,
  Descriptions,
  Tabs,
  Modal,
  message,
  Progress,
  DatePicker,
} from 'antd';
import {
  CreditCardOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  StarOutlined,
  CrownOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Subscription List Component
export const SubscriptionList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'subscriptions',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      // Call your renewal mutation
      message.success('Subscription renewed successfully');
    } catch (error) {
      message.error('Failed to renew subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    Modal.confirm({
      title: 'Cancel Subscription',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to cancel this subscription?',
      onOk: async () => {
        try {
          // Call your cancellation mutation
          message.success('Subscription cancelled successfully');
        } catch (error) {
          message.error('Failed to cancel subscription');
        }
      },
    });
  };

  return (
    <List
      headerButtons={[
        <CreateButton key='create'>Add Subscription Plan</CreateButton>,
        <Button
          key='refresh'
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>,
      ]}
    >
      {/* Subscription Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Active Subscriptions'
              value={89}
              prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Monthly Revenue'
              value={445000}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Expiring Soon'
              value={12}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Renewal Rate'
              value={87}
              prefix={<ReloadOutlined style={{ color: '#722ed1' }} />}
              suffix='%'
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
            `${range[0]}-${range[1]} of ${total} subscriptions`,
        }}
      >
        {/* Driver Column */}
        <Table.Column
          title='Driver'
          render={(_, record: any) => (
            <Space>
              <div>
                <Text strong>
                  {record.driver?.firstname} {record.driver?.lastname}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {record.driver?.email}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  ID: {record.driver?.id?.substring(0, 8)}...
                </Text>
              </div>
            </Space>
          )}
          width={180}
        />

        {/* Plan Column */}
        <Table.Column
          title='Plan'
          render={(_, record: any) => (
            <div>
              <Text
                strong
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {record.plan?.tier === 'premium' && (
                  <CrownOutlined style={{ color: '#faad14' }} />
                )}
                {record.plan?.tier === 'basic' && (
                  <StarOutlined style={{ color: '#1890ff' }} />
                )}
                {record.plan?.name}
              </Text>
              <br />
              <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                ₦{record.plan?.amount?.toLocaleString()} /{' '}
                {record.plan?.duration}
              </Text>
              <br />
              <Tag color='blue' style={{ fontSize: '10px' }}>
                {record.plan?.tier?.toUpperCase()}
              </Tag>
            </div>
          )}
          width={150}
        />

        {/* Status Column */}
        <Table.Column
          dataIndex='status'
          title='Status'
          render={(status) => {
            const statusConfig: Record<string, { color: string }> = {
              active: { color: 'green' },
              expired: { color: 'red' },
              cancelled: { color: 'red' },
              pending: { color: 'orange' },
            };

            const config = statusConfig[status] || { color: 'default' };
            return <Tag color={config.color}>{status.toUpperCase()}</Tag>;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 150 }}
                mode='multiple'
                placeholder='Select Status'
              >
                <Option value='active'>Active</Option>
                <Option value='expired'>Expired</Option>
                <Option value='cancelled'>Cancelled</Option>
                <Option value='pending'>Pending</Option>
              </Select>
            </FilterDropdown>
          )}
          width={100}
        />

        {/* Subscription Period Column */}
        <Table.Column
          title='Period'
          render={(_, record: any) => (
            <div>
              <Text style={{ fontSize: '12px' }}>
                Start: {new Date(record.startDate).toLocaleDateString()}
              </Text>
              <br />
              <Text style={{ fontSize: '12px' }}>
                End: {new Date(record.endDate).toLocaleDateString()}
              </Text>
              <br />
              {record.status === 'active' && (
                <Text style={{ fontSize: '11px', color: '#1890ff' }}>
                  {Math.ceil(
                    (new Date(record.endDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days left
                </Text>
              )}
            </div>
          )}
          width={120}
        />

        {/* Auto Renewal Column */}
        <Table.Column
          title='Auto Renew'
          render={(_, record: any) => (
            <div style={{ textAlign: 'center' }}>
              <Switch checked={record.autoRenew} disabled size='small' />
              <br />
              <Text style={{ fontSize: '11px' }}>
                {record.autoRenew ? 'Enabled' : 'Disabled'}
              </Text>
            </div>
          )}
          width={80}
        />

        {/* Payment Status Column */}
        <Table.Column
          title='Payment'
          render={(_, record: any) => (
            <div>
              <Tag
                color={
                  record.paymentStatus === 'completed' ? 'green' : 'orange'
                }
              >
                {record.paymentStatus?.toUpperCase() || 'PENDING'}
              </Tag>
              <br />
              <Text style={{ fontSize: '11px' }}>
                {record.paymentMethod?.toUpperCase() || 'N/A'}
              </Text>
            </div>
          )}
          width={100}
        />

        {/* Usage Stats Column */}
        <Table.Column
          title='Usage'
          render={(_, record: any) => (
            <div>
              <Text style={{ fontSize: '12px' }}>
                Trips: {record.tripsCompleted || 0}
              </Text>
              <br />
              <Progress
                percent={
                  record.plan?.tripLimit
                    ? Math.min(
                        (record.tripsCompleted / record.plan.tripLimit) * 100,
                        100
                      )
                    : 0
                }
                size='small'
                showInfo={false}
              />
              <Text style={{ fontSize: '10px', color: '#666' }}>
                {record.tripsCompleted || 0} /{' '}
                {record.plan?.tripLimit || 'Unlimited'}
              </Text>
            </div>
          )}
          width={100}
        />

        {/* Actions Column */}
        <Table.Column
          title='Actions'
          render={(_, record) => (
            <Space size='small'>
              <ShowButton hideText size='small' recordItemId={record.id} />
              {record.status === 'active' && (
                <>
                  <Button
                    size='small'
                    icon={<ReloadOutlined />}
                    onClick={() => handleRenewSubscription(record.id)}
                  >
                    Renew
                  </Button>
                  <Button
                    size='small'
                    danger
                    onClick={() => handleCancelSubscription(record.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Space>
          )}
          fixed='right'
          width={150}
        />
      </Table>
    </List>
  );
};

// Subscription Show Component
export const SubscriptionShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: 'subscriptions',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const daysLeft = record
    ? Math.ceil(
        (new Date(record.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Show isLoading={isLoading}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Subscription Details' key='1'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Driver Information'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='Driver Name'>
                    <Text strong>
                      {record?.driver?.firstname} {record?.driver?.lastname}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    {record?.driver?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label='Phone'>
                    {record?.driver?.phone?.fullPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label='Driver ID'>
                    <Text code>{record?.driver?.id}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Plan Information'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='Plan Name'>
                    <Space>
                      {record?.plan?.tier === 'premium' && (
                        <CrownOutlined style={{ color: '#faad14' }} />
                      )}
                      <Text strong>{record?.plan?.name}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Tier'>
                    <Tag color='blue'>{record?.plan?.tier?.toUpperCase()}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Amount'>
                    <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                      ₦{record?.plan?.amount?.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Duration'>
                    {record?.plan?.duration}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trip Limit'>
                    {record?.plan?.tripLimit || 'Unlimited'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Commission Rate'>
                    {record?.plan?.commissionRate || 0}%
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title='Subscription Status'>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title='Status'
                      value={record?.status?.toUpperCase()}
                      valueStyle={{
                        color:
                          record?.status === 'active' ? '#52c41a' : '#ff4d4f',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title='Days Remaining'
                      value={Math.max(daysLeft, 0)}
                      valueStyle={{
                        color:
                          daysLeft > 7
                            ? '#52c41a'
                            : daysLeft > 0
                            ? '#faad14'
                            : '#ff4d4f',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title='Auto Renewal'
                      value={record?.autoRenew ? 'Enabled' : 'Disabled'}
                      valueStyle={{
                        color: record?.autoRenew ? '#52c41a' : '#ff4d4f',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title='Trips Used'
                      value={`${record?.tripsCompleted || 0} / ${
                        record?.plan?.tripLimit || '∞'
                      }`}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Payment History' key='2'>
          <Card title='Payment Records'>
            <Descriptions bordered>
              <Descriptions.Item label='Payment Status'>
                <Tag
                  color={
                    record?.paymentStatus === 'completed' ? 'green' : 'orange'
                  }
                >
                  {record?.paymentStatus?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Payment Method'>
                {record?.paymentMethod?.toUpperCase() || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label='Payment Reference'>
                <Text code>{record?.paymentReference || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Start Date'>
                {new Date(record?.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='End Date'>
                {new Date(record?.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='Created At'>
                {new Date(record?.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab='Usage Analytics' key='3'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Trip Statistics'>
                <Statistic
                  title='Trips Completed'
                  value={record?.tripsCompleted || 0}
                  prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                />
                {record?.plan?.tripLimit && (
                  <div style={{ marginTop: 16 }}>
                    <Text>Usage Progress:</Text>
                    <Progress
                      percent={Math.min(
                        (record.tripsCompleted / record.plan.tripLimit) * 100,
                        100
                      )}
                      status={
                        record.tripsCompleted / record.plan.tripLimit > 0.8
                          ? 'exception'
                          : 'active'
                      }
                    />
                  </div>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Earnings Summary'>
                <Statistic
                  title='Total Earnings'
                  value={record?.totalEarnings || 0}
                  prefix='₦'
                  formatter={(value) => value?.toLocaleString()}
                />
                <div style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: '12px' }}>
                    Average per trip: ₦
                    {record?.tripsCompleted > 0
                      ? Math.round(
                          (record?.totalEarnings || 0) / record?.tripsCompleted
                        ).toLocaleString()
                      : 0}
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Show>
  );
};

// Subscription Plan Management Components
export const SubscriptionPlanList: React.FC = () => {
  const { tableProps } = useTable({
    resource: 'subscription-plans',
  });

  return (
    <List
      headerButtons={[<CreateButton key='create'>Create Plan</CreateButton>]}
    >
      <Table {...tableProps} rowKey='id'>
        <Table.Column
          title='Plan Name'
          render={(_, record: any) => (
            <Space>
              {record.tier === 'premium' && (
                <CrownOutlined style={{ color: '#faad14' }} />
              )}
              <Text strong>{record.name}</Text>
            </Space>
          )}
        />
        <Table.Column
          dataIndex='tier'
          title='Tier'
          render={(tier) => (
            <Tag color={tier === 'premium' ? 'gold' : 'blue'}>
              {tier?.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex='amount'
          title='Amount'
          render={(amount) => <Text strong>₦{amount?.toLocaleString()}</Text>}
        />
        <Table.Column dataIndex='duration' title='Duration' />
        <Table.Column
          dataIndex='tripLimit'
          title='Trip Limit'
          render={(limit) => limit || 'Unlimited'}
        />
        <Table.Column
          dataIndex='isActive'
          title='Status'
          render={(isActive) => (
            <Tag color={isActive ? 'green' : 'red'}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
          )}
        />
        <Table.Column
          title='Actions'
          render={(_, record) => (
            <Space>
              <EditButton hideText size='small' recordItemId={record.id} />
              <DeleteButton hideText size='small' recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

// Create/Edit components would go here following similar patterns
export const SubscriptionCreate: React.FC = () => {
  return <div>Subscription Create Component</div>;
};

export const SubscriptionEdit: React.FC = () => {
  return <div>Subscription Edit Component</div>;
};
