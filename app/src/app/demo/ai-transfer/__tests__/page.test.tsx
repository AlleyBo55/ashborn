import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AITransferDemoPage from '../page';

global.fetch = jest.fn();

describe('AI Transfer Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders ai-transfer demo page', () => {
        render(<AITransferDemoPage />);
        expect(screen.getByText(/STEALTH_TRANSFER/i)).toBeInTheDocument();
    });

    it('executes transfer with ring signatures', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, stealthAddress: 'addr' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'sig', decoyOutputs: [] }) });

        render(<AITransferDemoPage />);
        fireEvent.click(screen.getByText(/EXECUTE_TRANSFER/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
});
