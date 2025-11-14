import { Vehicle, Location, VehicleDetails, VehiclePart } from './Vehicle';


export interface ICEDetails {
  displacement: number;
  cylinders: number;
  configuration: 'Inline' | 'V-Type' | 'Flat';
  fuelInjection: 'Port' | 'Direct';
  compressionRatio: number;
}

export class PetrolVehicle extends Vehicle {
  private iceDetails: ICEDetails;

  constructor(
    location: Location,
    details: VehicleDetails,
    iceDetails: ICEDetails,
    uniqueParts: VehiclePart[] = [],
    id?: string
  ) {
    super(location, details, uniqueParts, id);
    
    if (uniqueParts.length === 0) {
      this.uniqueParts = [
        { name: 'ICE (Internal Combustion Engine)', condition: 'New' },
        { name: 'Spark Plugs', condition: 'New' },
        { name: 'Fuel Injectors', condition: 'New' },
        { name: 'Air Filter', condition: 'New' },
        { name: 'Catalytic Converter', condition: 'New' }
      ];
    }
    
    this.iceDetails = iceDetails;
  }

  getVehicleType(): string {
    return 'Petrol';
  }

  getEngineDetails(): Record<string, any> {
    return {
      displacement: this.iceDetails.displacement,
      cylinders: this.iceDetails.cylinders,
      configuration: this.iceDetails.configuration,
      fuelInjection: this.iceDetails.fuelInjection,
      compressionRatio: this.iceDetails.compressionRatio
    };
  }

  getICEDetails(): ICEDetails {
    return { ...this.iceDetails };
  }

  calculatePowerPerLiter(): number {
    return this.getDetails().bhp / (this.iceDetails.displacement / 1000);
  }

  needsSparkPlugReplacement(mileage: number): boolean {
    return mileage > 30000;
  }
}