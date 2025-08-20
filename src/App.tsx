import { Refine, Authenticated, AuthBindings } from '@refinedev/core';
import {
  ThemedLayoutV2,
  RefineThemes,
  useNotificationProvider,
  ErrorComponent,
} from '@refinedev/antd';
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import '@refinedev/antd/dist/reset.css';

import { Client, fetchExchange } from '@urql/core';
import createDataProvider from '@refinedev/graphql';

// Import Ant Design Icons for resources
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CarFilled,
  CreditCardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

// Import pages
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

// Import auth components
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminForgotPassword } from './pages/auth/AdminForgotPassword';
import { AdminResetPassword } from './pages/auth/AdminResetPassword';

// GraphQL client configuration
export const API_URL = 'http://localhost:8000/graphql';

// const gqlClient = new Client({
//   url: API_URL,
//   exchanges: [fetchExchange],
//   fetchOptions: () => {
//     const token = localStorage.getItem('token');
//     return {
//       headers: {
//         Authorization: token ? `Bearer ${token}` : '',
//         'Content-Type': 'application/json',
//       },
//     };
//   },
// });

export const client = new Client({
  url: API_URL,
  exchanges: [fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        /**
         * For demo purposes, we're using `localStorage` to access the token.
         * You can use your own authentication logic here.
         * In real world applications, you'll need to handle it in sync with your `authProvider`.
         */
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
  },
});

const dataProvider = createDataProvider(client);


// Create data provider

// Authentication provider
const authProvider: AuthBindings = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const mutation = `
        mutation AdminLogin($input: AdminLoginInput!) {
          adminLogin(input: $input) {
            token
            admin {
              id
              firstname
              lastname
              email
              role
              department
              permissions
            }
            expiresAt
          }
        }
      `;

      const result = await client
        .mutation(mutation, {
          input: { email, password },
        })
        .toPromise();

      if (result.error || !result.data?.adminLogin) {
        return {
          success: false,
          error: {
            name: 'Login Error',
            message:
              result.error?.graphQLErrors?.[0]?.message ||
              'Invalid credentials',
          },
        };
      }

      const { token, admin, expiresAt } = result.data.adminLogin;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('expiresAt', expiresAt);

      return {
        success: true,
        redirectTo: '/dashboard',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: error.message || 'An error occurred during login',
        },
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const mutation = `
          mutation AdminLogout {
            adminLogout {
              success
              message
            }
          }
        `;
        await client.mutation(mutation).toPromise();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('expiresAt');

    return {
      success: true,
      redirectTo: '/auth/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token) {
      return {
        authenticated: false,
        redirectTo: '/auth/login',
        logout: true,
      };
    }

    // Check if token is expired
    if (expiresAt) {
      const now = new Date();
      const expiry = new Date(expiresAt);

      if (now >= expiry) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        localStorage.removeItem('expiresAt');

        return {
          authenticated: false,
          error: {
            message: 'Session expired',
            name: 'Session Error',
          },
          logout: true,
          redirectTo: '/auth/login',
        };
      }
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    try {
      const adminData = JSON.parse(admin);
      return {
        role: adminData.role,
        permissions: adminData.permissions || [],
        department: adminData.department,
      };
    } catch (error) {
      return null;
    }
  },

  getIdentity: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    try {
      const adminData = JSON.parse(admin);
      return {
        id: adminData.id,
        name: `${adminData.firstname} ${adminData.lastname}`,
        avatar: adminData.profilePhoto || undefined,
        email: adminData.email,
        role: adminData.role,
        department: adminData.department,
      };
    } catch (error) {
      return null;
    }
  },

  onError: async (error: any) => {
    if (error?.networkError?.statusCode === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');

      return {
        logout: true,
        redirectTo: '/auth/login',
        error: {
          message: 'Session expired. Please login again.',
          name: 'Authentication Error',
        },
      };
    }

    return { error };
  },
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          {/* Wrap with urql Provider */}
          <Provider value={gqlClient}>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'admin-dashboard',
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/dashboard',
                  meta: {
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: 'drivers',
                  list: '/drivers',
                  show: '/drivers/show/:id',
                  edit: '/drivers/edit/:id',
                  create: '/drivers/create',
                  meta: {
                    label: 'Drivers',
                    icon: <CarOutlined />,
                  },
                },
                {
                  name: 'customers',
                  list: '/customers',
                  show: '/customers/show/:id',
                  edit: '/customers/edit/:id',
                  meta: {
                    label: 'Customers',
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: 'trips',
                  list: '/trips',
                  show: '/trips/show/:id',
                  edit: '/trips/edit/:id',
                  meta: {
                    label: 'Trips',
                    icon: <EnvironmentOutlined />,
                  },
                },
                {
                  name: 'vehicles',
                  list: '/vehicles',
                  show: '/vehicles/show/:id',
                  edit: '/vehicles/edit/:id',
                  meta: {
                    label: 'Vehicles',
                    icon: <CarFilled />,
                  },
                },
                {
                  name: 'payments',
                  list: '/payments',
                  show: '/payments/show/:id',
                  meta: {
                    label: 'Payments',
                    icon: <CreditCardOutlined />,
                  },
                },
                {
                  name: 'subscriptions',
                  list: '/subscriptions',
                  show: '/subscriptions/show/:id',
                  meta: {
                    label: 'Subscriptions',
                    icon: <FileTextOutlined />,
                  },
                },
              ]}
            >
              <Routes>
                {/* Public authentication routes */}
                <Route
                  element={
                    <Authenticated key='auth-routes' fallback={<Outlet />}>
                      <NavigateToResource resource='dashboard' />
                    </Authenticated>
                  }
                >
                  <Route path='/auth'>
                    <Route path='login' element={<AdminLogin />} />
                    <Route
                      path='forgot-password'
                      element={<AdminForgotPassword />}
                    />
                    <Route
                      path='reset-password'
                      element={<AdminResetPassword />}
                    />
                  </Route>
                </Route>

                {/* Protected admin routes */}
                <Route
                  element={
                    <Authenticated
                      key='authenticated-routes'
                      redirectOnFail='/auth/login'
                    >
                      <ThemedLayoutV2>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  {/* Dashboard */}
                  <Route path='/dashboard' element={<DashboardPage />} />

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

                  {/* Trip routes */}
                  <Route path='/trips'>
                    <Route index element={<TripList />} />
                    <Route path='show/:id' element={<TripShow />} />
                    <Route path='edit/:id' element={<TripEdit />} />
                  </Route>

                  {/* Vehicle routes */}
                  <Route path='/vehicles'>
                    <Route index element={<VehicleList />} />
                    <Route path='show/:id' element={<VehicleShow />} />
                    <Route path='edit/:id' element={<VehicleEdit />} />
                  </Route>

                  {/* Payment routes */}
                  <Route path='/payments'>
                    <Route index element={<PaymentList />} />
                    <Route path='show/:id' element={<PaymentShow />} />
                  </Route>

                  {/* Subscription routes */}
                  <Route path='/subscriptions'>
                    <Route index element={<SubscriptionList />} />
                    <Route path='show/:id' element={<SubscriptionShow />} />
                  </Route>

                  {/* Catch all routes */}
                  <Route path='*' element={<ErrorComponent />} />
                </Route>

                {/* Root redirect */}
                <Route
                  path='/'
                  element={
                    <Authenticated
                      key='root-route'
                      fallback={<CatchAllNavigate to='/auth/login' />}
                    >
                      <NavigateToResource resource='dashboard' />
                    </Authenticated>
                  }
                />
              </Routes>

              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </Provider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
