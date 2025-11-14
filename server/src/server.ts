import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Database } from './config/Database';
import { VehicleRepository } from './repositories/VehicleRepository';
import { VehicleService } from './services/VehicleService';
import { VehicleController } from './controllers/VehicleController';
import { createVehicleRoutes } from './routes/vehicleRoutes';
import 'dotenv/config';


const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rishikeshghemudwork1:YWq7hCcwhh@clusterdev.6nkbof6.mongodb.net/';
const DB_NAME = process.env.DB_NAME || 'vehicle_telematics';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware - log on every request made
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


async function initializeApp() {
  try {
    // Connect to DB
    const database = Database.getInstance();
    const db = await database.connect(MONGODB_URI, DB_NAME);
    
    const vehicleRepository = new VehicleRepository(db);
    const vehicleService = new VehicleService(vehicleRepository);
    const vehicleController = new VehicleController(vehicleService);
    
    // Setup routes
    app.use('/api/vehicles', createVehicleRoutes(vehicleController));
    
    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Vehicle Telematics API'
      });
    });
    
    // Root endpoint
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        message: 'Vehicle Telematics API',
        version: '1.0.0',
        endpoints: {
          vehicles: '/api/vehicles',
          health: '/health'
        }
      });
    });
    
    // 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });
    
    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
      });
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Connected to database: ${DB_NAME}`);
    });
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  const database = Database.getInstance();
  await database.disconnect();
  process.exit(0);
});

// Start the application
initializeApp();