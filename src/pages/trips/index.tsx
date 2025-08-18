import React from 'react';
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  getDefaultSortOrder,
  FilterDropdown,
  useSelect,
} from '@refinedev/antd';
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
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

// Trip List Component with Refine hooks
export const TripList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'trips',
    initialSorter: [
      {
        field: 'requestedAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  // Status options for filtering
  const { selectProps: statusSelectProps } = useSelect({
    resource: 'trips',
    optionLabel: 'status',
    optionValue: 'status',
  });

  return (
    <List
      headerButtons={[
        <Button key='refresh' onClick={() => window.location.reload()}>
          Refresh Live Data
        </Button>,
      ]}
    >
      {/* Quick Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Active Trips'
              value={147}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Completed Today'
              value={89}
              prefix={<span style={{ color: '#52c41a' }}>✓</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Revenue Today'
              value={125000}
              prefix='₦'
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title='Avg Trip Duration' value={25} suffix='min' />
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
            `${range[0]}-${range[1]} of ${total} trips`,
        }}
      >
        {/* Trip Number Column */}
        <Table.Column
          dataIndex='tripNumber'
          title='Trip #'
          render={(value) => <Text strong>{value}</Text>}
          sorter
          defaultSortOrder={getDefaultSortOrder('tripNumber', sorters)}
        />

        {/* Customer Column */}
        <Table.Column
          dataIndex='customer'
          title='Customer'
          render={(customer) => (
            <Space>
              <Avatar icon={<UserOutlined />} size='small' />
              <div>
                <Text strong>
                  {customer?.firstname} {customer?.lastname}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {customer?.phone?.fullPhone}
                </Text>
              </div>
            </Space>
          )}
        />

        {/* Driver Column */}
        <Table.Column
          dataIndex='driver'
          title='Driver'
          render={(driver) => (
            <Space>
              <Avatar icon={<CarOutlined />} size='small' />
              <div>
                <Text strong>
                  {driver?.firstname} {driver?.lastname}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  ID: {driver?.id?.substring(0, 8)}...
                </Text>
              </div>
            </Space>
          )}
        />

        {/* Status Column with Filtering */}
        <Table.Column
          dataIndex='status'
          title='Status'
          render={(status) => {
            const statusConfig: Record<
              string,
              { color: string; label: string }
            > = {
              searching: { color: 'orange', label: 'Searching' },
              drivers_found: { color: 'blue', label: 'Drivers Found' },
              driver_assigned: { color: 'cyan', label: 'Driver Assigned' },
              driver_arrived: { color: 'purple', label: 'Driver Arrived' },
              in_progress: { color: 'blue', label: 'In Progress' },
              completed: { color: 'green', label: 'Completed' },
              cancelled: { color: 'red', label: 'Cancelled' },
            };

            const config = statusConfig[status] || {
              color: 'default',
              label: status,
            };
            return <Tag color={config.color}>{config.label}</Tag>;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                mode='multiple'
                placeholder='Select Status'
                {...statusSelectProps}
              />
            </FilterDropdown>
          )}
          sorter
        />

        {/* Route Column */}
        <Table.Column
          title='Route'
          render={(_, record: any) => (
            <div style={{ maxWidth: 200 }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                <EnvironmentOutlined /> {record.pickup?.address}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                🏁 {record.destination?.address}
              </div>
            </div>
          )}
        />

        {/* Amount Column */}
        <Table.Column
          dataIndex={['pricing', 'finalAmount']}
          title='Amount'
          render={(amount) => <Text strong>₦{amount?.toLocaleString()}</Text>}
          sorter
          defaultSortOrder={getDefaultSortOrder('finalAmount', sorters)}
        />

        {/* Date Column */}
        <Table.Column
          dataIndex='requestedAt'
          title='Requested'
          render={(value) => <DateField value={value} format='MMM DD, HH:mm' />}
          sorter
          defaultSortOrder={getDefaultSortOrder('requestedAt', sorters)}
        />

        {/* Payment Method */}
        <Table.Column
          dataIndex='paymentMethod'
          title='Payment'
          render={(method) => {
            const colors: Record<string, string> = {
              cash: 'green',
              card: 'blue',
              wallet: 'purple',
            };
            return <Tag color={colors[method]}>{method.toUpperCase()}</Tag>;
          }}
        />

        {/* Actions Column */}
        <Table.Column
          title='Actions'
          dataIndex='actions'
          render={(_, record) => (
            <Space size='middle'>
              <ShowButton hideText size='small' recordItemId={record.id} />
              <EditButton hideText size='small' recordItemId={record.id} />
              <Button
                size='small'
                icon={<EnvironmentOutlined />}
                onClick={() => {
                  // Handle live tracking
                  console.log('Track trip:', record.id);
                }}
              >
                Track
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

// Trip Show Component
export const TripShow: React.FC = () => {
  // Implementation for detailed trip view
  return (
    <div>
      <Card title='Trip Details'>
        {/* Detailed trip information */}
        <p>Trip show page with live tracking map, timeline, etc.</p>
      </Card>
    </div>
  );
};

// Trip Edit Component
export const TripEdit: React.FC = () => {
  // Implementation for trip editing (admin actions)
  return (
    <div>
      <Card title='Trip Actions'>
        {/* Admin actions like cancellation, refunds, etc. */}
        <p>Trip edit page with admin actions</p>
      </Card>
    </div>
  );
};
