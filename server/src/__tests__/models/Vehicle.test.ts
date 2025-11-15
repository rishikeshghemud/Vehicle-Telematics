import { ElectricVehicle } from '../../models/ElectricVehicle';
import { PetrolVehicle } from '../../models/PetrolVehicle';
import { DieselVehicle } from '../../models/DieselVehicle';
import { HybridVehicle } from '../../models/HybridVehicle';
import { Location, VehicleDetails } from '../../models/Vehicle';

describe('Vehicle Models', () => {
  const mockLocation: Location = {
    latitude: 19.8762,
    longitude: 75.3433,
  };

  const mockDetails: VehicleDetails = {
    manufacturedDate: new Date('2024-01-15'),
    model: 'Test Model',
    fuelType: 'EV',
    bhp: 283,
    torque: 420,
  };

  describe('ElectricVehicle', () => {
    const mockMotorDetails = {
      motorType: 'Permanent Magnet' as const,
      voltage: 400,
      batteryCapacity: 75,
      range: 500,
    };

    it('should create an electric vehicle instance', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      expect(ev).toBeInstanceOf(ElectricVehicle);
      expect(ev.getVehicleType()).toBe('Electric');
    });

    it('should return correct location', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      const location = ev.getLocation();
      expect(location.latitude).toBe(19.8762);
      expect(location.longitude).toBe(75.3433);
    });

    it('should update location with valid coordinates', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      const newLocation = { latitude: 20.5937, longitude: 78.9629 };
      ev.setLocation(newLocation);

      const location = ev.getLocation();
      expect(location.latitude).toBe(20.5937);
      expect(location.longitude).toBe(78.9629);
    });

    it('should throw error for invalid latitude', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      expect(() => {
        ev.setLocation({ latitude: 100, longitude: 75 });
      }).toThrow('Invalid latitude');
    });

    it('should throw error for invalid longitude', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      expect(() => {
        ev.setLocation({ latitude: 19, longitude: 200 });
      }).toThrow('Invalid longitude');
    });

    it('should return engine details', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      const engineDetails = ev.getEngineDetails();
      expect(engineDetails.motorType).toBe('Permanent Magnet');
      expect(engineDetails.voltage).toBe(400);
      expect(engineDetails.batteryCapacity).toBe(75);
      expect(engineDetails.range).toBe(500);
    });

    it('should update battery capacity', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      ev.updateBatteryCapacity(80);
      const motorDetails = ev.getMotorDetails();
      expect(motorDetails.batteryCapacity).toBe(80);
    });

    it('should throw error for invalid battery capacity', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      expect(() => {
        ev.updateBatteryCapacity(-10);
      }).toThrow('Battery capacity must be positive');
    });

    it('should have default EV parts', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      const parts = ev.getUniqueParts();
      expect(parts.length).toBeGreaterThan(0);
      expect(parts.some((p) => p.name === 'Electric Motor')).toBe(true);
      expect(parts.some((p) => p.name === 'Battery Pack')).toBe(true);
    });

    it('should convert to JSON correctly', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        mockMotorDetails
      );

      const json = ev.toJSON();
      expect(json.type).toBe('Electric');
      expect(json.location).toEqual(mockLocation);
      expect(json.engineDetails.voltage).toBe(400);
    });
  });

  describe('PetrolVehicle', () => {
    const mockICEDetails = {
      displacement: 2000,
      cylinders: 4,
      configuration: 'Inline' as const,
      fuelInjection: 'Direct' as const,
      compressionRatio: 10.5,
    };

    const petrolDetails: VehicleDetails = {
      ...mockDetails,
      fuelType: 'Petrol',
    };

    it('should create a petrol vehicle instance', () => {
      const pv = new PetrolVehicle(
        mockLocation,
        petrolDetails,
        mockICEDetails
      );

      expect(pv).toBeInstanceOf(PetrolVehicle);
      expect(pv.getVehicleType()).toBe('Petrol');
    });

    it('should return ICE details', () => {
      const pv = new PetrolVehicle(
        mockLocation,
        petrolDetails,
        mockICEDetails
      );

      const iceDetails = pv.getICEDetails();
      expect(iceDetails.displacement).toBe(2000);
      expect(iceDetails.cylinders).toBe(4);
      expect(iceDetails.configuration).toBe('Inline');
    });

    it('should calculate power per liter', () => {
      const pv = new PetrolVehicle(
        mockLocation,
        petrolDetails,
        mockICEDetails
      );

      const powerPerLiter = pv.calculatePowerPerLiter();
      expect(powerPerLiter).toBeCloseTo(141.5, 1);
    });

    it('should check if spark plugs need replacement', () => {
      const pv = new PetrolVehicle(
        mockLocation,
        petrolDetails,
        mockICEDetails
      );

      expect(pv.needsSparkPlugReplacement(25000)).toBe(false);
      expect(pv.needsSparkPlugReplacement(35000)).toBe(true);
    });

    it('should have default petrol parts', () => {
      const pv = new PetrolVehicle(
        mockLocation,
        petrolDetails,
        mockICEDetails
      );

      const parts = pv.getUniqueParts();
      expect(parts.some((p) => p.name === 'Spark Plugs')).toBe(true);
      expect(parts.some((p) => p.name === 'Fuel Injectors')).toBe(true);
    });
  });

  describe('DieselVehicle', () => {
    const mockDieselEngineDetails = {
      displacement: 2500,
      cylinders: 4,
      configuration: 'Inline' as const,
      turboCharged: true,
      compressionRatio: 16.5,
      fuelSystemType: 'Common Rail' as const,
    };

    const dieselDetails: VehicleDetails = {
      ...mockDetails,
      fuelType: 'Diesel',
    };

    it('should create a diesel vehicle instance', () => {
      const dv = new DieselVehicle(
        mockLocation,
        dieselDetails,
        mockDieselEngineDetails
      );

      expect(dv).toBeInstanceOf(DieselVehicle);
      expect(dv.getVehicleType()).toBe('Diesel');
    });

    it('should check if turbo charged', () => {
      const dv = new DieselVehicle(
        mockLocation,
        dieselDetails,
        mockDieselEngineDetails
      );

      expect(dv.isTurboCharged()).toBe(true);
    });

    it('should check if glow plugs need replacement', () => {
      const dv = new DieselVehicle(
        mockLocation,
        dieselDetails,
        mockDieselEngineDetails
      );

      expect(dv.needsGlowPlugReplacement(90000)).toBe(false);
      expect(dv.needsGlowPlugReplacement(110000)).toBe(true);
    });

    it('should calculate torque per liter', () => {
      const dv = new DieselVehicle(
        mockLocation,
        dieselDetails,
        mockDieselEngineDetails
      );

      const torquePerLiter = dv.calculateTorquePerLiter();
      expect(torquePerLiter).toBeCloseTo(168, 0);
    });

    it('should have default diesel parts including turbocharger', () => {
      const dv = new DieselVehicle(
        mockLocation,
        dieselDetails,
        mockDieselEngineDetails
      );

      const parts = dv.getUniqueParts();
      expect(parts.some((p) => p.name === 'Glow Plugs')).toBe(true);
      expect(parts.some((p) => p.name === 'Turbocharger')).toBe(true);
    });
  });

  describe('HybridVehicle', () => {
    const mockHybridSystemDetails = {
      iceDisplacement: 1800,
      iceCylinders: 4,
      electricMotorPower: 80,
      batteryCapacity: 8.8,
      hybridType: 'Series-Parallel' as const,
      electricRange: 50,
    };

    const hybridDetails: VehicleDetails = {
      ...mockDetails,
      fuelType: 'Hybrid',
    };

    it('should create a hybrid vehicle instance', () => {
      const hv = new HybridVehicle(
        mockLocation,
        hybridDetails,
        mockHybridSystemDetails
      );

      expect(hv).toBeInstanceOf(HybridVehicle);
      expect(hv.getVehicleType()).toBe('Hybrid');
    });

    it('should calculate total power', () => {
      const hv = new HybridVehicle(
        mockLocation,
        hybridDetails,
        mockHybridSystemDetails
      );

      const totalPower = hv.getTotalPower();
      expect(totalPower).toBeGreaterThan(80);
    });

    it('should identify plug-in hybrid', () => {
      const hv = new HybridVehicle(
        mockLocation,
        hybridDetails,
        mockHybridSystemDetails
      );

      expect(hv.isPlugInHybrid()).toBe(true);
    });

    it('should calculate fuel efficiency boost', () => {
      const hv = new HybridVehicle(
        mockLocation,
        hybridDetails,
        mockHybridSystemDetails
      );

      const boost = hv.calculateFuelEfficiencyBoost();
      expect(boost).toBe('40-50%');
    });

    it('should have default hybrid parts', () => {
      const hv = new HybridVehicle(
        mockLocation,
        hybridDetails,
        mockHybridSystemDetails
      );

      const parts = hv.getUniqueParts();
      expect(parts.some((p) => p.name === 'Electric Motor')).toBe(true);
      expect(parts.some((p) => p.name === 'ICE (Internal Combustion Engine)')).toBe(true);
      expect(parts.some((p) => p.name === 'Regenerative Braking System')).toBe(true);
    });
  });

  describe('Vehicle common functionality', () => {
    it('should add parts to vehicle', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        {
          motorType: 'AC',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        }
      );

      const initialPartsCount = ev.getUniqueParts().length;
      ev.addPart({ name: 'Custom Part', condition: 'New' });

      const parts = ev.getUniqueParts();
      expect(parts.length).toBe(initialPartsCount + 1);
      expect(parts.some((p) => p.name === 'Custom Part')).toBe(true);
    });

    it('should return vehicle details', () => {
      const ev = new ElectricVehicle(
        mockLocation,
        mockDetails,
        {
          motorType: 'AC',
          voltage: 400,
          batteryCapacity: 75,
          range: 500,
        }
      );

      const details = ev.getDetails();
      expect(details.model).toBe('Test Model');
      expect(details.bhp).toBe(283);
      expect(details.torque).toBe(420);
    });
  });
});