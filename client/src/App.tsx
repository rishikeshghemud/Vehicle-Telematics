import { useState, useEffect } from 'react';
import { type Vehicle } from './types/vehicle.types';
import { vehicleApi } from './services/api';
import { VehicleList } from './components/VehicleList';
import { VehicleDetails } from './components/VehicleDetails';
import { VehicleForm } from './components/VehicleForm';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
    loadStatistics();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getAllVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await vehicleApi.getStatistics();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleAddVehicle = async (vehicle: Omit<Vehicle, '_id'>) => {
    try {
      await vehicleApi.createVehicle(vehicle);
      setShowForm(false);
      await loadVehicles();
      await loadStatistics();
    } catch (err: any) {
      alert(`Error adding vehicle: ${err.message}`);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleApi.deleteVehicle(id);
      await loadVehicles();
      await loadStatistics();
    } catch (err: any) {
      alert(`Error deleting vehicle: ${err.message}`);
    }
  };

  const handleFilterChange = async (type: string) => {
    setFilterType(type);
    try {
      setLoading(true);
      if (type === 'all') {
        const data = await vehicleApi.getAllVehicles();
        setVehicles(data);
      } else {
        const data = await vehicleApi.getVehiclesByType(type);
        setVehicles(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚗 Vehicle Telematics System
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track your vehicle fleet
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
            >
              + Add Vehicle
            </button>
          </div>
        </div>
      </header>

      {/* Statistics */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Avg BHP</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageBHP.toFixed(0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Avg Torque</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageTorque.toFixed(0)} Nm
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Vehicle Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(stats.byType).length}
              </p>
            </div>
          </div>

          {/* Type Breakdown */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-2">
              Vehicles by Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stats.byType).map(([type, count]: [string, any]) => (
                <div key={type} className="flex items-center gap-4">
                  <span className="text-gray-600">{type}:</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded ${
                filterType === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {['Electric', 'Petrol', 'Diesel', 'Hybrid'].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-4 py-2 rounded ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={loadVehicles}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <VehicleList
            vehicles={vehicles}
            onSelectVehicle={setSelectedVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}
      </main>

      {/* Modals */}
      {selectedVehicle && (
        <VehicleDetails
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {showForm && (
        <VehicleForm
          onSubmit={handleAddVehicle}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;