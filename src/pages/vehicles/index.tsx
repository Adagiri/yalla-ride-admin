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
  Descriptions,
  Tabs,
  Modal,
  message,
  Upload,
  Image,
  DatePicker,
} from 'antd';
import {
  CarOutlined,
  ToolOutlined,
  SafetyOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Vehicle List Component
export const VehicleList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: 'vehicles',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  const handleInspection = async (vehicleId: string, passed: boolean) => {
    try {
      // Call your vehicle inspection mutation
      message.success(
        `Vehicle inspection ${passed ? 'passed' : 'failed'} successfully`
      );
    } catch (error) {
      message.error('Failed to update inspection status');
    }
  };

  return (
    <List
      headerButtons={[
        <CreateButton key='create'>Add Vehicle</CreateButton>,
        <Button key='refresh' onClick={() => window.location.reload()}>
          Refresh
        </Button>,
      ]}
    >
      {/* Vehicle Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title='Total Vehicles'
              value={156}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Active Vehicles'
              value={134}
              prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Pending Inspection'
              value={8}
              prefix={<ToolOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Inspection Failed'
              value={14}
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
            `${range[0]}-${range[1]} of ${total} vehicles`,
        }}
      >
        {/* Vehicle Info Column */}
        <Table.Column
          title='Vehicle'
          render={(_, record: any) => (
            <div>
              <Text strong>
                {record.brand} {record.modelName}
              </Text>
              <br />
              <Text type='secondary' style={{ fontSize: '12px' }}>
                {record.manufactureYear} • {record.color}
              </Text>
              <br />
              <Text code style={{ fontSize: '11px' }}>
                {record.plateNumber}
              </Text>
            </div>
          )}
          width={180}
        />

        {/* Driver Column */}
        <Table.Column
          title='Driver'
          render={(_, record: any) => (
            <div>
              {record.driver ? (
                <>
                  <Text strong>
                    {record.driver.firstname} {record.driver.lastname}
                  </Text>
                  <br />
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {record.driver.phone?.fullPhone}
                  </Text>
                </>
              ) : (
                <Text type='secondary'>Not Assigned</Text>
              )}
            </div>
          )}
          width={150}
        />

        {/* Brand Column */}
        <Table.Column
          dataIndex='brand'
          title='Brand'
          render={(brand) => <Text>{brand}</Text>}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 150 }}
                mode='multiple'
                placeholder='Select Brand'
              >
                <Option value='Toyota'>Toyota</Option>
                <Option value='Honda'>Honda</Option>
                <Option value='Hyundai'>Hyundai</Option>
                <Option value='Kia'>Kia</Option>
                <Option value='Mercedes'>Mercedes</Option>
                <Option value='BMW'>BMW</Option>
              </Select>
            </FilterDropdown>
          )}
          width={100}
        />

        {/* Model & Year Column */}
        <Table.Column
          title='Model & Year'
          render={(_, record: any) => (
            <div>
              <Text>{record.modelName}</Text>
              <br />
              <Text type='secondary' style={{ fontSize: '12px' }}>
                {record.manufactureYear}
              </Text>
            </div>
          )}
          width={120}
        />

        {/* Identification Column */}
        <Table.Column
          title='Identification'
          render={(_, record: any) => (
            <div>
              <Text style={{ fontSize: '12px' }}>
                Plate: <Text code>{record.plateNumber}</Text>
              </Text>
              <br />
              <Text style={{ fontSize: '12px' }}>
                VIN:{' '}
                <Text code>
                  {record.identificationNumber?.substring(0, 8)}...
                </Text>
              </Text>
            </div>
          )}
          width={140}
        />

        {/* Inspection Status Column */}
        <Table.Column
          title='Inspection'
          render={(_, record: any) => (
            <Space direction='vertical' size='small'>
              <Tag
                color={
                  record.inspectionStatus === 'passed'
                    ? 'green'
                    : record.inspectionStatus === 'failed'
                    ? 'red'
                    : 'orange'
                }
              >
                {record.inspectionStatus?.toUpperCase() || 'PENDING'}
              </Tag>
              {record.inspectionDate && (
                <Text style={{ fontSize: '11px' }}>
                  {new Date(record.inspectionDate).toLocaleDateString()}
                </Text>
              )}
            </Space>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select style={{ minWidth: 150 }} placeholder='Select Status'>
                <Option value='passed'>Passed</Option>
                <Option value='failed'>Failed</Option>
                <Option value='pending'>Pending</Option>
              </Select>
            </FilterDropdown>
          )}
          width={120}
        />

        {/* Registration Date */}
        <Table.Column
          dataIndex='createdAt'
          title='Registered'
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
              <DeleteButton hideText size='small' recordItemId={record.id} />
              {record.inspectionStatus !== 'passed' && (
                <Button
                  size='small'
                  icon={<CheckOutlined />}
                  onClick={() => handleInspection(record.id, true)}
                >
                  Pass
                </Button>
              )}
            </Space>
          )}
          fixed='right'
          width={140}
        />
      </Table>
    </List>
  );
};

