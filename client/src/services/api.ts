import { type Vehicle, type ApiResponse } from '../types/vehicle.types';

const API_BASE_URL = (import.meta.env.VITE_BASE_URL as string) || 'http://localhost:8000/api';

export const vehicleApi = {
  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/vehicles`);
    const data: ApiResponse<Vehicle[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch vehicles');
    }
    
    return data.data || [];
  },

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    const data: ApiResponse<Vehicle> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch vehicle');
    }
    
    return data.data!;
  },

  // Get vehicles by type
  async getVehiclesByType(type: string): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE_URL}/vehicles/type/${type}`);
    const data: ApiResponse<Vehicle[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch vehicles');
    }
    
    return data.data || [];
  },

  // Create vehicle
  async createVehicle(vehicle: Omit<Vehicle, '_id'>): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });
    
    const data: ApiResponse<Vehicle> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create vehicle');
    }
    
    return data.data!;
  },

  // Update vehicle
  async updateVehicle(id: string, vehicle: Omit<Vehicle, '_id'>): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });
    
    const data: ApiResponse<Vehicle> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update vehicle');
    }
    
    return data.data!;
  },

  // Update vehicle location
  async updateVehicleLocation(
    id: string, 
    latitude: number, 
    longitude: number
  ): Promise<Vehicle> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}/location`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    
    const data: ApiResponse<Vehicle> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update location');
    }
    
    return data.data!;
  },

  // Delete vehicle
  async deleteVehicle(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    });
    
    const data: ApiResponse<null> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete vehicle');
    }
  },

  // Get statistics
  async getStatistics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vehicles/statistics`);
    const data: ApiResponse<any> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch statistics');
    }
    
    return data.data;
  },
};