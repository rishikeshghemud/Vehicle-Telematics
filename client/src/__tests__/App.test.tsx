import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { vehicleApi } from '../services/api';
import { act } from '@testing-library/react';

// Mock the API
vi.mock('../services/api', () => ({
    vehicleApi: {
        getAllVehicles: vi.fn(),
        getVehiclesByType: vi.fn(),
        createVehicle: vi.fn(),
        deleteVehicle: vi.fn(),
        getStatistics: vi.fn(),
    },
}));

const mockVehicles = [
    {
        _id: '1',
        type: 'Electric' as const,
        location: { latitude: 19.8762, longitude: 75.3433 },
        details: {
            manufacturedDate: '2024-01-15',
            model: 'Tesla Model 3',
            fuelType: 'EV' as const,
            bhp: 283,
            torque: 420,
        },
        engineDetails: {
            motorType: 'Permanent Magnet' as const,
            voltage: 400,
            batteryCapacity: 75,
            range: 500,
        },
        uniqueParts: [],
    },
];

const mockStats = {
    total: 1,
    byType: { Electric: 1 },
    averageBHP: 283,
    averageTorque: 420,
};

const renderApp = async () => {
  await act(async () => {
    render(<App />);
  });
};


describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (vehicleApi.getAllVehicles as any).mockResolvedValue(mockVehicles);
        (vehicleApi.getVehiclesByType as any).mockResolvedValue(mockVehicles);
        (vehicleApi.getStatistics as any).mockResolvedValue(mockStats);
    });

    it('should render app header', async () => {
        await renderApp();


        await waitFor(() => {
            expect(screen.getByText('🚗 Vehicle Telematics System')).toBeInTheDocument();
        });
    });

    it('should render add vehicle button', async () => {
        await renderApp();


        await waitFor(() => {
            expect(screen.getByText('+ Add Vehicle')).toBeInTheDocument();
        });
    });

    it('should load vehicles on mount', async () => {
        await renderApp();


        await waitFor(() => {
            expect(vehicleApi.getAllVehicles).toHaveBeenCalled();
            expect(vehicleApi.getStatistics).toHaveBeenCalled();
        });
    });

    it('should display loading state', async () => {
        (vehicleApi.getAllVehicles as any).mockImplementation(
            () => new Promise(() => { }) // Never resolves
        );

        await renderApp();

        expect(screen.getByText('Loading vehicles...')).toBeInTheDocument();
    });

    it('should display vehicles after loading', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
        });
    });

    it('should display statistics', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
            // Use queryAllByText to handle multiple elements with "1"
            const ones = screen.getAllByText('1');
            expect(ones.length).toBeGreaterThan(0);
            expect(screen.getByText('Avg BHP')).toBeInTheDocument();
            const avgBhpValues = screen.getAllByText('283');
            expect(avgBhpValues.length).toBeGreaterThan(0);
        });
    });

    it('should open vehicle form when clicking add button', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('+ Add Vehicle')).toBeInTheDocument();
        });

        const addButton = screen.getByText('+ Add Vehicle');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
        });
    });

    it('should filter vehicles by type', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getAllByText('Electric')[0]).toBeInTheDocument();
        });

        const filterButton = screen.getByRole('button', { name: 'Electric' });
        fireEvent.click(filterButton);

        await waitFor(() => {
            expect(vehicleApi.getVehiclesByType).toHaveBeenCalledWith('Electric');
        });
    });

    it('should show all vehicles when clicking All filter', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('All')).toBeInTheDocument();
        });

        const allButton = screen.getByRole('button', { name: 'All' });
        fireEvent.click(allButton);

        await waitFor(() => {
            expect(vehicleApi.getAllVehicles).toHaveBeenCalled();
        });
    });

    it('should handle delete vehicle', async () => {
        (vehicleApi.deleteVehicle as any).mockResolvedValue(undefined);
        window.confirm = vi.fn(() => true);

        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(vehicleApi.deleteVehicle).toHaveBeenCalledWith('1');
        });
    });

    it('should display error message when loading fails', async () => {
        const errorMessage = 'Failed to load vehicles';
        (vehicleApi.getAllVehicles as any).mockRejectedValue(
            new Error(errorMessage)
        );

        await renderApp();

        await waitFor(() => {
            expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
        });
    });

    it('should allow retry after error', async () => {
        (vehicleApi.getAllVehicles as any)
            .mockRejectedValueOnce(new Error('Failed'))
            .mockResolvedValueOnce(mockVehicles);

        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
        });
    });

    it('should close vehicle form on cancel', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('+ Add Vehicle')).toBeInTheDocument();
        });

        const addButton = screen.getByText('+ Add Vehicle');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
        });

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Add New Vehicle')).not.toBeInTheDocument();
        });
    });

    it('should display vehicle type breakdown', async () => {
        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('Vehicles by Type')).toBeInTheDocument();
            expect(screen.getByText('Electric:')).toBeInTheDocument();
        });
    });

    it('should show empty state when no vehicles', async () => {
        (vehicleApi.getAllVehicles as any).mockResolvedValue([]);
        (vehicleApi.getStatistics as any).mockResolvedValue({
            total: 0,
            byType: {},
            averageBHP: 0,
            averageTorque: 0,
        });

        await renderApp();

        await waitFor(() => {
            expect(screen.getByText('No vehicles found')).toBeInTheDocument();
        });
    });
});