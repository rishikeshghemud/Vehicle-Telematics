import { VehicleService } from '../../services/VehicleService';
import { IVehicleRepository } from '../../repositories/IVehicleRepository ';
import { Vehicle } from '../../models/Vehicle';
import { ElectricVehicle } from '../../models/ElectricVehicle';

// Mock repository
class MockVehicleRepository implements IVehicleRepository {
  private vehicles: Map<string, Vehicle> = new Map();
  private idCounter = 1;

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const id = (this.idCounter++).toString();
    const vehicleData = vehicle.toJSON();
    const mockVehicle = new ElectricVehicle(
      vehicleData.location,
      vehicleData.details,
      vehicleData.engineDetails,
      vehicleData.uniqueParts,
      id
    );
    this.vehicles.set(id, mockVehicle);
    return mockVehicle;
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  async findAll(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async findByType(type: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (v) => v.getVehicleType() === type
    );
  }

  async update(id: string, vehicle: Vehicle): Promise<Vehicle | null> {
    if (!this.vehicles.has(id)) {
      return null;
    }
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number
  ): Promise<Vehicle | null> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      return null;
    }
    vehicle.setLocation({ latitude, longitude });
    return vehicle;
  }

  async delete(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  async count(): Promise<number> {
    return this.vehicles.size;
  }

  async exists(id: string): Promise<boolean> {
    return this.vehicles.has(id);
  }

  // Helper method for testing
  clear(): void {
    this.vehicles.clear();
    this.idCounter = 1;
  }
}

