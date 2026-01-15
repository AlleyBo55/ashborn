'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    speed: 300,
    minimum: 0.1,
});

export default function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    return null;
}

// Start NProgress on link clicks (before navigation begins)
if (typeof window !== 'undefined') {
    // Intercept all link clicks
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
            NProgress.start();
        }
    });
}
