import { Request, Response } from 'express';
import { VehicleController } from '../../controllers/VehicleController';
import { ElectricVehicle } from '../../models/ElectricVehicle';

// Mock VehicleService
class MockVehicleService {
  createVehicle = jest.fn();
  getAllVehicles = jest.fn();
  getVehicleById = jest.fn();
  getVehiclesByType = jest.fn();
  updateVehicle = jest.fn();
  updateVehicleLocation = jest.fn();
  deleteVehicle = jest.fn();
  getStatistics = jest.fn();
  getVehiclesInArea = jest.fn();
}

// Mock Express Request and Response
const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  req.query = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: MockVehicleService;

  const mockVehicle = new ElectricVehicle(
    { latitude: 19.8762, longitude: 75.3433 },
    {
      manufacturedDate: new Date('2024-01-15'),
      model: 'Tesla Model 3',
      fuelType: 'EV',
      bhp: 283,
      torque: 420,
    },
    {
      motorType: 'Permanent Magnet',
      voltage: 400,
      batteryCapacity: 75,
      range: 500,
    },
    [],
    '123'
  );

  beforeEach(() => {
    service = new MockVehicleService();
    controller = new VehicleController(service as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('should create a vehicle and return 201', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = mockVehicle.toJSON();

      service.createVehicle.mockResolvedValue(mockVehicle);

      await controller.createVehicle(req, res);

      expect(service.createVehicle).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVehicle.toJSON(),
      });
    });

    it('should return 400 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = {};

      service.createVehicle.mockRejectedValue(new Error('Invalid data'));

      await controller.createVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid data',
      });
    });
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles with 200', async () => {
      const req = mockRequest();
      const res = mockResponse();

      service.getAllVehicles.mockResolvedValue([mockVehicle]);

      await controller.getAllVehicles(req, res);

      expect(service.getAllVehicles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [mockVehicle.toJSON()],
      });
    });

    it('should return 500 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      service.getAllVehicles.mockRejectedValue(new Error('Database error'));

      await controller.getAllVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
      });
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle by ID with 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';

      service.getVehicleById.mockResolvedValue(mockVehicle);

      await controller.getVehicleById(req, res);

      expect(service.getVehicleById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVehicle.toJSON(),
      });
    });

    it('should return 404 when vehicle not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '999';

      service.getVehicleById.mockRejectedValue(
        new Error('Vehicle with id 999 not found')
      );

      await controller.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Vehicle with id 999 not found',
      });
    });
  });

  describe('getVehiclesByType', () => {
    it('should return vehicles by type with 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.type = 'Electric';

      service.getVehiclesByType.mockResolvedValue([mockVehicle]);

      await controller.getVehiclesByType(req, res);

      expect(service.getVehiclesByType).toHaveBeenCalledWith('Electric');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [mockVehicle.toJSON()],
      });
    });

    it('should return 400 for invalid type', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.type = 'InvalidType';

      service.getVehiclesByType.mockRejectedValue(
        new Error('Invalid vehicle type: InvalidType')
      );

      await controller.getVehiclesByType(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle and return 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';
      req.body = mockVehicle.toJSON();

      service.updateVehicle.mockResolvedValue(mockVehicle);

      await controller.updateVehicle(req, res);

      expect(service.updateVehicle).toHaveBeenCalledWith('123', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVehicle.toJSON(),
      });
    });

    it('should return 400 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';
      req.body = {};

      service.updateVehicle.mockRejectedValue(new Error('Invalid data'));

      await controller.updateVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateVehicleLocation', () => {
    it('should update location and return 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';
      req.body = { latitude: 20.5937, longitude: 78.9629 };

      service.updateVehicleLocation.mockResolvedValue(mockVehicle);

      await controller.updateVehicleLocation(req, res);

      expect(service.updateVehicleLocation).toHaveBeenCalledWith(
        '123',
        20.5937,
        78.9629
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 for invalid coordinates', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';
      req.body = { latitude: 100, longitude: 75 };

      service.updateVehicleLocation.mockRejectedValue(
        new Error('Invalid latitude')
      );

      await controller.updateVehicleLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle and return 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '123';

      service.deleteVehicle.mockResolvedValue(undefined);

      await controller.deleteVehicle(req, res);

      expect(service.deleteVehicle).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    });

    it('should return 404 when vehicle not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '999';

      service.deleteVehicle.mockRejectedValue(
        new Error('Vehicle with id 999 not found')
      );

      await controller.deleteVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics with 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const stats = {
        total: 10,
        byType: { Electric: 5, Petrol: 3, Diesel: 2 },
        averageBHP: 250,
        averageTorque: 380,
      };

      service.getStatistics.mockResolvedValue(stats);

      await controller.getStatistics(req, res);

      expect(service.getStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: stats,
      });
    });

    it('should return 500 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      service.getStatistics.mockRejectedValue(new Error('Database error'));

      await controller.getStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getVehiclesInArea', () => {
    it('should return vehicles in area with 200', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.query = {
        minLat: '19',
        maxLat: '21',
        minLng: '75',
        maxLng: '77',
      };

      service.getVehiclesInArea.mockResolvedValue([mockVehicle]);

      await controller.getVehiclesInArea(req, res);

      expect(service.getVehiclesInArea).toHaveBeenCalledWith(19, 21, 75, 77);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [mockVehicle.toJSON()],
      });
    });

    it('should return 400 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.query = {};

      service.getVehiclesInArea.mockRejectedValue(new Error('Invalid parameters'));

      await controller.getVehiclesInArea(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});