'use client';

import { useReducer, useMemo } from 'react';

export type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

interface State {
    status: DemoStatus;
    error: string | null;
}

type Action =
    | { type: 'RESET' }
    | { type: 'LOADING' }
    | { type: 'SUCCESS' }
    | { type: 'ERROR'; payload: string };

const initialState: State = {
    status: 'idle',
    error: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'RESET': return initialState;
        case 'LOADING': return { ...state, status: 'loading', error: null };
        case 'SUCCESS': return { ...state, status: 'success', error: null };
        case 'ERROR': return { ...state, status: 'error', error: action.payload };
        default: return state;
    }
}

export function useDemoStatus() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handlers = useMemo(() => ({
        reset: () => dispatch({ type: 'RESET' }),
        setLoading: () => dispatch({ type: 'LOADING' }),
        setStatus: (status: DemoStatus) => {
            // Adapter for legacy setStatus calls if any remain, though direct methods preferred
            if (status === 'loading') dispatch({ type: 'LOADING' });
            else if (status === 'success') dispatch({ type: 'SUCCESS' });
            else if (status === 'idle') dispatch({ type: 'RESET' });
        },
        setSuccess: () => dispatch({ type: 'SUCCESS' }),
        setErrorState: (msg: string) => dispatch({ type: 'ERROR', payload: msg }),
    }), []);

    return {
        status: state.status,
        error: state.error,
        ...handlers,
        isIdle: state.status === 'idle',
        isLoading: state.status === 'loading',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
    };
}
