import React from 'react';
import {
  List,
  ShowButton,
  Show,
  getDefaultSortOrder,
  FilterDropdown,
  useSelect,
  useTable,
} from '@refinedev/antd';

import {  useShow } from '@refinedev/core';

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
  Descriptions,
  Tabs,
  DatePicker,
  message,
  Modal,
  Form,
  Input,
} from 'antd';
import {
  DollarOutlined,
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Payment List Component
export const PaymentList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'payments',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  const handleRefund = async (paymentId: string) => {
    Modal.confirm({
      title: 'Confirm Refund',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to process this refund?',
      onOk: async () => {
        try {
          // Call your refund mutation
          message.success('Refund processed successfully');
        } catch (error) {
          message.error('Failed to process refund');
        }
      },
    });
  };

  return (
    <List
      headerButtons={[
        <Button key='export' icon={<DownloadOutlined />}>
          Export
        </Button>,
        <Button
          key='refresh'
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>,
      ]}
    >
      {/* Financial Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Total Volume Today'
              value={2450000}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Transactions Today'
              value={347}
              prefix={<CreditCardOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Pending Payouts'
              value={185000}
              prefix={<WalletOutlined style={{ color: '#faad14' }} />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Failed Payments'
              value={12}
              prefix={<CloseOutlined style={{ color: '#ff4d4f' }} />}
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
            `${range[0]}-${range[1]} of ${total} transactions`,
        }}
      >
        {/* Transaction ID Column */}
        <Table.Column
          dataIndex='id'
          title='Transaction ID'
          render={(value) => (
            <Text strong style={{ fontFamily: 'monospace' }}>
              {value?.substring(0, 8)}...
            </Text>
          )}
          width={120}
        />

        {/* User Column */}
        <Table.Column
          title='User'
          render={(_, record: any) => (
            <div>
              <Text strong>
                {record.user?.firstname} {record.user?.lastname}
              </Text>
              <br />
              <Text type='secondary' style={{ fontSize: '12px' }}>
                {record.user?.accountType} • {record.user?.email}
              </Text>
            </div>
          )}
          width={180}
        />

        {/* Amount Column */}
        <Table.Column
          dataIndex='amount'
          title='Amount'
          render={(amount, record: any) => (
            <div>
              <Text
                strong
                style={{
                  color: record.type === 'credit' ? '#52c41a' : '#ff4d4f',
                }}
              >
                {record.type === 'credit' ? '+' : '-'}₦
                {amount?.toLocaleString()}
              </Text>
              <br />
              <Text type='secondary' style={{ fontSize: '12px' }}>
                {record.currency}
              </Text>
            </div>
          )}
          sorter
          width={120}
        />

        {/* Type & Purpose Column */}
        <Table.Column
          title='Type & Purpose'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Tag color={record.type === 'credit' ? 'green' : 'red'}>
                {record.type.toUpperCase()}
              </Tag>
              <Text style={{ fontSize: '12px' }}>
                {record.purpose?.replace('_', ' ').toUpperCase()}
              </Text>
            </Space>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 150 }}
                mode='multiple'
                placeholder='Select Type'
              >
                <Option value='credit'>Credit</Option>
                <Option value='debit'>Debit</Option>
              </Select>
            </FilterDropdown>
          )}
          width={120}
        />

        {/* Payment Method Column */}
        <Table.Column
          dataIndex='paymentMethod'
          title='Method'
          render={(method) => {
            const methodConfig: Record<
              string,
              { color: string; icon: React.ReactNode }
            > = {
              card: { color: 'blue', icon: <CreditCardOutlined /> },
              wallet: { color: 'purple', icon: <WalletOutlined /> },
              bank_transfer: { color: 'green', icon: <BankOutlined /> },
              cash: { color: 'orange', icon: <DollarOutlined /> },
            };

            const config = methodConfig[method] || {
              color: 'default',
              icon: null,
            };
            return (
              <Tag color={config.color} icon={config.icon}>
                {method?.replace('_', ' ').toUpperCase()}
              </Tag>
            );
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 150 }}
                mode='multiple'
                placeholder='Select Method'
              >
                <Option value='card'>Card</Option>
                <Option value='wallet'>Wallet</Option>
                <Option value='bank_transfer'>Bank Transfer</Option>
                <Option value='cash'>Cash</Option>
              </Select>
            </FilterDropdown>
          )}
          width={120}
        />

        {/* Status Column */}
        <Table.Column
          dataIndex='status'
          title='Status'
          render={(status) => {
            const statusConfig: Record<string, { color: string }> = {
              completed: { color: 'green' },
              pending: { color: 'orange' },
              failed: { color: 'red' },
              refunded: { color: 'purple' },
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
                <Option value='completed'>Completed</Option>
                <Option value='pending'>Pending</Option>
                <Option value='failed'>Failed</Option>
                <Option value='refunded'>Refunded</Option>
              </Select>
            </FilterDropdown>
          )}
          width={100}
        />

        {/* Reference Column */}
        <Table.Column
          title='Reference'
          render={(_, record: any) => (
            <div>
              {record.tripId && (
                <Text style={{ fontSize: '12px' }}>
                  Trip: {record.tripId.substring(0, 8)}...
                </Text>
              )}
              {record.paymentReference && (
                <div>
                  <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    Ref: {record.paymentReference}
                  </Text>
                </div>
              )}
            </div>
          )}
          width={120}
        />

        {/* Date Column */}
        <Table.Column
          dataIndex='createdAt'
          title='Date'
          render={(value) => (
            <div>
              <Text style={{ fontSize: '12px' }}>
                {new Date(value).toLocaleDateString()}
              </Text>
              <br />
              <Text type='secondary' style={{ fontSize: '11px' }}>
                {new Date(value).toLocaleTimeString()}
              </Text>
            </div>
          )}
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
              {record.status === 'completed' && record.type === 'debit' && (
                <Button
                  size='small'
                  danger
                  onClick={() => handleRefund(record.id)}
                >
                  Refund
                </Button>
              )}
            </Space>
          )}
          fixed='right'
          width={100}
        />
      </Table>
    </List>
  );
};

