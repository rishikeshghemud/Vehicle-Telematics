import { IVehicleRepository } from '../repositories/IVehicleRepository ';
import { Vehicle } from '../models/Vehicle';
import { VehicleFactory } from '../utils/VehicleFactory';


export class VehicleService {
  constructor(private repository: IVehicleRepository) {}

  async createVehicle(vehicleData: any): Promise<Vehicle> {
    // Validate data
    if (!VehicleFactory.validateVehicleData(vehicleData)) {
      throw new Error('Invalid vehicle data');
    }

    // Create vehicle using factory
    const vehicle = VehicleFactory.createVehicle(vehicleData);

    // Persist to database
    return await this.repository.save(vehicle);
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.findById(id);
    
    if (!vehicle) {
      throw new Error(`Vehicle with id ${id} not found`);
    }

    return vehicle;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await this.repository.findAll();
  }

  async getVehiclesByType(type: string): Promise<Vehicle[]> {
    const validTypes = ['Electric', 'Petrol', 'Diesel', 'Hybrid'];
    
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid vehicle type: ${type}`);
    }

    return await this.repository.findByType(type);
  }

  async updateVehicle(id: string, vehicleData: any): Promise<Vehicle> {
    // Check if vehicle exists
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new Error(`Vehicle with id ${id} not found`);
    }

    // Validate data
    if (!VehicleFactory.validateVehicleData(vehicleData)) {
      throw new Error('Invalid vehicle data');
    }

    // Create updated vehicle
    const vehicle = VehicleFactory.createVehicle({
      ...vehicleData,
      _id: id
    });

    // Update in database
    const updatedVehicle = await this.repository.update(id, vehicle);
    
    if (!updatedVehicle) {
      throw new Error(`Failed to update vehicle with id ${id}`);
    }

    return updatedVehicle;
  }

  async updateVehicleLocation(
    id: string, 
    latitude: number, 
    longitude: number
  ): Promise<Vehicle> {
    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude: must be between -90 and 90');
    }
    
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude: must be between -180 and 180');
    }

    const updatedVehicle = await this.repository.updateLocation(
      id, 
      latitude, 
      longitude
    );

    if (!updatedVehicle) {
      throw new Error(`Vehicle with id ${id} not found`);
    }

    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new Error(`Vehicle with id ${id} not found`);
    }
  }

  async getVehicleCount(): Promise<number> {
    return await this.repository.count();
  }

  // Business logic: Get vehicles in a specific area (simple bounding box)
  async getVehiclesInArea(
    minLat: number, 
    maxLat: number, 
    minLng: number, 
    maxLng: number
  ): Promise<Vehicle[]> {
    const allVehicles = await this.repository.findAll();
    
    return allVehicles.filter(vehicle => {
      const location = vehicle.getLocation();
      return (
        location.latitude >= minLat &&
        location.latitude <= maxLat &&
        location.longitude >= minLng &&
        location.longitude <= maxLng
      );
    });
  }

  // Business logic: Get statistics
  async getStatistics(): Promise<any> {
    const allVehicles = await this.repository.findAll();
    
    const stats = {
      total: allVehicles.length,
      byType: {} as Record<string, number>,
      averageBHP: 0,
      averageTorque: 0
    };

    let totalBHP = 0;
    let totalTorque = 0;

    allVehicles.forEach(vehicle => {
      const type = vehicle.getVehicleType();
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      const details = vehicle.getDetails();
      totalBHP += details.bhp;
      totalTorque += details.torque;
    });

    if (allVehicles.length > 0) {
      stats.averageBHP = totalBHP / allVehicles.length;
      stats.averageTorque = totalTorque / allVehicles.length;
    }

    return stats;
  }
}