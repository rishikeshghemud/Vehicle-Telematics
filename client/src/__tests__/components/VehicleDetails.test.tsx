import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VehicleDetails } from '../../components/VehicleDetails';
import { Vehicle } from '../../types/vehicle.types';

const mockElectricVehicle: Vehicle = {
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
  uniqueParts: [
    { name: 'Electric Motor', condition: 'New' },
    { name: 'Battery Pack', condition: 'Good' },
  ],
};

const mockDieselVehicle: Vehicle = {
  _id: '2',
  type: 'Diesel',
  location: { latitude: 20.5937, longitude: 78.9629 },
  details: {
    manufacturedDate: '2023-05-20',
    model: 'Ford Ranger',
    fuelType: 'Diesel',
    bhp: 210,
    torque: 500,
  },
  engineDetails: {
    displacement: 2000,
    cylinders: 4,
    configuration: 'Inline',
    turboCharged: true,
    compressionRatio: 16.0,
    fuelSystemType: 'Common Rail',
  },
  uniqueParts: [
    { name: 'Diesel ICE', condition: 'New' },
    { name: 'Turbocharger', condition: 'New' },
  ],
};

describe('VehicleDetails', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render vehicle details modal', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    const heading = screen.getByRole('heading', { name: /Tesla Model 3/i });
    expect(heading).toBeInTheDocument();
  });

  it('should display basic information', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('EV')).toBeInTheDocument();
    expect(screen.getByText('283')).toBeInTheDocument();
    expect(screen.getByText('420 Nm')).toBeInTheDocument();
  });

  it('should display location information', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('19.876200')).toBeInTheDocument();
    expect(screen.getByText('75.343300')).toBeInTheDocument();
  });

  it('should display electric vehicle engine details', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    expect(screen.getByText('Engine/Motor Details')).toBeInTheDocument();
    expect(screen.getByText('Permanent Magnet')).toBeInTheDocument();
    expect(screen.getByText('400V')).toBeInTheDocument();
    expect(screen.getByText('75 kWh')).toBeInTheDocument();
    expect(screen.getByText('500 km')).toBeInTheDocument();
  });

  it('should display diesel vehicle engine details', () => {
    render(<VehicleDetails vehicle={mockDieselVehicle} onClose={mockOnClose} />);

    expect(screen.getByText('2000 cc')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Inline')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Common Rail')).toBeInTheDocument();
  });

  it('should display unique parts', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    expect(screen.getByText('Unique Parts')).toBeInTheDocument();
    expect(screen.getByText('Electric Motor')).toBeInTheDocument();
    expect(screen.getByText('Battery Pack')).toBeInTheDocument();
    expect(screen.getByText('Condition: New')).toBeInTheDocument();
    expect(screen.getByText('Condition: Good')).toBeInTheDocument();
  });

  it('should format manufactured date correctly', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    const dateElements = screen.getAllByText(/2024|Jan|15/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should call onClose when clicking close button', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking Close button at bottom', () => {
    render(<VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByText('Close');
    fireEvent.click(closeButtons[0]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render modal overlay', () => {
    const { container } = render(
      <VehicleDetails vehicle={mockElectricVehicle} onClose={mockOnClose} />
    );

    const overlay = container.querySelector('.fixed.inset-0.bg-black');
    expect(overlay).toBeInTheDocument();
  });

  it('should display part manufacturer if provided', () => {
    const vehicleWithManufacturer: Vehicle = {
      ...mockElectricVehicle,
      uniqueParts: [
        { name: 'Electric Motor', condition: 'New', manufacturer: 'Tesla' },
      ],
    };

    render(<VehicleDetails vehicle={vehicleWithManufacturer} onClose={mockOnClose} />);

    expect(screen.getByText('Manufacturer: Tesla')).toBeInTheDocument();
  });
});
