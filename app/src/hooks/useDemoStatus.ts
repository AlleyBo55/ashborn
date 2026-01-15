'use client';

import { useState, useCallback } from 'react';

export type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

export function useDemoStatus(initialStatus: DemoStatus = 'idle') {
    const [status, setStatus] = useState<DemoStatus>(initialStatus);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
    }, []);

    const setLoading = useCallback(() => setStatus('loading'), []);
    const setSuccess = useCallback(() => setStatus('success'), []);
    const setErrorState = useCallback((msg: string) => {
        setError(msg);
        setStatus('error');
    }, []);

    return {
        status,
        setStatus,
        error,
        setError,
        reset,
        setLoading,
        setSuccess,
        setErrorState,
        isIdle: status === 'idle',
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
    };
}
