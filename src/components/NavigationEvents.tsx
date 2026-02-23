'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFileStore } from '@/store/useFileStore';

export function NavigationEvents() {
    const pathname = usePathname();
    const clearFiles = useFileStore((state) => state.clearFiles);

    useEffect(() => {
        // Clear files whenever the path changes
        clearFiles();
    }, [pathname, clearFiles]);

    return null;
}
