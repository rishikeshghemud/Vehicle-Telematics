import { Vehicle, Location, VehicleDetails, VehiclePart } from './Vehicle';

export interface MotorDetails {
  motorType: 'AC' | 'DC' | 'Permanent Magnet';
  voltage: number;
  batteryCapacity: number; 
  range: number; 
}

export class ElectricVehicle extends Vehicle {
  private motorDetails: MotorDetails;

  constructor(
    location: Location,
    details: VehicleDetails,
    motorDetails: MotorDetails,
    uniqueParts: VehiclePart[] = [],
    id?: string
  ) {
    super(location, details, uniqueParts, id);
    
    if (uniqueParts.length === 0) {
      this.uniqueParts = [
        { name: 'Electric Motor', condition: 'New' },
        { name: 'Battery Pack', condition: 'New' },
        { name: 'Inverter', condition: 'New' },
        { name: 'Charging Port', condition: 'New' }
      ];
    }
    
    this.motorDetails = motorDetails;
  }

  getVehicleType(): string {
    return 'Electric';
  }

  getEngineDetails(): Record<string, any> {
    return {
      motorType: this.motorDetails.motorType,
      voltage: this.motorDetails.voltage,
      batteryCapacity: this.motorDetails.batteryCapacity,
      range: this.motorDetails.range
    };
  }

  // EV-specific methods
  getMotorDetails(): MotorDetails {
    return { ...this.motorDetails };
  }

  updateBatteryCapacity(capacity: number): void {
    if (capacity <= 0) {
      throw new Error('Battery capacity must be positive');
    }
    this.motorDetails.batteryCapacity = capacity;
  }

  calculateRangePercentage(): number {
    return (this.motorDetails.range / this.motorDetails.batteryCapacity) * 100;
  }
}