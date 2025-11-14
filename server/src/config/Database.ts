import { MongoClient, Db } from 'mongodb';

export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string, dbName: string): Promise<Db> {
    try {
      if (this.db) {
        return this.db;
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      
      console.log('Connected to MongoDB successfully');
      
      this.db = this.client.db(dbName);
      
      await this.createIndexes();
      
      return this.db;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) return;

    const vehiclesCollection = this.db.collection('vehicles');
    
    await vehiclesCollection.createIndex({ type: 1 });
    
    await vehiclesCollection.createIndex({ 
      'location.latitude': 1, 
      'location.longitude': 1 
    });
    
    console.log('Database indexes created');
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }
}