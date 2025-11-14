import { Vehicle } from '../models/Vehicle';
import { ElectricVehicle } from '../models/ElectricVehicle';
import { PetrolVehicle } from '../models/PetrolVehicle';
import { DieselVehicle } from '../models/DieselVehicle';
import { HybridVehicle } from '../models/HybridVehicle';

export class VehicleFactory {
  static createVehicle(data: any): Vehicle {
    const { type, location, details, engineDetails, uniqueParts, _id } = data;

    // Convert string date to Date object
    const vehicleDetails = {
      ...details,
      manufacturedDate: new Date(details.manufacturedDate)
    };

    switch (type) {
      case 'Electric':
        return new ElectricVehicle(
          location,
          vehicleDetails,
          engineDetails,
          uniqueParts,
          _id
        );

      case 'Petrol':
        return new PetrolVehicle(
          location,
          vehicleDetails,
          engineDetails,
          uniqueParts,
          _id
        );

      case 'Diesel':
        return new DieselVehicle(
          location,
          vehicleDetails,
          engineDetails,
          uniqueParts,
          _id
        );

      case 'Hybrid':
        return new HybridVehicle(
          location,
          vehicleDetails,
          engineDetails,
          uniqueParts,
          _id
        );

      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }

  // Validate vehicle data before creation
  static validateVehicleData(data: any): boolean {
    if (!data.type || !data.location || !data.details || !data.engineDetails) {
      return false;
    }

    if (!['Electric', 'Petrol', 'Diesel', 'Hybrid'].includes(data.type)) {
      return false;
    }

    if (typeof data.location.latitude !== 'number' || 
        typeof data.location.longitude !== 'number') {
      return false;
    }

    return true;
  }
}