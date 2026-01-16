import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AILendingDemoPage from '../page';

global.fetch = jest.fn();

describe('AI Lending Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders ai-lending demo page', () => {
        render(<AILendingDemoPage />);
        expect(screen.getByText(/COLLATERAL_LENDING/i)).toBeInTheDocument();
    });

    it('executes lending flow', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, proof: 'proof' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'sig' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, stealthAddress: 'addr' }) });

        render(<AILendingDemoPage />);
        fireEvent.click(screen.getByText(/EXECUTE_LENDING/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });
    });
});
