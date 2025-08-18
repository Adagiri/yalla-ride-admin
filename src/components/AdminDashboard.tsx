import { useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Avatar,
  Badge,
  Progress,
  Tabs,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  Switch,
  Rate,
  Tooltip,
  Drawer,
  Alert,
  Spin,
} from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  TeamOutlined,
  RocketOutlined,
  DollarOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  WalletOutlined,
  BellOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

import {Trip } from "../types/trip"
import { Driver } from '../types/driver';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data - in real app, this would come from your GraphQL API
const mockData = {
  dashboardStats: {
    activeTrips: 147,
    onlineDrivers: 89,
    totalRevenue: 125000,
    completedTrips: 1250,
  },
  trips: [
    {
      id: '1',
      tripNumber: 'TR001',
      customer: { firstname: 'John', lastname: 'Doe' },
      driver: { firstname: 'Mike', lastname: 'Johnson' },
      status: 'in_progress',
      pickup: { address: 'Lagos Island, Lagos' },
      destination: { address: 'Victoria Island, Lagos' },
      finalAmount: 2500,
      requestedAt: '2025-01-15T10:30:00Z',
    },
    {
      id: '2',
      tripNumber: 'TR002',
      customer: { firstname: 'Sarah', lastname: 'Wilson' },
      driver: { firstname: 'David', lastname: 'Brown' },
      status: 'completed',
      pickup: { address: 'Ikeja, Lagos' },
      destination: { address: 'Lekki, Lagos' },
      finalAmount: 3200,
      requestedAt: '2025-01-15T09:15:00Z',
    },
  ],
  drivers: [
    {
      id: '1',
      firstname: 'Mike',
      lastname: 'Johnson',
      email: 'mike@example.com',
      phone: { fullPhone: '+2348123456789' },
      isOnline: true,
      isAvailable: true,
      paymentModel: 'SUBSCRIPTION',
      stats: { totalTrips: 145, averageRating: 4.8, totalEarnings: 89500 },
      profilePhotoSet: true,
      personalInfoSet: true,
      driverLicenseVerified: true,
      vehicleInspectionDone: true,
    },
    {
      id: '2',
      firstname: 'David',
      lastname: 'Brown',
      email: 'david@example.com',
      phone: { fullPhone: '+2348123456790' },
      isOnline: false,
      isAvailable: false,
      paymentModel: 'COMMISSION',
      stats: { totalTrips: 89, averageRating: 4.6, totalEarnings: 67800 },
      profilePhotoSet: true,
      personalInfoSet: true,
      driverLicenseVerified: false,
      vehicleInspectionDone: true,
    },
  ],
  subscriptions: [
    {
      id: '1',
      driver: { firstname: 'Mike', lastname: 'Johnson' },
      plan: { name: 'Premium Monthly', amount: 5000 },
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      autoRenew: true,
    },
  ],
};

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [tripDetailModal, setTripDetailModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [driverDrawer, setDriverDrawer] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Dashboard Statistics Cards
  const DashboardStats = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title='Active Trips'
            value={mockData.dashboardStats.activeTrips}
            prefix={<CarOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title='Online Drivers'
            value={mockData.dashboardStats.onlineDrivers}
            prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Today's Revenue"
            value={mockData.dashboardStats.totalRevenue}
            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
            precision={0}
            formatter={(value) => `₦${value?.toLocaleString()}`}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title='Completed Trips'
            value={mockData.dashboardStats.completedTrips}
            prefix={<CheckOutlined style={{ color: '#722ed1' }} />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Trip Management Component
  const TripManagement = () => {
    const tripColumns = [
      {
        title: 'Trip #',
        dataIndex: 'tripNumber',
        key: 'tripNumber',
        render: (text: string) => <Text strong>{text}</Text>,
      },
      {
        title: 'Customer',
        key: 'customer',
        render: (_: any, record: any) => (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text>
              {record.customer.firstname} {record.customer.lastname}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Driver',
        key: 'driver',
        render: (_: any, record: any) => (
          <Space>
            <Avatar icon={<CarOutlined />} />
            <Text>
              {record.driver.firstname} {record.driver.lastname}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const colors:any = {
            in_progress: 'blue',
            completed: 'green',
            cancelled: 'red',
            searching: 'orange',
          };
          return (
            <Tag color={colors[status]}>
              {status.replace('_', ' ').toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: 'Route',
        key: 'route',
        render: (_: any, record: any) => (
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              From: {record.pickup.address}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              To: {record.destination.address}
            </div>
          </div>
        ),
      },
      {
        title: 'Amount',
        dataIndex: 'finalAmount',
        key: 'finalAmount',
        render: (amount:any) => <Text strong>₦{amount?.toLocaleString()}</Text>,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => {
                setSelectedTrip(record);
                setTripDetailModal(true);
              }}
            >
              View
            </Button>
            <Button icon={<EnvironmentOutlined />} size='small'>
              Track
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title='Trip Management'
        extra={
          <Space>
            <Select defaultValue='all' style={{ width: 120 }}>
              <Option value='all'>All Status</Option>
              <Option value='in_progress'>In Progress</Option>
              <Option value='completed'>Completed</Option>
              <Option value='cancelled'>Cancelled</Option>
            </Select>
            <RangePicker />
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </Space>
        }
      >
        <Table
          columns={tripColumns}
          dataSource={mockData.trips}
          rowKey='id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    );
  };

  // Driver Management Component
  const DriverManagement = () => {
    const driverColumns = [
      {
        title: 'Driver',
        key: 'driver',
        render: (_: any, record: any) => (
          <Space>
            <Avatar src={record.profilePhoto} icon={<UserOutlined />} />
            <div>
              <div>
                <Text strong>
                  {record.firstname} {record.lastname}
                </Text>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.email}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        render: (_: any, record: any) => (
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
        ),
      },
      {
        title: 'Payment Model',
        dataIndex: 'paymentModel',
        key: 'paymentModel',
        render: (model: string) => (
          <Tag color={model === 'SUBSCRIPTION' ? 'blue' : 'green'}>{model}</Tag>
        ),
      },
      {
        title: 'Performance',
        key: 'performance',
        render: (_: any, record: any) => (
          <Space direction='vertical' size='small'>
            <div>
              <Text style={{ fontSize: '12px' }}>
                Trips: {record.stats.totalTrips}
              </Text>
            </div>
            <div>
              <Rate
                disabled
                defaultValue={record.stats.averageRating}
                allowHalf
                style={{ fontSize: '12px' }}
              />
              <Text style={{ fontSize: '12px', marginLeft: 8 }}>
                {record.stats.averageRating}
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: 'Verification',
        key: 'verification',
        render: (_: any, record: any) => (
          <Space direction='vertical' size='small'>
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
        ),
      },
      {
        title: 'Earnings',
        key: 'earnings',
        render: (_: any, record: any) => (
          <Text strong>₦{record.stats.totalEarnings?.toLocaleString()}</Text>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => {
                setSelectedDriver(record);
                setDriverDrawer(true);
              }}
            >
              Details
            </Button>
            <Button icon={<EditOutlined />} size='small'>
              Edit
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Card
        title='Driver Management'
        extra={
          <Space>
            <Select defaultValue='all' style={{ width: 120 }}>
              <Option value='all'>All Drivers</Option>
              <Option value='online'>Online</Option>
              <Option value='verified'>Verified</Option>
              <Option value='pending'>Pending</Option>
            </Select>
            <Input.Search
              placeholder='Search drivers...'
              style={{ width: 200 }}
            />
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </Space>
        }
      >
        <Table
          columns={driverColumns}
          dataSource={mockData.drivers}
          rowKey='id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    );
  };

  // Financial Overview Component
  const FinancialOverview = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title='Revenue Overview'>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title='Today' value={45600} prefix='₦' />
            </Col>
            <Col span={12}>
              <Statistic title='This Week' value={289000} prefix='₦' />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Statistic title='This Month' value={1250000} prefix='₦' />
            </Col>
            <Col span={12}>
              <Statistic title='All Time' value={8900000} prefix='₦' />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Payment Methods'>
          <div style={{ marginBottom: 16 }}>
            <Text>Cash Payments</Text>
            <Progress percent={45} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text>Card Payments</Text>
            <Progress percent={35} />
          </div>
          <div>
            <Text>Wallet Payments</Text>
            <Progress percent={20} />
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Subscription Management Component
  const SubscriptionManagement = () => {
    const subscriptionColumns = [
      {
        title: 'Driver',
        key: 'driver',
        render: (_: any, record: any) => (
          <Text>
            {record.driver.firstname} {record.driver.lastname}
          </Text>
        ),
      },
      {
        title: 'Plan',
        key: 'plan',
        render: (_: any, record: any) => (
          <div>
            <Text strong>{record.plan.name}</Text>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ₦{record.plan.amount.toLocaleString()}
            </div>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: 'Period',
        key: 'period',
        render: (_: any, record: any) => (
          <div>
            <div style={{ fontSize: '12px' }}>
              {record.startDate} to {record.endDate}
            </div>
          </div>
        ),
      },
      {
        title: 'Auto Renew',
        dataIndex: 'autoRenew',
        key: 'autoRenew',
        render: (autoRenew: boolean) => <Switch checked={autoRenew} disabled />,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: any) => (
          <Space>
            <Button size='small'>Renew</Button>
            <Button size='small' danger>
              Cancel
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Card title='Subscription Management'>
        <Table
          columns={subscriptionColumns}
          dataSource={mockData.subscriptions}
          rowKey='id'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    );
  };

  // System Health Component
  const SystemHealth = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title='API Status'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>GraphQL API</Text>
              <Badge status='success' text='Online' />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Payment Gateway</Text>
              <Badge status='success' text='Online' />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Location Services</Text>
              <Badge status='success' text='Online' />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>SMS Service</Text>
              <Badge status='processing' text='Degraded' />
            </div>
          </Space>
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Performance'>
          <div style={{ marginBottom: 16 }}>
            <Text>Response Time</Text>
            <Progress percent={85} status='active' />
            <Text style={{ fontSize: '12px', color: '#666' }}>245ms avg</Text>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text>Success Rate</Text>
            <Progress percent={98} />
            <Text style={{ fontSize: '12px', color: '#666' }}>98.5%</Text>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Quick Actions'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Button icon={<ReloadOutlined />} block>
              Refresh Cache
            </Button>
            <Button icon={<BellOutlined />} block>
              Send Broadcast
            </Button>
            <Button icon={<SettingOutlined />} block>
              System Config
            </Button>
            <Button icon={<SafetyOutlined />} block type='primary'>
              Backup Data
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <div>
            <DashboardStats />
            <Row gutter={16}>
              <Col span={16}>
                <TripManagement />
              </Col>
              <Col span={8}>
                <SystemHealth />
              </Col>
            </Row>
          </div>
        );
      case 'trips':
        return <TripManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'payments':
        return <FinancialOverview />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'settings':
        return <SystemHealth />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme='dark'>
        <div style={{ padding: '16px', textAlign: 'center', color: 'white' }}>
          <RocketOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            RideAdmin
          </Title>
        </div>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key='dashboard' icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key='trips' icon={<CarOutlined />}>
            Trip Management
          </Menu.Item>
          <Menu.Item key='drivers' icon={<TeamOutlined />}>
            Driver Management
          </Menu.Item>
          <Menu.Item key='customers' icon={<UserOutlined />}>
            Customer Management
          </Menu.Item>
          <Menu.Item key='payments' icon={<CreditCardOutlined />}>
            Financial Management
          </Menu.Item>
          <Menu.Item key='subscriptions' icon={<WalletOutlined />}>
            Subscriptions
          </Menu.Item>
          <Menu.Item key='vehicles' icon={<CarOutlined />}>
            Vehicle Management
          </Menu.Item>
          <Menu.Item key='locations' icon={<EnvironmentOutlined />}>
            Location Management
          </Menu.Item>
          <Menu.Item key='notifications' icon={<BellOutlined />}>
            Communications
          </Menu.Item>
          <Menu.Item key='settings' icon={<SettingOutlined />}>
            System Settings
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Title level={3} style={{ margin: 0, textTransform: 'capitalize' }}>
            {selectedMenu === 'dashboard'
              ? 'Dashboard Overview'
              : selectedMenu.replace('_', ' ')}
          </Title>
          <Space>
            <Badge count={5}>
              <Button icon={<BellOutlined />} type='text' />
            </Badge>
            <Avatar icon={<UserOutlined />} />
            <Text strong>Admin User</Text>
          </Space>
        </Header>

        <Content
          style={{ margin: '24px', background: '#f0f2f5', minHeight: '280px' }}
        >
          {renderContent()}
        </Content>
      </Layout>

      {/* Trip Detail Modal */}
      <Modal
        title={`Trip Details - ${selectedTrip?.tripNumber}`}
        open={tripDetailModal}
        onCancel={() => setTripDetailModal(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setTripDetailModal(false)}>
            Close
          </Button>,
          <Button key='track' type='primary' icon={<EnvironmentOutlined />}>
            Track Live
          </Button>,
        ]}
      >
        {selectedTrip && (
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Trip Info' key='1'>
              <Row gutter={16}>
                <Col span={12}>
                  <Card size='small' title='Customer'>
                    <p>
                      <strong>Name:</strong> {selectedTrip.customer.firstname}{' '}
                      {selectedTrip.customer.lastname}
                    </p>
                    <p>
                      <strong>Phone:</strong> +234 xxx xxx xxxx
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size='small' title='Driver'>
                    <p>
                      <strong>Name:</strong> {selectedTrip.driver.firstname}{' '}
                      {selectedTrip.driver.lastname}
                    </p>
                    <p>
                      <strong>Phone:</strong> +234 xxx xxx xxxx
                    </p>
                  </Card>
                </Col>
              </Row>
              <Card size='small' title='Route' style={{ marginTop: 16 }}>
                <p>
                  <strong>Pickup:</strong> {selectedTrip.pickup.address}
                </p>
                <p>
                  <strong>Destination:</strong>{' '}
                  {selectedTrip.destination.address}
                </p>
                <p>
                  <strong>Amount:</strong> ₦
                  {selectedTrip.finalAmount?.toLocaleString()}
                </p>
              </Card>
            </TabPane>
            <TabPane tab='Timeline' key='2'>
              <div style={{ padding: 20 }}>
                <Text>Trip timeline and events will be displayed here</Text>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Driver Details Drawer */}
      <Drawer
        title='Driver Details'
        placement='right'
        width={500}
        onClose={() => setDriverDrawer(false)}
        open={driverDrawer}
      >
        {selectedDriver && (
          <div>
            <Card size='small' style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar size={80} icon={<UserOutlined />} />
                <Title level={4} style={{ margin: '8px 0' }}>
                  {selectedDriver.firstname} {selectedDriver.lastname}
                </Title>
                <Tag color={selectedDriver.isOnline ? 'green' : 'red'}>
                  {selectedDriver.isOnline ? 'Online' : 'Offline'}
                </Tag>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title='Total Trips'
                    value={selectedDriver.stats.totalTrips}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title='Rating'
                    value={selectedDriver.stats.averageRating}
                    suffix='/ 5'
                  />
                </Col>
              </Row>
            </Card>

            <Card size='small' title='Contact Information'>
              <p>
                <PhoneOutlined /> {selectedDriver.phone.fullPhone}
              </p>
              <p>
                <MailOutlined /> {selectedDriver.email}
              </p>
            </Card>

            <Card
              size='small'
              title='Verification Status'
              style={{ marginTop: 16 }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text>Profile Complete: </Text>
                {selectedDriver.personalInfoSet ? (
                  <Tag color='green'>Complete</Tag>
                ) : (
                  <Tag color='red'>Incomplete</Tag>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text>License Verified: </Text>
                {selectedDriver.driverLicenseVerified ? (
                  <Tag color='green'>Verified</Tag>
                ) : (
                  <Tag color='orange'>Pending</Tag>
                )}
              </div>
              <div>
                <Text>Vehicle Inspection: </Text>
                {selectedDriver.vehicleInspectionDone ? (
                  <Tag color='green'>Done</Tag>
                ) : (
                  <Tag color='red'>Pending</Tag>
                )}
              </div>
            </Card>

            <Card size='small' title='Earnings' style={{ marginTop: 16 }}>
              <Statistic
                title='Total Earnings'
                value={selectedDriver.stats.totalEarnings}
                prefix='₦'
                precision={0}
                formatter={(value) => value?.toLocaleString()}
              />
              <div style={{ marginTop: 16 }}>
                <Text>Payment Model: </Text>
                <Tag
                  color={
                    selectedDriver.paymentModel === 'SUBSCRIPTION'
                      ? 'blue'
                      : 'green'
                  }
                >
                  {selectedDriver.paymentModel}
                </Tag>
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};

export default AdminDashboard;
