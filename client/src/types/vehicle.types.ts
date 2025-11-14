export interface Location {
  latitude: number;
  longitude: number;
}

export interface VehicleDetails {
  manufacturedDate: string;
  model: string;
  fuelType: 'EV' | 'Petrol' | 'Diesel' | 'Hybrid';
  bhp: number;
  torque: number;
}

export interface VehiclePart {
  name: string;
  manufacturer?: string;
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
}

export interface BaseVehicle {
  _id?: string;
  type: 'Electric' | 'Petrol' | 'Diesel' | 'Hybrid';
  location: Location;
  details: VehicleDetails;
  uniqueParts: VehiclePart[];
  engineDetails: any;
}

export interface ElectricVehicle extends BaseVehicle {
  type: 'Electric';
  engineDetails: {
    motorType: 'AC' | 'DC' | 'Permanent Magnet';
    voltage: number;
    batteryCapacity: number;
    range: number;
  };
}

export interface PetrolVehicle extends BaseVehicle {
  type: 'Petrol';
  engineDetails: {
    displacement: number;
    cylinders: number;
    configuration: 'Inline' | 'V-Type' | 'Flat';
    fuelInjection: 'Port' | 'Direct';
    compressionRatio: number;
  };
}

export interface DieselVehicle extends BaseVehicle {
  type: 'Diesel';
  engineDetails: {
    displacement: number;
    cylinders: number;
    configuration: 'Inline' | 'V-Type' | 'Flat';
    turboCharged: boolean;
    compressionRatio: number;
    fuelSystemType: 'Common Rail' | 'Direct Injection' | 'Indirect Injection';
  };
}

export interface HybridVehicle extends BaseVehicle {
  type: 'Hybrid';
  engineDetails: {
    iceDisplacement: number;
    iceCylinders: number;
    electricMotorPower: number;
    batteryCapacity: number;
    hybridType: 'Parallel' | 'Series' | 'Series-Parallel';
    electricRange: number;
  };
}

export type Vehicle = ElectricVehicle | PetrolVehicle | DieselVehicle | HybridVehicle;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}