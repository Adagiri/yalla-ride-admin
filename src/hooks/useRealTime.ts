import { useEffect, useState } from 'react';
import { useSubscription } from '@refinedev/core';

// Custom hook for real-time trip updates
export const useRealTimeTrips = () => {
  const [liveTrips, setLiveTrips] = useState<any[]>([]);

  // Subscribe to trip updates
  useSubscription({
    channel: 'trips',
    types: ['created', 'updated'],
    params: {
      ids: ['*'], // Subscribe to all trips
    },
    callback: (event) => {
      const { type, payload } = event;

      setLiveTrips((prevTrips) => {
        switch (type) {
          case 'created':
            return [payload, ...prevTrips];
          case 'updated':
            return prevTrips.map((trip) =>
              trip.id === payload.id ? { ...trip, ...payload } : trip
            );
          default:
            return prevTrips;
        }
      });
    },
  });

  return { liveTrips };
};

// Hook for real-time driver location updates
export const useDriverLocations = () => {
  const [driverLocations, setDriverLocations] = useState<Map<string, any>>(
    new Map()
  );

  useSubscription({
    channel: 'driver-locations',
    types: ['location-updated'],
    callback: (event) => {
      const { payload } = event;
      setDriverLocations((prev) => {
        const newMap = new Map(prev);
        newMap.set(payload.driverId, {
          coordinates: payload.coordinates,
          heading: payload.heading,
          speed: payload.speed,
          timestamp: payload.timestamp,
        });
        return newMap;
      });
    },
  });

  return { driverLocations };
};

// Hook for real-time dashboard metrics
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeTrips: 0,
    onlineDrivers: 0,
    totalRevenue: 0,
    completedTrips: 0,
  });

  useSubscription({
    channel: 'dashboard-metrics',
    types: ['metrics-updated'],
    callback: (event) => {
      setMetrics(event.payload);
    },
  });

  return { metrics };
};

// Live Provider Configuration for WebSocket
export const liveProvider = {
  subscribe: ({ channel, types, params, callback }: any) => {
    // WebSocket connection to your backend
    const ws = new WebSocket(`ws://localhost:8000/graphql`);

    ws.onopen = () => {
      // Send subscription message
      ws.send(
        JSON.stringify({
          type: 'connection_init',
        })
      );

      ws.send(
        JSON.stringify({
          type: 'start',
          payload: {
            query: `
            subscription ${channel}($params: JSON) {
              ${channel}(params: $params) {
                type
                payload
              }
            }
          `,
            variables: { params },
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'data' && data.payload?.data) {
        const subscriptionData = data.payload.data[channel];
        if (types.includes(subscriptionData.type)) {
          callback(subscriptionData);
        }
      }
    };

    return {
      unsubscribe: () => {
        ws.close();
      },
    };
  },

  unsubscribe: (subscription: any) => {
    subscription.unsubscribe();
  },
};

// GraphQL Subscription queries for your backend
export const SUBSCRIPTION_QUERIES = {
  TRIP_UPDATES: `
    subscription TripUpdates {
      tripUpdated {
        type
        payload {
          id
          tripNumber
          status
          customer {
            firstname
            lastname
          }
          driver {
            firstname
            lastname
          }
          pricing {
            finalAmount
          }
          requestedAt
        }
      }
    }
  `,

  DRIVER_LOCATION_UPDATES: `
    subscription DriverLocationUpdates {
      driverLocationUpdated {
        driverId
        coordinates
        heading
        speed
        timestamp
        isOnline
        isAvailable
      }
    }
  `,

  DASHBOARD_METRICS: `
    subscription DashboardMetrics {
      dashboardMetricsUpdated {
        activeTrips
        onlineDrivers
        totalRevenue
        completedTrips
        timestamp
      }
    }
  `,

  PAYMENT_UPDATES: `
    subscription PaymentUpdates {
      paymentUpdated {
        type
        payload {
          id
          amount
          status
          paymentMethod
          userId
          createdAt
        }
      }
    }
  `,
};

// Notification hook for real-time alerts
export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useSubscription({
    channel: 'admin-notifications',
    types: ['new-notification'],
    callback: (event) => {
      const notification = {
        id: Date.now(),
        message: event.payload.message,
        type: event.payload.type,
        timestamp: new Date(),
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep only last 50
    },
  });

  return { notifications };
};

// Custom hook for real-time system health
export const useSystemHealth = () => {
  const [health, setHealth] = useState({
    api: 'online',
    database: 'online',
    paymentGateway: 'online',
    locationServices: 'online',
    smsService: 'online',
  });

  useSubscription({
    channel: 'system-health',
    types: ['health-updated'],
    callback: (event) => {
      setHealth(event.payload);
    },
  });

  return { health };
};
