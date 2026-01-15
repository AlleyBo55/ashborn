import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShieldDemoPage from './page';
import '@testing-library/jest-dom';

// Mocks
jest.mock('@/hooks/useAshborn', () => ({
    useAshborn: jest.fn()
}));

jest.mock('@/hooks/useDemoStatus', () => ({
    useDemoStatus: jest.fn()
}));

jest.mock('@solana/wallet-adapter-react', () => ({
    useWallet: jest.fn(),
    useConnection: () => ({ connection: {} })
}));

// Mock HugeIcons to avoid rendering issues
jest.mock('hugeicons-react', () => ({
    Shield02Icon: () => <div data-testid="icon-shield" />,
    Lock01Icon: () => <div data-testid="icon-lock" />,
    ViewIcon: () => <div data-testid="icon-view" />,
    ViewOffIcon: () => <div data-testid="icon-view-off" />,
    ArrowRight01Icon: () => <div data-testid="icon-arrow-right" />,
    CheckmarkCircle01Icon: () => <div data-testid="icon-checkmark" />,
    Loading03Icon: () => <div data-testid="icon-loading" />,
    Copy01Icon: () => <div data-testid="icon-copy" />,
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
        button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
        span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { useAshborn } from '@/hooks/useAshborn';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useWallet } from '@solana/wallet-adapter-react';

describe('ShieldDemoPage', () => {
    const mockUseAshborn = useAshborn as jest.Mock;
    const mockUseDemoStatus = useDemoStatus as jest.Mock;
    const mockUseWallet = useWallet as jest.Mock;

    const mockRunStep = jest.fn();
    const mockSetStatus = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAshborn.mockReturnValue({
            ashborn: {
                shield: jest.fn().mockResolvedValue('mock-tx-signature')
            }
        });

        mockUseDemoStatus.mockReturnValue({
            status: 'idle',
            isLoading: false,
            isSuccess: false,
            isError: false,
            error: null,
            step: 'idle',
            runStep: mockRunStep,
            setStatus: mockSetStatus,
            reset: jest.fn(),
        });

        mockUseWallet.mockReturnValue({
            connected: false,
            publicKey: null
        });
    });

    it('renders specific text content correctly', () => {
        render(<ShieldDemoPage />);
        expect(screen.getByText('Shield SOL')).toBeInTheDocument();
    });

    it('shows connect wallet message when not connected', () => {
        render(<ShieldDemoPage />);
        expect(screen.getByText('Connect wallet to shield funds')).toBeInTheDocument();
    });

    it('shows shield button when connected', () => {
        mockUseWallet.mockReturnValue({
            connected: true,
            publicKey: { toBase58: () => 'mock-pubkey' }
        });

        render(<ShieldDemoPage />);
        expect(screen.getByRole('button', { name: /Shield Funds/i })).toBeInTheDocument();
    });

    it('calls runShieldDemo when button is clicked', async () => {
        mockUseWallet.mockReturnValue({
            connected: true,
            publicKey: { toBase58: () => 'mock-pubkey' }
        });

        render(<ShieldDemoPage />);

        const button = screen.getByRole('button', { name: /Shield Funds/i });
        fireEvent.click(button);

        expect(mockSetStatus).toHaveBeenCalledWith('loading');
    });
});
