import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProveDemoPage from '../page';

global.fetch = jest.fn();

describe('Prove Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders prove demo page with terminal header', () => {
        render(<ProveDemoPage />);
        expect(screen.getByText(/COMPLIANCE_SEAL/i)).toBeInTheDocument();
        expect(screen.getByText(/ZK_RANGE_PROOF/i)).toBeInTheDocument();
    });

    it('displays range proof protocol info', () => {
        render(<ProveDemoPage />);
        expect(screen.getByText(/RANGE_PROOF_PROTOCOL/i)).toBeInTheDocument();
    });

    it('has default min and max values', () => {
        render(<ProveDemoPage />);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    });

    it('allows changing min and max values', () => {
        render(<ProveDemoPage />);
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '100' } });
        fireEvent.change(inputs[1], { target: { value: '5000' } });
        expect(inputs[0]).toHaveValue(100);
        expect(inputs[1]).toHaveValue(5000);
    });

    it('generates ZK proof successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, proof: 'groth16_proof_abc123' })
        });

        render(<ProveDemoPage />);
        fireEvent.click(screen.getByText(/GENERATE_PROOF/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/ashborn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.stringContaining('prove')
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/VERIFIED/i)).toBeInTheDocument();
        });
    });

    it('displays revealed and hidden information', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, proof: 'proof' })
        });

        render(<ProveDemoPage />);
        fireEvent.click(screen.getByText(/GENERATE_PROOF/i));

        await waitFor(() => {
            expect(screen.getByText(/REVEALED/i)).toBeInTheDocument();
            expect(screen.getByText(/HIDDEN/i)).toBeInTheDocument();
        });
    });
});
