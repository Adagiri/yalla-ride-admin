export interface Trip {
  id: string;
  tripNumber: string;
  customer: {
    firstname: string;
    lastname: string;
    email?: string;
    phone?: {
      fullPhone: string;
    };
  };
  driver: {
    firstname: string;
    lastname: string;
    email?: string;
    phone?: {
      fullPhone: string;
    };
  };
  status:
    | 'searching'
    | 'drivers_found'
    | 'driver_assigned'
    | 'driver_arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  pickup: {
    address: string;
  };
  destination: {
    address: string;
  };
  pricing?: {
    finalAmount: number;
  };
  // Note: finalAmount is accessed directly on selectedTrip, not on pricing
  finalAmount?: number;
  paymentMethod: 'cash' | 'card' | 'wallet';
  requestedAt: string;
  completedAt?: string;
  cancelledAt?: string;
}
