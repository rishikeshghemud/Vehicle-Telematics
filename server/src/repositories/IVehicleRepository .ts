import { Vehicle } from '../models/Vehicle';

// Interface for dependency injection
export interface IVehicleRepository {
  // Create
  save(vehicle: Vehicle): Promise<Vehicle>;
  
  // Read
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  findByType(type: string): Promise<Vehicle[]>;
  
  // Update
  update(id: string, vehicle: Vehicle): Promise<Vehicle | null>;
  updateLocation(id: string, latitude: number, longitude: number): Promise<Vehicle | null>;
  
  // Delete
  delete(id: string): Promise<boolean>;
  
  // Utility
  count(): Promise<number>;
  exists(id: string): Promise<boolean>;
}