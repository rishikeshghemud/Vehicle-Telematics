import React, { useState } from 'react';
import { type Vehicle } from '../types/vehicle.types';

interface VehicleFormProps {
  onSubmit: (vehicle: Omit<Vehicle, '_id'>) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [vehicleType, setVehicleType] = useState<'Electric' | 'Petrol' | 'Diesel' | 'Hybrid'>('Electric');
  
  const [model, setModel] = useState('');
  const [manufacturedDate, setManufacturedDate] = useState('');
  const [bhp, setBhp] = useState('');
  const [torque, setTorque] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Electric specific
  const [motorType, setMotorType] = useState<'AC' | 'DC' | 'Permanent Magnet'>('AC');
  const [voltage, setVoltage] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [range, setRange] = useState('');

  // Petrol/Diesel specific
  const [displacement, setDisplacement] = useState('');
  const [cylinders, setCylinders] = useState('');
  const [configuration, setConfiguration] = useState<'Inline' | 'V-Type' | 'Flat'>('Inline');
  const [compressionRatio, setCompressionRatio] = useState('');

  // Petrol specific
  const [fuelInjection, setFuelInjection] = useState<'Port' | 'Direct'>('Port');

  // Diesel specific
  const [turboCharged, setTurboCharged] = useState(false);
  const [fuelSystemType, setFuelSystemType] = useState<'Common Rail' | 'Direct Injection' | 'Indirect Injection'>('Common Rail');

  // Hybrid specific
  const [iceDisplacement, setIceDisplacement] = useState('');
  const [iceCylinders, setIceCylinders] = useState('');
  const [electricMotorPower, setElectricMotorPower] = useState('');
  const [hybridBatteryCapacity, setHybridBatteryCapacity] = useState('');
  const [hybridType, setHybridType] = useState<'Parallel' | 'Series' | 'Series-Parallel'>('Parallel');
  const [electricRange, setElectricRange] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseVehicle = {
      type: vehicleType,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      details: {
        manufacturedDate,
        model,
        fuelType: vehicleType === 'Electric' ? 'EV' : vehicleType as 'Petrol' | 'Diesel' | 'Hybrid',
        bhp: parseFloat(bhp),
        torque: parseFloat(torque),
      },
      uniqueParts: [],
    };

    let vehicle: any = baseVehicle;

    switch (vehicleType) {
      case 'Electric':
        vehicle.engineDetails = {
          motorType,
          voltage: parseFloat(voltage),
          batteryCapacity: parseFloat(batteryCapacity),
          range: parseFloat(range),
        };
        break;

      case 'Petrol':
        vehicle.engineDetails = {
          displacement: parseFloat(displacement),
          cylinders: parseInt(cylinders),
          configuration,
          fuelInjection,
          compressionRatio: parseFloat(compressionRatio),
        };
        break;

      case 'Diesel':
        vehicle.engineDetails = {
          displacement: parseFloat(displacement),
          cylinders: parseInt(cylinders),
          configuration,
          turboCharged,
          compressionRatio: parseFloat(compressionRatio),
          fuelSystemType,
        };
        break;

      case 'Hybrid':
        vehicle.engineDetails = {
          iceDisplacement: parseFloat(iceDisplacement),
          iceCylinders: parseInt(iceCylinders),
          electricMotorPower: parseFloat(electricMotorPower),
          batteryCapacity: parseFloat(hybridBatteryCapacity),
          hybridType,
          electricRange: parseFloat(electricRange),
        };
        break;
    }

    onSubmit(vehicle);
  };

  const renderEngineFields = () => {
    switch (vehicleType) {
      case 'Electric':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motor Type
              </label>
              <select
                value={motorType}
                onChange={(e) => setMotorType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="AC">AC</option>
                <option value="DC">DC</option>
                <option value="Permanent Magnet">Permanent Magnet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voltage (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Capacity (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Range (km)
              </label>
              <input
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        );

      case 'Petrol':
      case 'Diesel':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Displacement (cc)
              </label>
              <input
                type="number"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cylinders
              </label>
              <input
                type="number"
                value={cylinders}
                onChange={(e) => setCylinders(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Configuration
              </label>
              <select
                value={configuration}
                onChange={(e) => setConfiguration(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Inline">Inline</option>
                <option value="V-Type">V-Type</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compression Ratio
              </label>
              <input
                type="number"
                step="0.1"
                value={compressionRatio}
                onChange={(e) => setCompressionRatio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {vehicleType === 'Petrol' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Injection
                </label>
                <select
                  value={fuelInjection}
                  onChange={(e) => setFuelInjection(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Port">Port</option>
                  <option value="Direct">Direct</option>
                </select>
              </div>
            )}
            {vehicleType === 'Diesel' && (
              <>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={turboCharged}
                      onChange={(e) => setTurboCharged(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Turbo Charged
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel System Type
                  </label>
                  <select
                    value={fuelSystemType}
                    onChange={(e) => setFuelSystemType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Common Rail">Common Rail</option>
                    <option value="Direct Injection">Direct Injection</option>
                    <option value="Indirect Injection">Indirect Injection</option>
                  </select>
                </div>
              </>
            )}
          </>
        );

      case 'Hybrid':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ICE Displacement (cc)
              </label>
              <input
                type="number"
                value={iceDisplacement}
                onChange={(e) => setIceDisplacement(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ICE Cylinders
              </label>
              <input
                type="number"
                value={iceCylinders}
                onChange={(e) => setIceCylinders(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electric Motor Power (kW)
              </label>
              <input
                type="number"
                step="0.1"
                value={electricMotorPower}
                onChange={(e) => setElectricMotorPower(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Capacity (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={hybridBatteryCapacity}
                onChange={(e) => setHybridBatteryCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hybrid Type
              </label>
              <select
                value={hybridType}
                onChange={(e) => setHybridType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Parallel">Parallel</option>
                <option value="Series">Series</option>
                <option value="Series-Parallel">Series-Parallel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electric Range (km)
              </label>
              <input
                type="number"
                value={electricRange}
                onChange={(e) => setElectricRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <h2 className="text-2xl font-bold text-gray-800">Add New Vehicle</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufactured Date
              </label>
              <input
                type="date"
                value={manufacturedDate}
                onChange={(e) => setManufacturedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BHP
              </label>
              <input
                type="number"
                value={bhp}
                onChange={(e) => setBhp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Torque (Nm)
              </label>
              <input
                type="number"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Engine Specific Fields */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Engine/Motor Details
            </h3>
            <div className="grid grid-cols-2 gap-4">{renderEngineFields()}</div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};