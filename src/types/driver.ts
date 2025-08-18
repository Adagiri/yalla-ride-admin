export interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
  };
  isOnline: boolean;
  isAvailable: boolean;
  paymentModel: 'SUBSCRIPTION' | 'COMMISSION';
  stats: {
    totalTrips: number;
    averageRating: number;
    totalEarnings: number;
    completionRate?: number;
  };
  profilePhotoSet: boolean;
  personalInfoSet: boolean;
  driverLicenseVerified: boolean;
  vehicleInspectionDone: boolean;
  profilePhoto?: string;
  createdAt: string;
  updatedAt?: string;
}
