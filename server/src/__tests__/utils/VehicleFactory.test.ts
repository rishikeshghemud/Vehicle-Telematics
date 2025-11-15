import { VehicleFactory } from '../../utils/VehicleFactory';
import { ElectricVehicle } from '../../models/ElectricVehicle';
import { PetrolVehicle } from '../../models/PetrolVehicle';
import { DieselVehicle } from '../../models/DieselVehicle';
import { HybridVehicle } from '../../models/HybridVehicle';

describe('VehicleFactory', () => {
  const baseVehicleData = {
    location: {
      latitude: 19.8762,
      longitude: 75.3433,
    },
    details: {
      manufacturedDate: '2024-01-15',
      model: 'Test Model',
      fuelType: 'EV',
      bhp: 283,
      torque: 420,
    },
    uniqueParts: [],
  };

  describe('createVehicle', () => {
    it('should create an Electric vehicle', () => {
      const data = {
        ...baseVehicleData,
        type: 'Electric',
        engineDetails: {
          motorType: 'Permanent Magnet',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);

      expect(vehicle).toBeInstanceOf(ElectricVehicle);
      expect(vehicle.getVehicleType()).toBe('Electric');
    });

    it('should create a Petrol vehicle', () => {
      const data = {
        ...baseVehicleData,
        type: 'Petrol',
        details: { ...baseVehicleData.details, fuelType: 'Petrol' },
        engineDetails: {
          displacement: 2000,
          cylinders: 4,
          configuration: 'Inline',
          fuelInjection: 'Direct',
          compressionRatio: 10.5,
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);

      expect(vehicle).toBeInstanceOf(PetrolVehicle);
      expect(vehicle.getVehicleType()).toBe('Petrol');
    });

    it('should create a Diesel vehicle', () => {
      const data = {
        ...baseVehicleData,
        type: 'Diesel',
        details: { ...baseVehicleData.details, fuelType: 'Diesel' },
        engineDetails: {
          displacement: 2500,
          cylinders: 4,
          configuration: 'Inline',
          turboCharged: true,
          compressionRatio: 16.5,
          fuelSystemType: 'Common Rail',
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);

      expect(vehicle).toBeInstanceOf(DieselVehicle);
      expect(vehicle.getVehicleType()).toBe('Diesel');
    });

    it('should create a Hybrid vehicle', () => {
      const data = {
        ...baseVehicleData,
        type: 'Hybrid',
        details: { ...baseVehicleData.details, fuelType: 'Hybrid' },
        engineDetails: {
          iceDisplacement: 1800,
          iceCylinders: 4,
          electricMotorPower: 80,
          batteryCapacity: 8.8,
          hybridType: 'Series-Parallel',
          electricRange: 50,
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);

      expect(vehicle).toBeInstanceOf(HybridVehicle);
      expect(vehicle.getVehicleType()).toBe('Hybrid');
    });

    it('should throw error for unknown vehicle type', () => {
      const data = {
        ...baseVehicleData,
        type: 'Unknown',
        engineDetails: {},
      };

      expect(() => {
        VehicleFactory.createVehicle(data);
      }).toThrow('Unknown vehicle type: Unknown');
    });

    it('should preserve vehicle ID if provided', () => {
      const data = {
        ...baseVehicleData,
        type: 'Electric',
        _id: '507f1f77bcf86cd799439011',
        engineDetails: {
          motorType: 'AC',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);

      expect(vehicle.getId()).toBe('507f1f77bcf86cd799439011');
    });

    it('should convert string date to Date object', () => {
      const data = {
        ...baseVehicleData,
        type: 'Electric',
        engineDetails: {
          motorType: 'AC',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        },
      };

      const vehicle = VehicleFactory.createVehicle(data);
      const details = vehicle.getDetails();

      expect(details.manufacturedDate).toBeInstanceOf(Date);
    });
  });

  describe('validateVehicleData', () => {
    it('should validate correct vehicle data', () => {
      const data = {
        ...baseVehicleData,
        type: 'Electric',
        engineDetails: {
          motorType: 'AC',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        },
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(true);
    });

    it('should return false for missing type', () => {
      const data = {
        ...baseVehicleData,
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for missing location', () => {
      const data = {
        type: 'Electric',
        details: baseVehicleData.details,
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for missing details', () => {
      const data = {
        type: 'Electric',
        location: baseVehicleData.location,
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for missing engineDetails', () => {
      const data = {
        type: 'Electric',
        location: baseVehicleData.location,
        details: baseVehicleData.details,
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for invalid vehicle type', () => {
      const data = {
        ...baseVehicleData,
        type: 'InvalidType',
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for invalid latitude type', () => {
      const data = {
        type: 'Electric',
        location: { latitude: '19.8762', longitude: 75.3433 },
        details: baseVehicleData.details,
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });

    it('should return false for invalid longitude type', () => {
      const data = {
        type: 'Electric',
        location: { latitude: 19.8762, longitude: '75.3433' },
        details: baseVehicleData.details,
        engineDetails: {},
      };

      expect(VehicleFactory.validateVehicleData(data)).toBe(false);
    });
  });
});