import { Request, Response } from 'express';
import { VehicleService } from '../services/VehicleService';

export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  // Create new vehicle
  createVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.createVehicle(req.body);
      res.status(201).json({
        success: true,
        data: vehicle.toJSON()
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Get all vehicles
  getAllVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicles = await this.vehicleService.getAllVehicles();
      res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles.map(v => v.toJSON())
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Get vehicle by ID
  getVehicleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.getVehicleById(req.params.id);
      res.status(200).json({
        success: true,
        data: vehicle.toJSON()
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  // Get vehicles by type
  getVehiclesByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicles = await this.vehicleService.getVehiclesByType(
        req.params.type
      );
      res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles.map(v => v.toJSON())
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Update vehicle
  updateVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.updateVehicle(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: vehicle.toJSON()
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Update vehicle location
  updateVehicleLocation = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { latitude, longitude } = req.body;
      const vehicle = await this.vehicleService.updateVehicleLocation(
        req.params.id,
        latitude,
        longitude
      );
      res.status(200).json({
        success: true,
        data: vehicle.toJSON()
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Delete vehicle
  deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.vehicleService.deleteVehicle(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  // Get statistics
  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.vehicleService.getStatistics();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Get vehicles in area
  getVehiclesInArea = async (req: Request, res: Response): Promise<void> => {
    try {
      const { minLat, maxLat, minLng, maxLng } = req.query;
      
      const vehicles = await this.vehicleService.getVehiclesInArea(
        Number(minLat),
        Number(maxLat),
        Number(minLng),
        Number(maxLng)
      );
      
      res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles.map(v => v.toJSON())
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
}