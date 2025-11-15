import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vehicleApi } from '../../services/api';
import { Vehicle } from '../../types/vehicle.types';

globalThis.fetch = vi.fn();

const mockVehicle: Vehicle = {
  _id: '123',
  type: 'Electric',
  location: {
    latitude: 19.8762,
    longitude: 75.3433,
  },
  details: {
    manufacturedDate: '2024-01-15',
    model: 'Tesla Model 3',
    fuelType: 'EV',
    bhp: 283,
    torque: 420,
  },
  engineDetails: {
    motorType: 'Permanent Magnet',
    voltage: 400,
    batteryCapacity: 75,
    range: 500,
  },
  uniqueParts: [],
};

describe('vehicleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis.fetch as any).mockClear();
  });

  describe('getAllVehicles', () => {
    it('should fetch all vehicles successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockVehicle],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const vehicles = await vehicleApi.getAllVehicles();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/vehicles');
      expect(vehicles).toEqual([mockVehicle]);
    });

    it('should throw error when fetch fails', async () => {
      const mockResponse = {
        success: false,
        error: 'Failed to fetch',
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await expect(vehicleApi.getAllVehicles()).rejects.toThrow(
        'Failed to fetch'
      );
    });
  });

  describe('getVehicleById', () => {
    it('should fetch vehicle by ID successfully', async () => {
      const mockResponse = {
        success: true,
        data: mockVehicle,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const vehicle = await vehicleApi.getVehicleById('123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/123'
      );
      expect(vehicle).toEqual(mockVehicle);
    });

    it('should throw error when vehicle not found', async () => {
      const mockResponse = {
        success: false,
        error: 'Vehicle not found',
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await expect(vehicleApi.getVehicleById('999')).rejects.toThrow(
        'Vehicle not found'
      );
    });
  });

  describe('getVehiclesByType', () => {
    it('should fetch vehicles by type successfully', async () => {
      const mockResponse = {
        success: true,
        data: [mockVehicle],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const vehicles = await vehicleApi.getVehiclesByType('Electric');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/type/Electric'
      );
      expect(vehicles).toEqual([mockVehicle]);
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle successfully', async () => {
      const newVehicle = { ...mockVehicle };
      delete newVehicle._id;

      const mockResponse = {
        success: true,
        data: mockVehicle,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const created = await vehicleApi.createVehicle(newVehicle);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });
      expect(created).toEqual(mockVehicle);
    });

    it('should throw error when creation fails', async () => {
      const newVehicle = { ...mockVehicle };
      delete newVehicle._id;

      const mockResponse = {
        success: false,
        error: 'Invalid data',
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await expect(vehicleApi.createVehicle(newVehicle)).rejects.toThrow(
        'Invalid data'
      );
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle successfully', async () => {
      const updatedVehicle = { ...mockVehicle };
      delete updatedVehicle._id;

      const mockResponse = {
        success: true,
        data: mockVehicle,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const updated = await vehicleApi.updateVehicle('123', updatedVehicle);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/123',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVehicle),
        }
      );
      expect(updated).toEqual(mockVehicle);
    });
  });

  describe('updateVehicleLocation', () => {
    it('should update vehicle location successfully', async () => {
      const mockResponse = {
        success: true,
        data: mockVehicle,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const updated = await vehicleApi.updateVehicleLocation('123', 20.5, 78.9);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/123/location',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: 20.5, longitude: 78.9 }),
        }
      );
      expect(updated).toEqual(mockVehicle);
    });

    it('should throw error for invalid coordinates', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid coordinates',
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await expect(
        vehicleApi.updateVehicleLocation('123', 100, 200)
      ).rejects.toThrow('Invalid coordinates');
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle successfully', async () => {
      const mockResponse = {
        success: true,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await vehicleApi.deleteVehicle('123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/123',
        {
          method: 'DELETE',
        }
      );
    });

    it('should throw error when deletion fails', async () => {
      const mockResponse = {
        success: false,
        error: 'Vehicle not found',
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await expect(vehicleApi.deleteVehicle('999')).rejects.toThrow(
        'Vehicle not found'
      );
    });
  });

  describe('getStatistics', () => {
    it('should fetch statistics successfully', async () => {
      const mockStats = {
        total: 10,
        byType: { Electric: 5, Petrol: 3 },
        averageBHP: 250,
        averageTorque: 380,
      };

      const mockResponse = {
        success: true,
        data: mockStats,
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const stats = await vehicleApi.getStatistics();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/vehicles/statistics'
      );
      expect(stats).toEqual(mockStats);
    });
  });
});
