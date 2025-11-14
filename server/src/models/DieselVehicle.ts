import { Vehicle, Location, VehicleDetails, VehiclePart } from './Vehicle';

export interface DieselEngineDetails {
  displacement: number;
  cylinders: number;
  configuration: 'Inline' | 'V-Type' | 'Flat';
  turboCharged: boolean;
  compressionRatio: number;
  fuelSystemType: 'Common Rail' | 'Direct Injection' | 'Indirect Injection';
}

export class DieselVehicle extends Vehicle {
  private dieselEngineDetails: DieselEngineDetails;

  constructor(
    location: Location,
    details: VehicleDetails,
    dieselEngineDetails: DieselEngineDetails,
    uniqueParts: VehiclePart[] = [],
    id?: string
  ) {
    super(location, details, uniqueParts, id);
    
    if (uniqueParts.length === 0) {
      this.uniqueParts = [
        { name: 'Diesel ICE', condition: 'New' },
        { name: 'Glow Plugs', condition: 'New' },
        { name: 'Fuel Injectors', condition: 'New' },
        { name: 'Turbocharger', condition: dieselEngineDetails.turboCharged ? 'New' : 'Poor' },
        { name: 'DPF (Diesel Particulate Filter)', condition: 'New' },
        { name: 'EGR Valve', condition: 'New' }
      ];
    }
    
    this.dieselEngineDetails = dieselEngineDetails;
  }


  getVehicleType(): string {
    return 'Diesel';
  }

  getEngineDetails(): Record<string, any> {
    return {
      displacement: this.dieselEngineDetails.displacement,
      cylinders: this.dieselEngineDetails.cylinders,
      configuration: this.dieselEngineDetails.configuration,
      turboCharged: this.dieselEngineDetails.turboCharged,
      compressionRatio: this.dieselEngineDetails.compressionRatio,
      fuelSystemType: this.dieselEngineDetails.fuelSystemType
    };
  }

  getDieselEngineDetails(): DieselEngineDetails {
    return { ...this.dieselEngineDetails };
  }

  isTurboCharged(): boolean {
    return this.dieselEngineDetails.turboCharged;
  }

  needsGlowPlugReplacement(mileage: number): boolean {
    return mileage > 100000;
  }

  calculateTorquePerLiter(): number {
    return this.getDetails().torque / (this.dieselEngineDetails.displacement / 1000);
  }
}