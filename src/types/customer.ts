interface CustomerInfo {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: {
    fullPhone: string;
  };
}

interface DriverInfo {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: {
    fullPhone: string;
  };
}

interface Location {
  address: string;
  coordinates?: [number, number];
}

interface DriverStats {
  totalTrips: number;
  averageRating: number;
  totalEarnings: number;
  completionRate?: number;
}

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
  };
  stats: DriverStats;
  // ... rest of fields
}