// Payment Show Component
export const PaymentShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: 'payments',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Transaction Details' key='1'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Transaction Info'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='Transaction ID'>
                    <Text code>{record?.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Amount'>
                    <Text
                      strong
                      style={{
                        fontSize: '16px',
                        color:
                          record?.type === 'credit' ? '#52c41a' : '#ff4d4f',
                      }}
                    >
                      {record?.type === 'credit' ? '+' : '-'}₦
                      {record?.amount?.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Type'>
                    <Tag color={record?.type === 'credit' ? 'green' : 'red'}>
                      {record?.type?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Purpose'>
                    <Text>
                      {record?.purpose?.replace('_', ' ').toUpperCase()}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Status'>
                    <Tag
                      color={
                        record?.status === 'completed'
                          ? 'green'
                          : record?.status === 'pending'
                          ? 'orange'
                          : record?.status === 'failed'
                          ? 'red'
                          : 'purple'
                      }
                    >
                      {record?.status?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Payment Method'>
                    <Tag>
                      {record?.paymentMethod?.replace('_', ' ').toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='User Information'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='User'>
                    <Text strong>
                      {record?.user?.firstname} {record?.user?.lastname}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    {record?.user?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label='Account Type'>
                    <Tag>{record?.user?.accountType}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='User ID'>
                    <Text code>{record?.userId}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Payment Details' key='2'>
          <Card>
            <Descriptions bordered>
              <Descriptions.Item label='Payment Reference'>
                <Text code>{record?.paymentReference || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Gateway'>
                {record?.gateway || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label='Currency'>
                {record?.currency}
              </Descriptions.Item>
              <Descriptions.Item label='Created At'>
                {new Date(record?.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label='Updated At'>
                {new Date(record?.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label='Description' span={3}>
                {record?.description}
              </Descriptions.Item>
              {record?.metadata && (
                <Descriptions.Item label='Metadata' span={3}>
                  <pre
                    style={{
                      fontSize: '12px',
                      background: '#f5f5f5',
                      padding: '8px',
                    }}
                  >
                    {JSON.stringify(record.metadata, null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </TabPane>

        {record?.tripId && (
          <TabPane tab='Related Trip' key='3'>
            <Card title='Trip Information'>
              <Descriptions bordered>
                <Descriptions.Item label='Trip ID'>
                  <Text code>{record.tripId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label='View Trip'>
                  <Button type='link' href={`/trips/show/${record.tripId}`}>
                    View Trip Details
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </TabPane>
        )}
      </Tabs>
    </Show>
  );
};