describe('VehicleService', () => {
  let service: VehicleService;
  let repository: MockVehicleRepository;

  const mockVehicleData = {
    type: 'Electric',
    location: {
      latitude: 19.8762,
      longitude: 75.3433,
    },
    details: {
      manufacturedDate: '2024-01-15',
      model: 'Tesla Model 3',
      fuelType: 'EV' as const,
      bhp: 283,
      torque: 420,
    },
    engineDetails: {
      motorType: 'Permanent Magnet' as const,
      voltage: 400,
      batteryCapacity: 75,
      range: 500,
    },
    uniqueParts: [],
  };

  beforeEach(() => {
    repository = new MockVehicleRepository();
    service = new VehicleService(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  describe('createVehicle', () => {
    it('should create a vehicle successfully', async () => {
      const vehicle = await service.createVehicle(mockVehicleData);

      expect(vehicle).toBeDefined();
      expect(vehicle.getVehicleType()).toBe('Electric');
      expect(vehicle.getId()).toBeDefined();
    });

    it('should throw error for invalid vehicle data', async () => {
      const invalidData = {
        type: 'InvalidType',
        location: mockVehicleData.location,
        details: mockVehicleData.details,
        engineDetails: {},
      };

      await expect(service.createVehicle(invalidData)).rejects.toThrow(
        'Invalid vehicle data'
      );
    });

    it('should throw error for missing required fields', async () => {
      const invalidData = {
        type: 'Electric',
        location: mockVehicleData.location,
      };

      await expect(service.createVehicle(invalidData as any)).rejects.toThrow();
    });
  });

  describe('getVehicleById', () => {
    it('should retrieve a vehicle by ID', async () => {
      const created = await service.createVehicle(mockVehicleData);
      const vehicle = await service.getVehicleById(created.getId()!);

      expect(vehicle).toBeDefined();
      expect(vehicle.getId()).toBe(created.getId());
    });

    it('should throw error for non-existent vehicle', async () => {
      await expect(service.getVehicleById('999')).rejects.toThrow(
        'Vehicle with id 999 not found'
      );
    });
  });

  describe('getAllVehicles', () => {
    it('should return empty array when no vehicles exist', async () => {
      const vehicles = await service.getAllVehicles();

      expect(vehicles).toEqual([]);
    });

    it('should return all vehicles', async () => {
      await service.createVehicle(mockVehicleData);
      await service.createVehicle({
        ...mockVehicleData,
        details: { ...mockVehicleData.details, model: 'Tesla Model Y' },
      });

      const vehicles = await service.getAllVehicles();

      expect(vehicles.length).toBe(2);
    });
  });

  describe('getVehiclesByType', () => {
    it('should return vehicles of specified type', async () => {
      await service.createVehicle(mockVehicleData);
      await service.createVehicle(mockVehicleData);

      const vehicles = await service.getVehiclesByType('Electric');

      expect(vehicles.length).toBe(2);
      vehicles.forEach((v) => {
        expect(v.getVehicleType()).toBe('Electric');
      });
    });

    it('should throw error for invalid vehicle type', async () => {
      await expect(service.getVehiclesByType('InvalidType')).rejects.toThrow(
        'Invalid vehicle type: InvalidType'
      );
    });

    it('should return empty array for type with no vehicles', async () => {
      await service.createVehicle(mockVehicleData);

      const vehicles = await service.getVehiclesByType('Petrol');

      expect(vehicles).toEqual([]);
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle successfully', async () => {
      const created = await service.createVehicle(mockVehicleData);
      const updatedData = {
        ...mockVehicleData,
        details: { ...mockVehicleData.details, model: 'Updated Model' },
      };

      const updated = await service.updateVehicle(created.getId()!, updatedData);

      expect(updated.getDetails().model).toBe('Updated Model');
    });

    it('should throw error for non-existent vehicle', async () => {
      await expect(
        service.updateVehicle('999', mockVehicleData)
      ).rejects.toThrow('Vehicle with id 999 not found');
    });

    it('should throw error for invalid update data', async () => {
      const created = await service.createVehicle(mockVehicleData);
      const invalidData = {
        type: 'InvalidType',
        location: mockVehicleData.location,
        details: mockVehicleData.details,
        engineDetails: {},
      };

      await expect(
        service.updateVehicle(created.getId()!, invalidData)
      ).rejects.toThrow('Invalid vehicle data');
    });
  });

  describe('updateVehicleLocation', () => {
    it('should update vehicle location successfully', async () => {
      const created = await service.createVehicle(mockVehicleData);
      const newLat = 20.5937;
      const newLng = 78.9629;

      const updated = await service.updateVehicleLocation(
        created.getId()!,
        newLat,
        newLng
      );

      const location = updated.getLocation();
      expect(location.latitude).toBe(newLat);
      expect(location.longitude).toBe(newLng);
    });

    it('should throw error for invalid latitude', async () => {
      const created = await service.createVehicle(mockVehicleData);

      await expect(
        service.updateVehicleLocation(created.getId()!, 100, 75)
      ).rejects.toThrow('Invalid latitude');
    });

    it('should throw error for invalid longitude', async () => {
      const created = await service.createVehicle(mockVehicleData);

      await expect(
        service.updateVehicleLocation(created.getId()!, 20, 200)
      ).rejects.toThrow('Invalid longitude');
    });

    it('should throw error for non-existent vehicle', async () => {
      await expect(
        service.updateVehicleLocation('999', 20, 75)
      ).rejects.toThrow('Vehicle with id 999 not found');
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle successfully', async () => {
      const created = await service.createVehicle(mockVehicleData);

      await service.deleteVehicle(created.getId()!);

      await expect(service.getVehicleById(created.getId()!)).rejects.toThrow();
    });

    it('should throw error for non-existent vehicle', async () => {
      await expect(service.deleteVehicle('999')).rejects.toThrow(
        'Vehicle with id 999 not found'
      );
    });
  });

  describe('getVehicleCount', () => {
    it('should return correct vehicle count', async () => {
      expect(await service.getVehicleCount()).toBe(0);

      await service.createVehicle(mockVehicleData);
      expect(await service.getVehicleCount()).toBe(1);

      await service.createVehicle(mockVehicleData);
      expect(await service.getVehicleCount()).toBe(2);
    });
  });

  describe('getVehiclesInArea', () => {
    it('should return vehicles within specified area', async () => {
      await service.createVehicle(mockVehicleData);
      await service.createVehicle({
        ...mockVehicleData,
        location: { latitude: 20.0, longitude: 76.0 },
      });
      await service.createVehicle({
        ...mockVehicleData,
        location: { latitude: 30.0, longitude: 80.0 }, // Outside area
      });

      const vehicles = await service.getVehiclesInArea(19, 21, 75, 77);

      expect(vehicles.length).toBe(2);
    });

    it('should return empty array when no vehicles in area', async () => {
      await service.createVehicle(mockVehicleData);

      const vehicles = await service.getVehiclesInArea(30, 35, 85, 90);

      expect(vehicles).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      await service.createVehicle(mockVehicleData);
      await service.createVehicle({
        ...mockVehicleData,
        details: { ...mockVehicleData.details, bhp: 300, torque: 450 },
      });

      const stats = await service.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.byType.Electric).toBe(2);
      expect(stats.averageBHP).toBe(291.5);
      expect(stats.averageTorque).toBe(435);
    });

    it('should handle empty vehicle list', async () => {
      const stats = await service.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.byType).toEqual({});
      expect(stats.averageBHP).toBe(0);
      expect(stats.averageTorque).toBe(0);
    });
  });
});