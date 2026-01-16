import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShadowAgentDemoPage from '../page';

global.fetch = jest.fn();

describe('Shadow Agent Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders shadow-agent demo page with terminal header', () => {
        render(<ShadowAgentDemoPage />);
        expect(screen.getByText(/PRIVATE_AI_COMMERCE/i)).toBeInTheDocument();
        expect(screen.getByText(/SHADOW_AGENT_PROTOCOL/i)).toBeInTheDocument();
    });

    it('displays AI agent personas', () => {
        render(<ShadowAgentDemoPage />);
        expect(screen.getByText(/THE_ARCHITECT/i)).toBeInTheDocument();
        expect(screen.getByText(/TOWER_OF_TRIALS/i)).toBeInTheDocument();
    });

    it('displays demo wallet info', () => {
        render(<ShadowAgentDemoPage />);
        expect(screen.getByText(/DEMO_WALLET/i)).toBeInTheDocument();
    });

    it('shows execution pipeline', () => {
        render(<ShadowAgentDemoPage />);
        expect(screen.getByText(/EXECUTION_PIPELINE/i)).toBeInTheDocument();
    });

    it('executes AI-to-AI transaction successfully', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'shield-sig' }) })
            .mockResolvedValueOnce({ json: async () => ({ reply: 'What is consciousness?' }) })
            .mockResolvedValueOnce({ json: async () => ({ success: true, signature: 'unshield-sig' }) })
            .mockResolvedValueOnce({ json: async () => ({ reply: 'Consciousness is...' }) });

        render(<ShadowAgentDemoPage />);
        fireEvent.click(screen.getByText(/START_AI_TRANSACTION/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(4);
        }, { timeout: 10000 });

        await waitFor(() => {
            expect(screen.getByText(/TRANSACTION_COMPLETE/i)).toBeInTheDocument();
        }, { timeout: 10000 });
    });

    it('displays chat log during execution', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValue({ json: async () => ({ success: true, reply: 'test' }) });

        render(<ShadowAgentDemoPage />);
        fireEvent.click(screen.getByText(/START_AI_TRANSACTION/i));

        await waitFor(() => {
            expect(screen.getByText(/AGENT_COMMUNICATION_LOG/i)).toBeInTheDocument();
        });
    });

    it('displays powered by section', () => {
        render(<ShadowAgentDemoPage />);
        expect(screen.getByText(/POWERED_BY/i)).toBeInTheDocument();
        const ashbornElements = screen.getAllByText(/ASHBORN/i);
        expect(ashbornElements.length).toBeGreaterThan(0);
    });
});
