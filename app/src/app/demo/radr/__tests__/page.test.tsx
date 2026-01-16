import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RadrDemoPage from '../page';

global.fetch = jest.fn();

describe('Radr Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders radr demo page with terminal header', () => {
        render(<RadrDemoPage />);
        expect(screen.getByText(/RADR_LABS_INTEGRATION/i)).toBeInTheDocument();
        expect(screen.getByText(/SHADOWWIRE/i)).toBeInTheDocument();
    });

    it('displays stealth address protocol info', () => {
        render(<RadrDemoPage />);
        expect(screen.getByText(/STEALTH_ADDRESS_PROTOCOL/i)).toBeInTheDocument();
    });

    it('shows waiting state before generation', () => {
        render(<RadrDemoPage />);
        expect(screen.getByText(/waiting_to_generate/i)).toBeInTheDocument();
    });

    it('generates stealth address successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ 
                success: true, 
                stealthAddress: 'stealth_abc123def456', 
                viewKey: 'view_key_xyz789' 
            })
        });

        render(<RadrDemoPage />);
        fireEvent.click(screen.getByText(/GENERATE_STEALTH_ADDRESS/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.stringContaining('stealth')
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/stealth_abc123def456/)).toBeInTheDocument();
        });
    });

    it('allows generating another address', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({ success: true, stealthAddress: 'addr', viewKey: 'key' })
        });

        render(<RadrDemoPage />);
        fireEvent.click(screen.getByText(/GENERATE_STEALTH_ADDRESS/i));

        await waitFor(() => {
            expect(screen.getByText(/GENERATE_ANOTHER/i)).toBeInTheDocument();
        });
    });
});
