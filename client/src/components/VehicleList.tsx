import React from 'react';
import { type Vehicle } from '../types/vehicle.types';

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onSelectVehicle,
  onDeleteVehicle,
}) => {
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Electric':
        return '⚡';
      case 'Petrol':
        return '⛽';
      case 'Diesel':
        return '🚛';
      case 'Hybrid':
        return '🔋';
      default:
        return '🚗';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Electric':
        return 'bg-green-100 text-green-800';
      case 'Petrol':
        return 'bg-blue-100 text-blue-800';
      case 'Diesel':
        return 'bg-orange-100 text-orange-800';
      case 'Hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No vehicles found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add a vehicle to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200"
          onClick={() => onSelectVehicle(vehicle)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getVehicleIcon(vehicle.type)}</span>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {vehicle.details.model}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    vehicle.type
                  )}`}
                >
                  {vehicle.type}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Fuel Type:</span>
              <span>{vehicle.details.fuelType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">BHP:</span>
              <span>{vehicle.details.bhp}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Torque:</span>
              <span>{vehicle.details.torque} Nm</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span className="text-xs">
                {vehicle.location.latitude.toFixed(4)},{' '}
                {vehicle.location.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectVehicle(vehicle);
              }}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (vehicle._id && confirm('Delete this vehicle?')) {
                  onDeleteVehicle(vehicle._id);
                }
              }}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};