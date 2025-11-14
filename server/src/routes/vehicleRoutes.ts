import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';

export function createVehicleRoutes(controller: VehicleController): Router {
  const router = Router();

  // Create vehicle
  router.post('/', controller.createVehicle);

  // Get all vehicles
  router.get('/', controller.getAllVehicles);

  // Get statistics
  router.get('/statistics', controller.getStatistics);

  // Get vehicles in area
  router.get('/area', controller.getVehiclesInArea);

  // Get vehicles by type
  router.get('/type/:type', controller.getVehiclesByType);

  // Get vehicle by ID
  router.get('/:id', controller.getVehicleById);

  // Update vehicle
  router.put('/:id', controller.updateVehicle);

  // Update vehicle location
  router.patch('/:id/location', controller.updateVehicleLocation);

  // Delete vehicle
  router.delete('/:id', controller.deleteVehicle);

  return router;
}