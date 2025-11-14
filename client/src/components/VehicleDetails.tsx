import React from 'react';
import { type   Vehicle } from '../types/vehicle.types';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicle,
  onClose,
}) => {
  const renderEngineDetails = () => {
    switch (vehicle.type) {
      case 'Electric':
        return (
          <>
            <DetailRow label="Motor Type" value={vehicle.engineDetails.motorType} />
            <DetailRow label="Voltage" value={`${vehicle.engineDetails.voltage}V`} />
            <DetailRow
              label="Battery Capacity"
              value={`${vehicle.engineDetails.batteryCapacity} kWh`}
            />
            <DetailRow label="Range" value={`${vehicle.engineDetails.range} km`} />
          </>
        );

      case 'Petrol':
        return (
          <>
            <DetailRow
              label="Displacement"
              value={`${vehicle.engineDetails.displacement} cc`}
            />
            <DetailRow label="Cylinders" value={vehicle.engineDetails.cylinders} />
            <DetailRow
              label="Configuration"
              value={vehicle.engineDetails.configuration}
            />
            <DetailRow
              label="Fuel Injection"
              value={vehicle.engineDetails.fuelInjection}
            />
            <DetailRow
              label="Compression Ratio"
              value={vehicle.engineDetails.compressionRatio}
            />
          </>
        );

      case 'Diesel':
        return (
          <>
            <DetailRow
              label="Displacement"
              value={`${vehicle.engineDetails.displacement} cc`}
            />
            <DetailRow label="Cylinders" value={vehicle.engineDetails.cylinders} />
            <DetailRow
              label="Configuration"
              value={vehicle.engineDetails.configuration}
            />
            <DetailRow
              label="Turbo Charged"
              value={vehicle.engineDetails.turboCharged ? 'Yes' : 'No'}
            />
            <DetailRow
              label="Compression Ratio"
              value={vehicle.engineDetails.compressionRatio}
            />
            <DetailRow
              label="Fuel System"
              value={vehicle.engineDetails.fuelSystemType}
            />
          </>
        );

      case 'Hybrid':
        return (
          <>
            <DetailRow
              label="ICE Displacement"
              value={`${vehicle.engineDetails.iceDisplacement} cc`}
            />
            <DetailRow
              label="ICE Cylinders"
              value={vehicle.engineDetails.iceCylinders}
            />
            <DetailRow
              label="Electric Motor Power"
              value={`${vehicle.engineDetails.electricMotorPower} kW`}
            />
            <DetailRow
              label="Battery Capacity"
              value={`${vehicle.engineDetails.batteryCapacity} kWh`}
            />
            <DetailRow
              label="Hybrid Type"
              value={vehicle.engineDetails.hybridType}
            />
            <DetailRow
              label="Electric Range"
              value={`${vehicle.engineDetails.electricRange} km`}
            />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {vehicle.details.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Details */}
          <Section title="Basic Information">
            <DetailRow label="Type" value={vehicle.type} />
            <DetailRow label="Fuel Type" value={vehicle.details.fuelType} />
            <DetailRow label="Model" value={vehicle.details.model} />
            <DetailRow
              label="Manufactured Date"
              value={new Date(vehicle.details.manufacturedDate).toLocaleDateString()}
            />
            <DetailRow label="BHP" value={vehicle.details.bhp} />
            <DetailRow label="Torque" value={`${vehicle.details.torque} Nm`} />
          </Section>

          {/* Location */}
          <Section title="Location">
            <DetailRow
              label="Latitude"
              value={vehicle.location.latitude.toFixed(6)}
            />
            <DetailRow
              label="Longitude"
              value={vehicle.location.longitude.toFixed(6)}
            />
          </Section>

          {/* Engine Details */}
          <Section title="Engine/Motor Details">
            {renderEngineDetails()}
          </Section>

          {/* Unique Parts */}
          <Section title="Unique Parts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicle.uniqueParts.map((part, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <div className="font-medium text-gray-800">{part.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Condition: {part.condition}
                  </div>
                  {part.manufacturer && (
                    <div className="text-sm text-gray-600">
                      Manufacturer: {part.manufacturer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: any }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);