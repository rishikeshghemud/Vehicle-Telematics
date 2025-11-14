import { Collection, Db, ObjectId } from 'mongodb';
import { IVehicleRepository } from './IVehicleRepository ';
import { Vehicle } from '../models/Vehicle';
import { VehicleFactory } from '../utils/VehicleFactory';

// Mongo db specific class for injecting
export class VehicleRepository implements IVehicleRepository {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection('vehicles');
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    try {
      const vehicleData = vehicle.toJSON();
      delete vehicleData._id;
      
      const result = await this.collection.insertOne(vehicleData);
      
      const savedVehicle = VehicleFactory.createVehicle({
        ...vehicleData,
        _id: result.insertedId.toString()
      });
      
      return savedVehicle;
    } catch (error) {
      throw new Error(`Failed to save vehicle: ${error}`);
    }
  }

  async findById(id: string): Promise<Vehicle | null> {
    try {
      const vehicleData = await this.collection.findOne({ 
        _id: new ObjectId(id) 
      });
      
      if (!vehicleData) {
        return null;
      }

      return VehicleFactory.createVehicle({
        ...vehicleData,
        _id: vehicleData._id.toString()
      });
    } catch (error) {
      throw new Error(`Failed to find vehicle: ${error}`);
    }
  }

  async findAll(): Promise<Vehicle[]> {
    try {
      const vehiclesData = await this.collection.find({}).toArray();
      
      return vehiclesData.map(data => 
        VehicleFactory.createVehicle({
          ...data,
          _id: data._id.toString()
        })
      );
    } catch (error) {
      throw new Error(`Failed to fetch vehicles: ${error}`);
    }
  }

  async findByType(type: string): Promise<Vehicle[]> {
    try {
      const vehiclesData = await this.collection.find({ type }).toArray();
      
      return vehiclesData.map(data => 
        VehicleFactory.createVehicle({
          ...data,
          _id: data._id.toString()
        })
      );
    } catch (error) {
      throw new Error(`Failed to fetch vehicles by type: ${error}`);
    }
  }

  async update(id: string, vehicle: Vehicle): Promise<Vehicle | null> {
    try {
      const vehicleData = vehicle.toJSON();
      delete vehicleData._id; // Don't update the _id field
      
      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: vehicleData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return null;
      }

      return VehicleFactory.createVehicle({
        ...result,
        _id: result._id.toString()
      });
    } catch (error) {
      throw new Error(`Failed to update vehicle: ${error}`);
    }
  }

  async updateLocation(
    id: string, 
    latitude: number, 
    longitude: number
  ): Promise<Vehicle | null> {
    try {
      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            'location.latitude': latitude,
            'location.longitude': longitude
          } 
        },
        { returnDocument: 'after' }
      );

      if (!result) {
        return null;
      }

      return VehicleFactory.createVehicle({
        ...result,
        _id: result._id.toString()
      });
    } catch (error) {
      throw new Error(`Failed to update vehicle location: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ 
        _id: new ObjectId(id) 
      });
      
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete vehicle: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.collection.countDocuments();
    } catch (error) {
      throw new Error(`Failed to count vehicles: ${error}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.collection.countDocuments({ 
        _id: new ObjectId(id) 
      });
      
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check vehicle existence: ${error}`);
    }
  }
}