// Vehicle Show Component
export const VehicleShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: 'vehicles',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Vehicle Details' key='1'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Basic Information'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='Brand'>
                    <Text strong>{record?.brand}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Model'>
                    <Text strong>{record?.modelName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Year'>
                    {record?.manufactureYear}
                  </Descriptions.Item>
                  <Descriptions.Item label='Color'>
                    <Tag color='blue'>{record?.color}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Plate Number'>
                    <Text code style={{ fontSize: '16px' }}>
                      {record?.plateNumber}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='VIN'>
                    <Text code>{record?.identificationNumber}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Status & Assignment'>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label='Inspection Status'>
                    <Tag
                      color={
                        record?.inspectionStatus === 'passed'
                          ? 'green'
                          : record?.inspectionStatus === 'failed'
                          ? 'red'
                          : 'orange'
                      }
                    >
                      {record?.inspectionStatus?.toUpperCase() || 'PENDING'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Inspection Date'>
                    {record?.inspectionDate
                      ? new Date(record.inspectionDate).toLocaleDateString()
                      : 'Not inspected'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Assigned Driver'>
                    {record?.driver ? (
                      <div>
                        <Text strong>
                          {record.driver.firstname} {record.driver.lastname}
                        </Text>
                        <br />
                        <Text type='secondary'>
                          {record.driver.phone?.fullPhone}
                        </Text>
                      </div>
                    ) : (
                      <Text type='secondary'>Not Assigned</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='Registration Date'>
                    {new Date(record?.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Last Updated'>
                    {new Date(record?.updatedAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Documents & Photos' key='2'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Vehicle Documents'>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <div>
                    <Text strong>Registration Certificate:</Text>
                    <br />
                    {record?.registrationDocument ? (
                      <Image
                        width={200}
                        src={record.registrationDocument}
                        placeholder='Loading...'
                      />
                    ) : (
                      <Text type='secondary'>Not uploaded</Text>
                    )}
                  </div>
                  <div>
                    <Text strong>Insurance Certificate:</Text>
                    <br />
                    {record?.insuranceDocument ? (
                      <Image
                        width={200}
                        src={record.insuranceDocument}
                        placeholder='Loading...'
                      />
                    ) : (
                      <Text type='secondary'>Not uploaded</Text>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Vehicle Photos'>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <div>
                    <Text strong>Front View:</Text>
                    <br />
                    {record?.frontPhoto ? (
                      <Image
                        width={200}
                        src={record.frontPhoto}
                        placeholder='Loading...'
                      />
                    ) : (
                      <Text type='secondary'>Not uploaded</Text>
                    )}
                  </div>
                  <div>
                    <Text strong>Side View:</Text>
                    <br />
                    {record?.sidePhoto ? (
                      <Image
                        width={200}
                        src={record.sidePhoto}
                        placeholder='Loading...'
                      />
                    ) : (
                      <Text type='secondary'>Not uploaded</Text>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab='Inspection History' key='3'>
          <Card title='Inspection Records'>
            <Text type='secondary'>
              Inspection history and maintenance records will be displayed here
            </Text>
          </Card>
        </TabPane>
      </Tabs>
    </Show>
  );
};

// Vehicle Edit Component
export const VehicleEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: 'vehicles',
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Brand' name='brand' rules={[{ required: true }]}>
              <Select placeholder='Select brand'>
                <Option value='Toyota'>Toyota</Option>
                <Option value='Honda'>Honda</Option>
                <Option value='Hyundai'>Hyundai</Option>
                <Option value='Kia'>Kia</Option>
                <Option value='Mercedes'>Mercedes</Option>
                <Option value='BMW'>BMW</Option>
                <Option value='Lexus'>Lexus</Option>
                <Option value='Nissan'>Nissan</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Model Name'
              name='modelName'
              rules={[{ required: true }]}
            >
              <Input placeholder='e.g., Camry, Accord, Elantra' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Manufacture Year'
              name='manufactureYear'
              rules={[{ required: true }]}
            >
              <Select placeholder='Select year'>
                {Array.from({ length: 15 }, (_, i) => 2025 - i).map((year) => (
                  <Option key={year} value={year.toString()}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Color' name='color' rules={[{ required: true }]}>
              <Select placeholder='Select color'>
                <Option value='White'>White</Option>
                <Option value='Black'>Black</Option>
                <Option value='Silver'>Silver</Option>
                <Option value='Gray'>Gray</Option>
                <Option value='Blue'>Blue</Option>
                <Option value='Red'>Red</Option>
                <Option value='Green'>Green</Option>
                <Option value='Gold'>Gold</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Plate Number'
              name='plateNumber'
              rules={[{ required: true }]}
            >
              <Input
                placeholder='e.g., ABC-123-XY'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Vehicle Identification Number (VIN)'
          name='identificationNumber'
          rules={[{ required: true, min: 17, max: 17 }]}
        >
          <Input
            placeholder='17-character VIN'
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Inspection Status' name='inspectionStatus'>
              <Select placeholder='Select status'>
                <Option value='pending'>Pending</Option>
                <Option value='passed'>Passed</Option>
                <Option value='failed'>Failed</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Inspection Date' name='inspectionDate'>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Notes' name='notes'>
          <Input.TextArea
            rows={3}
            placeholder='Additional notes about the vehicle...'
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};

// Vehicle Create Component
export const VehicleCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: 'vehicles',
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout='vertical'>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Brand' name='brand' rules={[{ required: true }]}>
              <Select placeholder='Select brand'>
                <Option value='Toyota'>Toyota</Option>
                <Option value='Honda'>Honda</Option>
                <Option value='Hyundai'>Hyundai</Option>
                <Option value='Kia'>Kia</Option>
                <Option value='Mercedes'>Mercedes</Option>
                <Option value='BMW'>BMW</Option>
                <Option value='Lexus'>Lexus</Option>
                <Option value='Nissan'>Nissan</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Model Name'
              name='modelName'
              rules={[{ required: true }]}
            >
              <Input placeholder='e.g., Camry, Accord, Elantra' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='Manufacture Year'
              name='manufactureYear'
              rules={[{ required: true }]}
            >
              <Select placeholder='Select year'>
                {Array.from({ length: 15 }, (_, i) => 2025 - i).map((year) => (
                  <Option key={year} value={year.toString()}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Color' name='color' rules={[{ required: true }]}>
              <Select placeholder='Select color'>
                <Option value='White'>White</Option>
                <Option value='Black'>Black</Option>
                <Option value='Silver'>Silver</Option>
                <Option value='Gray'>Gray</Option>
                <Option value='Blue'>Blue</Option>
                <Option value='Red'>Red</Option>
                <Option value='Green'>Green</Option>
                <Option value='Gold'>Gold</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Plate Number'
              name='plateNumber'
              rules={[{ required: true }]}
            >
              <Input
                placeholder='e.g., ABC-123-XY'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Vehicle Identification Number (VIN)'
          name='identificationNumber'
          rules={[{ required: true, min: 17, max: 17 }]}
        >
          <Input
            placeholder='17-character VIN'
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item label='Notes' name='notes'>
          <Input.TextArea
            rows={3}
            placeholder='Additional notes about the vehicle...'
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
