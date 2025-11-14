import { Vehicle, Location, VehicleDetails, VehiclePart } from './Vehicle';

export interface HybridSystemDetails {
  iceDisplacement: number; 
  iceCylinders: number;
  electricMotorPower: number; 
  batteryCapacity: number; 
  hybridType: 'Parallel' | 'Series' | 'Series-Parallel';
  electricRange: number;
}

export class HybridVehicle extends Vehicle {
  private hybridSystemDetails: HybridSystemDetails;

  constructor(
    location: Location,
    details: VehicleDetails,
    hybridSystemDetails: HybridSystemDetails,
    uniqueParts: VehiclePart[] = [],
    id?: string
  ) {
    super(location, details, uniqueParts, id);
    
    if (uniqueParts.length === 0) {
      this.uniqueParts = [
        { name: 'ICE (Internal Combustion Engine)', condition: 'New' },
        { name: 'Electric Motor', condition: 'New' },
        { name: 'Battery Pack', condition: 'New' },
        { name: 'Power Control Unit', condition: 'New' },
        { name: 'Regenerative Braking System', condition: 'New' },
        { name: 'Spark Plugs', condition: 'New' },
        { name: 'Inverter', condition: 'New' }
      ];
    }
    
    this.hybridSystemDetails = hybridSystemDetails;
  }

  getVehicleType(): string {
    return 'Hybrid';
  }

  getEngineDetails(): Record<string, any> {
    return {
      iceDisplacement: this.hybridSystemDetails.iceDisplacement,
      iceCylinders: this.hybridSystemDetails.iceCylinders,
      electricMotorPower: this.hybridSystemDetails.electricMotorPower,
      batteryCapacity: this.hybridSystemDetails.batteryCapacity,
      hybridType: this.hybridSystemDetails.hybridType,
      electricRange: this.hybridSystemDetails.electricRange
    };
  }

  getHybridSystemDetails(): HybridSystemDetails {
    return { ...this.hybridSystemDetails };
  }

  getTotalPower(): number {
    const icePower = this.getDetails().bhp * 0.746; // Convert BHP to kW
    return icePower + this.hybridSystemDetails.electricMotorPower;
  }

  isPlugInHybrid(): boolean {
    return this.hybridSystemDetails.electricRange > 20;
  }

  calculateFuelEfficiencyBoost(): string {
    const boostMap = {
      'Parallel': '20-30%',
      'Series': '30-40%',
      'Series-Parallel': '40-50%'
    };
    return boostMap[this.hybridSystemDetails.hybridType];
  }
}