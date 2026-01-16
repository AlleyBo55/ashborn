import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InteropDemoPage from '../page';

global.fetch = jest.fn();

describe('Interop Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders interop demo page', () => {
        render(<InteropDemoPage />);
        expect(screen.getByText(/INTEROP/i)).toBeInTheDocument();
    });

    it('executes full privacy flow', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'shield-sig' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, stealthAddress: 'addr' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'unshield-sig' }) });

        render(<InteropDemoPage />);
        fireEvent.click(screen.getByText(/RUN_PRIVACY_FLOW/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });
    });
});
