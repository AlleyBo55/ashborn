import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShieldDemoPage from '../page';

global.fetch = jest.fn();

describe('Shield Demo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders without crashing', () => {
        const { container } = render(<ShieldDemoPage />);
        expect(container).toBeInTheDocument();
    });

    it('has execute button', () => {
        render(<ShieldDemoPage />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('has amount input field', () => {
        render(<ShieldDemoPage />);
        const input = screen.getByDisplayValue('0.01');
        expect(input).toBeInTheDocument();
    });

    it('allows changing amount', () => {
        render(<ShieldDemoPage />);
        const input = screen.getByDisplayValue('0.01');
        fireEvent.change(input, { target: { value: '0.5' } });
        expect(input).toHaveValue(0.5);
    });

    it('calls API on button click', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, signature: 'sig' })
        });

        render(<ShieldDemoPage />);
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });
});
