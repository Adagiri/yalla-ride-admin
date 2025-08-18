// graphql/operations.ts
import { gql } from '@urql/core';

// Trip Operations
export const GET_TRIPS = gql`
  query ListTrips(
    $pagination: PaginationInput
    $filter: TripsFilter
    $sort: TripsSort
  ) {
    listTrips(pagination: $pagination, filter: $filter, sort: $sort) {
      data {
        id
        tripNumber
        status
        customer {
          id
          firstname
          lastname
        }
        driver {
          id
          firstname
          lastname
        }
        pickup {
          address
        }
        destination {
          address
        }
        pricing {
          finalAmount
        }
        requestedAt
        completedAt
      }
      paginationResult {
        totalDocs
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_TRIP = gql`
  query GetTrip($id: ID!) {
    getTrip(id: $id) {
      id
      tripNumber
      status
      customer {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      driver {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      pickup {
        address
        latitude
        longitude
      }
      destination {
        address
        latitude
        longitude
      }
      pricing {
        finalAmount
        baseAmount
        distanceAmount
        timeAmount
        surgeAmount
      }
      requestedAt
      startedAt
      completedAt
    }
  }
`;

// Driver Operations
export const GET_DRIVERS = gql`
  query ListDrivers(
    $pagination: PaginationInput
    $filter: DriversFilter
    $sort: DriversSort
  ) {
    listDrivers(pagination: $pagination, filter: $filter, sort: $sort) {
      data {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
        isOnline
        isAvailable
        paymentModel
        stats {
          totalTrips
          averageRating
          totalEarnings
        }
        profilePhotoSet
        driverLicenseVerified
        vehicleInspectionDone
      }
      paginationResult {
        totalDocs
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_DRIVER = gql`
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      firstname
      lastname
      email
      phone {
        fullPhone
      }
      isOnline
      isAvailable
      paymentModel
      stats {
        totalTrips
        averageRating
        totalEarnings
      }
      profilePhotoSet
      profilePhoto
      driverLicenseVerified
      vehicleInspectionDone
      createdAt
      updatedAt
    }
  }
`;

// Customer Operations
export const GET_CUSTOMERS = gql`
  query ListCustomers(
    $pagination: PaginationInput
    $filter: CustomersFilter
    $sort: CustomersSort
  ) {
    listCustomers(pagination: $pagination, filter: $filter, sort: $sort) {
      data {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
        isEmailVerified
        isPhoneVerified
        createdAt
      }
      paginationResult {
        totalDocs
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// Authentication
export const LOGIN_MUTATION = gql`
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

// Enhanced Data Provider with custom operations
import dataProvider from '@refinedev/graphql';
import { Client } from '@urql/core';

export const createCustomDataProvider = (client: Client) => {
  return dataProvider(client, {
    getList: {
      // Custom operation for trips
      Trips: {
        query: GET_TRIPS,
        dataMapper: (response: any) => response.data?.listTrips?.data || [],
        getTotalCount: (response: any) =>
          response.data?.listTrips?.paginationResult?.totalDocs || 0,
      },
      // Custom operation for drivers
      Drivers: {
        query: GET_DRIVERS,
        dataMapper: (response: any) => response.data?.listDrivers?.data || [],
        getTotalCount: (response: any) =>
          response.data?.listDrivers?.paginationResult?.totalDocs || 0,
      },
      // Custom operation for customers
      Customers: {
        query: GET_CUSTOMERS,
        dataMapper: (response: any) => response.data?.listCustomers?.data || [],
        getTotalCount: (response: any) =>
          response.data?.listCustomers?.paginationResult?.totalDocs || 0,
      },
    },
    getOne: {
      Trips: {
        query: GET_TRIP,
        dataMapper: (response: any) => response.data?.getTrip,
      },
      Drivers: {
        query: GET_DRIVER,
        dataMapper: (response: any) => response.data?.getDriver,
      },
    },
  });
};
