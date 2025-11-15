import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleList } from '../../components/VehicleList';
import { Vehicle } from '../../types/vehicle.types';

const mockVehicles: Vehicle[] = [
  {
    _id: '1',
    type: 'Electric',
    location: { latitude: 19.8762, longitude: 75.3433 },
    details: {
      manufacturedDate: '2024-01-15',
      model: 'Tesla Model 3',
      fuelType: 'EV',
      bhp: 283,
      torque: 420,
    },
    engineDetails: {
      motorType: 'Permanent Magnet',
      voltage: 400,
      batteryCapacity: 75,
      range: 500,
    },
    uniqueParts: [],
  },
  {
    _id: '2',
    type: 'Petrol',
    location: { latitude: 20.5937, longitude: 78.9629 },
    details: {
      manufacturedDate: '2023-05-20',
      model: 'BMW M3',
      fuelType: 'Petrol',
      bhp: 503,
      torque: 650,
    },
    engineDetails: {
      displacement: 2993,
      cylinders: 6,
      configuration: 'Inline',
      fuelInjection: 'Direct',
      compressionRatio: 9.3,
    },
    uniqueParts: [],
  },
];

describe('VehicleList', () => {
  const mockOnSelectVehicle = vi.fn();
  const mockOnDeleteVehicle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    window.confirm = vi.fn(() => true);
  });

  it('should render empty state when no vehicles', () => {
    render(
      <VehicleList
        vehicles={[]}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    expect(screen.getByText('No vehicles found')).toBeInTheDocument();
    expect(screen.getByText('Add a vehicle to get started')).toBeInTheDocument();
  });

  it('should render list of vehicles', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    expect(screen.getByText('BMW M3')).toBeInTheDocument();
  });

  it('should display vehicle details', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    // Check for Electric vehicle
    const electricBadges = screen.getAllByText('Electric');
    expect(electricBadges[0]).toBeInTheDocument();
    expect(screen.getByText('283')).toBeInTheDocument();
    expect(screen.getByText('420 Nm')).toBeInTheDocument();

    // Check for Petrol vehicle
    const petrolElements = screen.getAllByText('Petrol');
    expect(petrolElements[0]).toBeInTheDocument();
    expect(screen.getByText('503')).toBeInTheDocument();
    expect(screen.getByText('650 Nm')).toBeInTheDocument();
  });

  it('should call onSelectVehicle when clicking vehicle card', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    const vehicleCards = screen.getAllByText('Tesla Model 3');
    fireEvent.click(vehicleCards[0]);

    expect(mockOnSelectVehicle).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('should call onSelectVehicle when clicking View Details button', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);

    expect(mockOnSelectVehicle).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('should call onDeleteVehicle when clicking Delete button', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Delete this vehicle?');
    expect(mockOnDeleteVehicle).toHaveBeenCalledWith('1');
  });

  it('should not delete vehicle if user cancels confirmation', () => {
    window.confirm = vi.fn(() => false);

    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDeleteVehicle).not.toHaveBeenCalled();
  });

  it('should display correct location format', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    expect(screen.getByText(/19.8762, 75.3433/)).toBeInTheDocument();
  });

  it('should apply correct styling for different vehicle types', () => {
    render(
      <VehicleList
        vehicles={mockVehicles}
        onSelectVehicle={mockOnSelectVehicle}
        onDeleteVehicle={mockOnDeleteVehicle}
      />
    );

    const electricBadges = screen.getAllByText('Electric');
    expect(electricBadges[0]).toHaveClass('bg-green-100', 'text-green-800');

    const petrolBadges = screen.getAllByText('Petrol');
    expect(petrolBadges[0]).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});