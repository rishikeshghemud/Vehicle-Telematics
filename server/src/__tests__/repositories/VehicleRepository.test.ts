import { VehicleRepository } from '../../repositories/VehicleRepository';
import { ElectricVehicle } from '../../models/ElectricVehicle';
import { Db, Collection, ObjectId } from 'mongodb';
import * as mongodb from 'mongodb';

// Mock MongoDB ObjectId
jest.mock('mongodb', () => {
  const actual = jest.requireActual('mongodb');
  return {
    ...actual,
    ObjectId: jest.fn((id: string) => {
      // For testing, accept any string as valid ID
      if (id === 'nonexistent' || !id.match(/^[0-9a-f]{24}$/i)) {
        return { toString: () => id };
      }
      return new actual.ObjectId(id);
    }),
  };
});

// Mock MongoDB
const mockCollection = {
  insertOne: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn(),
  createIndex: jest.fn(),
};

const mockDb = {
  collection: jest.fn(() => mockCollection),
} as unknown as Db;

describe('VehicleRepository', () => {
  let repository: VehicleRepository;

  const mockVehicle = new ElectricVehicle(
    { latitude: 19.8762, longitude: 75.3433 },
    {
      manufacturedDate: new Date('2024-01-15'),
      model: 'Tesla Model 3',
      fuelType: 'EV',
      bhp: 283,
      torque: 420,
    },
    {
      motorType: 'Permanent Magnet',
      voltage: 400,
      batteryCapacity: 75,
      range: 500,
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new VehicleRepository(mockDb);
  });

  describe('save', () => {
    it('should save a vehicle and return it with ID', async () => {
      const mockId = { toString: () => '507f1f77bcf86cd799439011' };
      (mockCollection.insertOne as jest.Mock).mockResolvedValue({
        insertedId: mockId,
      });

      const saved = await repository.save(mockVehicle);

      expect(mockCollection.insertOne).toHaveBeenCalled();
      expect(saved.getId()).toBe('507f1f77bcf86cd799439011');
    });

    it('should throw error if save fails', async () => {
      (mockCollection.insertOne as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(repository.save(mockVehicle)).rejects.toThrow(
        'Failed to save vehicle'
      );
    });
  });

  describe('findById', () => {
    it('should find vehicle by ID', async () => {
      const vehicleData = {
        ...mockVehicle.toJSON(),
        _id: { toString: () => '507f1f77bcf86cd799439011' },
      };

      (mockCollection.findOne as jest.Mock).mockResolvedValue(vehicleData);

      const found = await repository.findById('507f1f77bcf86cd799439011');

      expect(found).not.toBeNull();
      expect(found?.getVehicleType()).toBe('Electric');
    });

    it('should return null if vehicle not found', async () => {
      (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

      const found = await repository.findById('nonexistent');

      expect(found).toBeNull();
    });

    it('should throw error if find fails', async () => {
      (mockCollection.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(repository.findById('123')).rejects.toThrow(
        'Failed to find vehicle'
      );
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      const vehicleData = {
        ...mockVehicle.toJSON(),
        _id: { toString: () => '507f1f77bcf86cd799439011' },
      };

      (mockCollection.find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockResolvedValue([vehicleData, vehicleData]),
      });

      const vehicles = await repository.findAll();

      expect(vehicles.length).toBe(2);
      expect(vehicles[0].getVehicleType()).toBe('Electric');
    });

    it('should return empty array if no vehicles', async () => {
      (mockCollection.find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      const vehicles = await repository.findAll();

      expect(vehicles).toEqual([]);
    });

    it('should throw error if find fails', async () => {
      (mockCollection.find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(repository.findAll()).rejects.toThrow(
        'Failed to fetch vehicles'
      );
    });
  });

  describe('findByType', () => {
    it('should find vehicles by type', async () => {
      const vehicleData = {
        ...mockVehicle.toJSON(),
        _id: { toString: () => '507f1f77bcf86cd799439011' },
      };

      (mockCollection.find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockResolvedValue([vehicleData]),
      });

      const vehicles = await repository.findByType('Electric');

      expect(mockCollection.find).toHaveBeenCalledWith({ type: 'Electric' });
      expect(vehicles.length).toBe(1);
      expect(vehicles[0].getVehicleType()).toBe('Electric');
    });

    it('should throw error if find fails', async () => {
      (mockCollection.find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(repository.findByType('Electric')).rejects.toThrow(
        'Failed to fetch vehicles by type'
      );
    });
  });

  describe('update', () => {
    it('should update vehicle successfully', async () => {
      const vehicleData = {
        ...mockVehicle.toJSON(),
        _id: { toString: () => '507f1f77bcf86cd799439011' },
      };

      (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(
        vehicleData
      );

      const updated = await repository.update('507f1f77bcf86cd799439011', mockVehicle);

      expect(updated).not.toBeNull();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should return null if vehicle not found', async () => {
      (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const updated = await repository.update('nonexistent', mockVehicle);

      expect(updated).toBeNull();
    });

    it('should throw error if update fails', async () => {
      (mockCollection.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        repository.update('123', mockVehicle)
      ).rejects.toThrow('Failed to update vehicle');
    });
  });

  describe('updateLocation', () => {
    it('should update vehicle location', async () => {
      const vehicleData = {
        ...mockVehicle.toJSON(),
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        location: { latitude: 20.5937, longitude: 78.9629 },
      };

      (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(
        vehicleData
      );

      const updated = await repository.updateLocation(
        '507f1f77bcf86cd799439011',
        20.5937,
        78.9629
      );

      expect(updated).not.toBeNull();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        expect.anything(),
        {
          $set: {
            'location.latitude': 20.5937,
            'location.longitude': 78.9629,
          },
        },
        expect.anything()
      );
    });

    it('should throw error if update fails', async () => {
      (mockCollection.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        repository.updateLocation('123', 20, 75)
      ).rejects.toThrow('Failed to update vehicle location');
    });
  });

  describe('delete', () => {
    it('should delete vehicle successfully', async () => {
      (mockCollection.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const deleted = await repository.delete('507f1f77bcf86cd799439011');

      expect(deleted).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalled();
    });

    it('should return false if vehicle not found', async () => {
      (mockCollection.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      const deleted = await repository.delete('nonexistent');

      expect(deleted).toBe(false);
    });

    it('should throw error if delete fails', async () => {
      (mockCollection.deleteOne as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(repository.delete('123')).rejects.toThrow(
        'Failed to delete vehicle'
      );
    });
  });

  describe('count', () => {
    it('should return vehicle count', async () => {
      (mockCollection.countDocuments as jest.Mock).mockResolvedValue(5);

      const count = await repository.count();

      expect(count).toBe(5);
    });

    it('should throw error if count fails', async () => {
      (mockCollection.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(repository.count()).rejects.toThrow(
        'Failed to count vehicles'
      );
    });
  });

  describe('exists', () => {
    it('should return true if vehicle exists', async () => {
      (mockCollection.countDocuments as jest.Mock).mockResolvedValue(1);

      const exists = await repository.exists('507f1f77bcf86cd799439011');

      expect(exists).toBe(true);
    });

    it('should return false if vehicle does not exist', async () => {
      (mockCollection.countDocuments as jest.Mock).mockResolvedValue(0);

      const exists = await repository.exists('nonexistent');

      expect(exists).toBe(false);
    });

    it('should throw error if check fails', async () => {
      (mockCollection.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(repository.exists('123')).rejects.toThrow(
        'Failed to check vehicle existence'
      );
    });
  });
});