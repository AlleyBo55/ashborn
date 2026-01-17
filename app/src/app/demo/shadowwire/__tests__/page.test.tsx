import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShadowWireDemoPage from '../page';

global.fetch = jest.fn();

describe('Shadowwire Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders Shadowwire demo page with terminal header', () => {
        render(<ShadowWireDemoPage />);
        expect(screen.getByText(/SHADOWWIRE/i)).toBeInTheDocument();
    });

    it('displays stealth address protocol info', () => {
        render(<ShadowWireDemoPage />);
        expect(screen.getByText(/STEALTH_ADDRESS_PROTOCOL/i)).toBeInTheDocument();
    });

    it('shows waiting state before generation', () => {
        render(<ShadowWireDemoPage />);
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

        render(<ShadowWireDemoPage />);
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

        render(<ShadowWireDemoPage />);
        fireEvent.click(screen.getByText(/GENERATE_STEALTH_ADDRESS/i));

        await waitFor(() => {
            expect(screen.getByText(/GENERATE_ANOTHER/i)).toBeInTheDocument();
        });
    });
});
