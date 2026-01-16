import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NLPDemoPage from '../page';

global.fetch = jest.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('NLP Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders nlp demo page with terminal header', () => {
        render(<NLPDemoPage />);
        expect(screen.getByText(/SHADOW_WHISPER/i)).toBeInTheDocument();
        expect(screen.getByText(/AI_AGENT_PROTOCOL/i)).toBeInTheDocument();
    });

    it('displays initial AI message', () => {
        render(<NLPDemoPage />);
        expect(screen.getByText(/ASHBORN_AI_INITIALIZED/i)).toBeInTheDocument();
    });

    it('displays example commands', () => {
        render(<NLPDemoPage />);
        expect(screen.getByText(/Shield 5 SOL/)).toBeInTheDocument();
        expect(screen.getByText(/Prove my balance/)).toBeInTheDocument();
    });

    it('allows typing in input field', () => {
        render(<NLPDemoPage />);
        const input = screen.getByPlaceholderText(/type_command/i);
        fireEvent.change(input, { target: { value: 'Shield 5 SOL' } });
        expect(input).toHaveValue('Shield 5 SOL');
    });

    it('sends message to AI agent successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ reply: 'Shielding 5 SOL to privacy pool...' })
        });

        render(<NLPDemoPage />);
        const input = screen.getByPlaceholderText(/type_command/i);
        fireEvent.change(input, { target: { value: 'Shield 5 SOL' } });
        fireEvent.click(screen.getByText(/SEND/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.stringContaining('Shield 5 SOL')
            });
        });
    });

    it('handles AI agent error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false
        });

        render(<NLPDemoPage />);
        const input = screen.getByPlaceholderText(/type_command/i);
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(screen.getByText(/SEND/i));

        await waitFor(() => {
            expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
        });
    });

    it('clears input after sending', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ reply: 'response' })
        });

        render(<NLPDemoPage />);
        const input = screen.getByPlaceholderText(/type_command/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(screen.getByText(/SEND/i));

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });
});
