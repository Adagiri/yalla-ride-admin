import React from 'react';
import { useCustom } from '@refinedev/core';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import {
  CarOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  useDashboardMetrics,
  useRealTimeNotifications,
} from '../../hooks/useRealTime';

// Dashboard Page Component
export const DashboardPage: React.FC = () => {
  // Fetch dashboard data using Refine's useCustom hook
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useCustom({
    url: '',
    method: 'get',
    config: {
      query: `
        query GetDashboardMetrics {
          getDashboardMetrics {
            activeTrips
            onlineDrivers
            completedTripsToday
            totalRevenueToday
            averageRating
            averageTripDuration
            totalDrivers
            totalCustomers
            pendingVerifications
            systemHealth {
              api
              database
              paymentGateway
              locationServices
            }
          }
        }
      `,
    },
  });

  // Real-time updates
  const { metrics } = useDashboardMetrics();
  const { notifications } = useRealTimeNotifications();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='Error Loading Dashboard'
        description='Unable to fetch dashboard data. Please refresh the page.'
        type='error'
        showIcon
      />
    );
  }

  const data = dashboardData?.data?.getDashboardMetrics || {};

  return (
    <div style={{ padding: '24px' }}>
      {/* Main Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Active Trips'
              value={metrics.activeTrips || data.activeTrips || 0}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Online Drivers'
              value={metrics.onlineDrivers || data.onlineDrivers || 0}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={metrics.totalRevenue || data.totalRevenueToday || 0}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
              precision={0}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Completed Trips'
              value={metrics.completedTrips || data.completedTripsToday || 0}
              prefix={<CheckOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Average Rating'
              value={data.averageRating || 4.8}
              prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
              precision={1}
              suffix='/ 5.0'
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Avg Trip Duration'
              value={data.averageTripDuration || 25}
              prefix={<ClockCircleOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
              suffix='min'
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Total Drivers'
              value={data.totalDrivers || 0}
              prefix={<TeamOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Pending Verifications'
              value={data.pendingVerifications || 0}
              prefix={<CheckOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* System Health and Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title='System Health' style={{ height: '300px' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {Object.entries(data.systemHealth || {}).map(
                ([service, status]) => (
                  <div
                    key={service}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>
                      {service.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span
                      style={{
                        color: status === 'online' ? '#52c41a' : '#f5222d',
                        fontWeight: 'bold',
                      }}
                    >
                      {status === 'online' ? '✓ Online' : '✗ Offline'}
                    </span>
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Recent Notifications' style={{ height: '300px' }}>
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {notification.message}
                    </div>
                    <div style={{ color: '#666' }}>
                      {notification.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    padding: '20px',
                  }}
                >
                  No recent notifications
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
