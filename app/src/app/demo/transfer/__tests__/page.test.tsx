import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransferDemoPage from '../page';

global.fetch = jest.fn();

describe('Transfer Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders transfer demo page', () => {
        render(<TransferDemoPage />);
        expect(screen.getByText(/STEALTH_TRANSFER/i)).toBeInTheDocument();
    });

    it('executes stealth transfer', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, stealthAddress: 'addr' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'sig' }) });

        render(<TransferDemoPage />);
        fireEvent.click(screen.getByText(/SEND_STEALTH_TRANSFER/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
});
