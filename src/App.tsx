import React from 'react';
import { Refine, AuthBindings } from '@refinedev/core';
import {
  ThemedLayoutV2,
  RefineThemes,
  notificationProvider,
  ErrorComponent,
} from '@refinedev/antd';
import { Client, fetchExchange } from '@urql/core';
import createDataProvider from '@refinedev/graphql';
import routerProvider from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import '@refinedev/antd/dist/reset.css';

// Import your dashboard components
import { DashboardPage } from './pages/dashboard';
import { TripList, TripShow, TripEdit } from './pages/trips';
import {
  DriverList,
  DriverShow,
  DriverEdit,
  DriverCreate,
} from './pages/drivers';
import { CustomerList, CustomerShow, CustomerEdit } from './pages/customers';
import { SubscriptionList, SubscriptionShow } from './pages/subscriptions';
import { PaymentList, PaymentShow } from './pages/payments';
import { VehicleList, VehicleShow, VehicleEdit } from './pages/vehicles';

// GraphQL client configuration using @urql/core
const API_URL = 'http://localhost:8000/graphql';

const gqlClient = new Client({
  url: API_URL,
  exchanges: [fetchExchange],
  fetchOptions: () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
});

// Create data provider
const customDataProvider = createDataProvider(gqlClient);

// Updated Authentication provider with proper types
const authProvider: AuthBindings = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const mutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            entity {
              id
              email
              accountType
              firstname
              lastname
              role
            }
          }
        }
      `;

      const response = await gqlClient
        .mutation(mutation, { email, password })
        .toPromise();

      if (response.error) {
        return {
          success: false,
          error: {
            message: 'Login failed',
            name: 'Invalid credentials',
          },
        };
      }

      const { token, entity } = response.data.login;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(entity));

        return {
          success: true,
          redirectTo: '/',
        };
      }

      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Invalid credentials',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Login failed',
          name: 'Authentication Error',
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: '/login',
      error: {
        message: 'Authentication required',
        name: 'Unauthorized',
      },
    };
  },

  onError: async (error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return {
      error,
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.accountType || parsedUser.role;
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            dataProvider={customDataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={notificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: 'riding-app-admin',
            }}
            resources={[
              {
                name: 'dashboard',
                list: '/',
                meta: {
                  label: 'Dashboard',
                  icon: <span>🏠</span>,
                },
              },
              {
                name: 'Trips', // Updated to match backend naming
                list: '/trips',
                show: '/trips/show/:id',
                edit: '/trips/edit/:id',
                meta: {
                  label: 'Trip Management',
                  icon: <span>🚗</span>,
                },
              },
              {
                name: 'Drivers', // Updated to match backend naming
                list: '/drivers',
                show: '/drivers/show/:id',
                edit: '/drivers/edit/:id',
                create: '/drivers/create',
                meta: {
                  label: 'Driver Management',
                  icon: <span>👤</span>,
                },
              },
              {
                name: 'Customers', // Updated to match backend naming
                list: '/customers',
                show: '/customers/show/:id',
                edit: '/customers/edit/:id',
                meta: {
                  label: 'Customer Management',
                  icon: <span>👥</span>,
                },
              },
              {
                name: 'Subscriptions', // Updated to match backend naming
                list: '/subscriptions',
                show: '/subscriptions/show/:id',
                meta: {
                  label: 'Subscriptions',
                  icon: <span>💳</span>,
                },
              },
              {
                name: 'Payments', // Updated to match backend naming
                list: '/payments',
                show: '/payments/show/:id',
                meta: {
                  label: 'Financial Management',
                  icon: <span>💰</span>,
                },
              },
              {
                name: 'Vehicles', // Updated to match backend naming
                list: '/vehicles',
                show: '/vehicles/show/:id',
                edit: '/vehicles/edit/:id',
                meta: {
                  label: 'Vehicle Management',
                  icon: <span>🚙</span>,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route index element={<DashboardPage />} />

                {/* Trip routes */}
                <Route path='/trips'>
                  <Route index element={<TripList />} />
                  <Route path='show/:id' element={<TripShow />} />
                  <Route path='edit/:id' element={<TripEdit />} />
                </Route>

                {/* Driver routes */}
                <Route path='/drivers'>
                  <Route index element={<DriverList />} />
                  <Route path='show/:id' element={<DriverShow />} />
                  <Route path='edit/:id' element={<DriverEdit />} />
                  <Route path='create' element={<DriverCreate />} />
                </Route>

                {/* Customer routes */}
                <Route path='/customers'>
                  <Route index element={<CustomerList />} />
                  <Route path='show/:id' element={<CustomerShow />} />
                  <Route path='edit/:id' element={<CustomerEdit />} />
                </Route>

                {/* Subscription routes */}
                <Route path='/subscriptions'>
                  <Route index element={<SubscriptionList />} />
                  <Route path='show/:id' element={<SubscriptionShow />} />
                </Route>

                {/* Payment routes */}
                <Route path='/payments'>
                  <Route index element={<PaymentList />} />
                  <Route path='show/:id' element={<PaymentShow />} />
                </Route>

                {/* Vehicle routes */}
                <Route path='/vehicles'>
                  <Route index element={<VehicleList />} />
                  <Route path='show/:id' element={<VehicleShow />} />
                  <Route path='edit/:id' element={<VehicleEdit />} />
                </Route>

                <Route path='*' element={<ErrorComponent />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
