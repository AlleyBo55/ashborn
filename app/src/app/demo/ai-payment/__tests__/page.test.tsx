import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIPaymentDemoPage from '../page';

global.fetch = jest.fn();

describe('AI Payment Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders ai-payment demo page', () => {
        render(<AIPaymentDemoPage />);
        expect(screen.getByText(/MICRO_PAYMENTS/i)).toBeInTheDocument();
    });

    it('executes payment flow', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'shield' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'unshield' }) });

        render(<AIPaymentDemoPage />);
        fireEvent.click(screen.getByText(/SEND_AGENT_PAYMENT/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });
});
