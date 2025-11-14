// Abstract base class for all vehicles (OOP: Abstraction, Encapsulation)
export interface Location {
  latitude: number;
  longitude: number;
}

export interface VehicleDetails {
  manufacturedDate: Date;
  model: string;
  fuelType: 'EV' | 'Petrol' | 'Diesel' | 'Hybrid';
  bhp: number;
  torque: number;
}

export interface VehiclePart {
  name: string;
  manufacturer?: string;
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
}

export abstract class Vehicle {
  protected _id?: string;
  protected location: Location;
  protected details: VehicleDetails;
  protected uniqueParts: VehiclePart[];

  constructor(
    location: Location,
    details: VehicleDetails,
    uniqueParts: VehiclePart[] = [],
    id?: string
  ) {
    this._id = id;
    this.location = location;
    this.details = details;
    this.uniqueParts = uniqueParts;
  }

  getId(): string | undefined {
    return this._id;
  }

  getLocation(): Location {
    return { ...this.location };
  }

  getDetails(): VehicleDetails {
    return { ...this.details };
  }

  getUniqueParts(): VehiclePart[] {
    return [...this.uniqueParts];
  }

  setLocation(location: Location): void {
    if (location.latitude < -90 || location.latitude > 90) {
      throw new Error('Invalid latitude');
    }
    if (location.longitude < -180 || location.longitude > 180) {
      throw new Error('Invalid longitude');
    }
    this.location = location;
  }

  addPart(part: VehiclePart): void {
    this.uniqueParts.push(part);
  }

  abstract getVehicleType(): string;
  abstract getEngineDetails(): Record<string, any>;

  toJSON(): Record<string, any> {
    return {
      _id: this._id,
      type: this.getVehicleType(),
      location: this.location,
      details: this.details,
      uniqueParts: this.uniqueParts,
      engineDetails: this.getEngineDetails()
    };
  }
}