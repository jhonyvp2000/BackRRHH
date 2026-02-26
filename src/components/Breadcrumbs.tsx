'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { MENU_DATA } from '@/lib/menu-data';

// Helper to strip emojis for clean display
const cleanTitle = (title: string) => title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, '').trim();

type BreadcrumbItem = {
    label: string;
    href: string;
    isCurrent?: boolean;
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Do not render on home page (keeping existing behavior as requested)
    if (pathname === '/') return null;

    const breadcrumbs = useMemo(() => {
        const result: BreadcrumbItem[] = [];
        let found = false;

        // 1. Try to find the path in MENU_DATA
        for (const category of MENU_DATA) {
            // Check top-level links (like INICIO - though skipped by pathname check usually)
            if (category.type === 'link' && category.href === pathname) {
                // Usually we wouldn't show breadcrumbs for home, but if it was another link
                result.push({ label: cleanTitle(category.label), href: category.href || '/' });
                found = true;
                break;
            }

            // Check Mega Menu Columns
            if (category.columns) {
                for (const col of category.columns) {
                    const matchedItem = col.items.find((item) => item.href === pathname);
                    if (matchedItem) {
                        result.push({ label: cleanTitle(category.label), href: '#' }); // Category (non-clickable usually or specific landing)
                        result.push({ label: cleanTitle(col.title), href: '#' }); // Section
                        result.push({ label: matchedItem.title, href: matchedItem.href, isCurrent: true });
                        found = true;
                        break;
                    }
                }
            }

            // Check Dropdown Items
            if (category.items) {
                const matchedItem = category.items.find((item) => item.href === pathname);
                if (matchedItem) {
                    result.push({ label: cleanTitle(category.label), href: '#' });
                    result.push({ label: matchedItem.title, href: matchedItem.href, isCurrent: true });
                    found = true;
                    break;
                }
            }

            if (found) break;
        }

        // 2. Fallback / Deep Linking Logic
        // If not found exactly, or if it is a sub-page (e.g. /sala-de-prensa/noticias)
        if (!found) {
            // Find the closest parent in menu
            let parentMatch: { label: string, href: string, category: string, section?: string } | null = null;
            let longestMatchLen = 0;

            for (const category of MENU_DATA) {
                if (category.columns) {
                    for (const col of category.columns) {
                        for (const item of col.items) {
                            if (pathname.startsWith(item.href) && item.href !== '/' && item.href.length > longestMatchLen) {
                                parentMatch = { label: item.title, href: item.href, category: category.label, section: col.title };
                                longestMatchLen = item.href.length;
                            }
                        }
                    }
                }
                if (category.items) {
                    for (const item of category.items) {
                        if (pathname.startsWith(item.href) && item.href !== '/' && item.href.length > longestMatchLen) {
                            parentMatch = { label: item.title, href: item.href, category: category.label };
                            longestMatchLen = item.href.length;
                        }
                    }
                }
            }

            if (parentMatch) {
                result.push({ label: cleanTitle(parentMatch.category), href: '#' });
                if (parentMatch.section) result.push({ label: cleanTitle(parentMatch.section), href: '#' });
                result.push({ label: parentMatch.label, href: parentMatch.href });

                // Add remaining segments
                const remainingPath = pathname.replace(parentMatch.href, '');
                const segments = remainingPath.split('/').filter(Boolean);

                let currentPath = parentMatch.href;
                segments.forEach((seg, idx) => {
                    currentPath += `/${seg}`;
                    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                    result.push({
                        label,
                        href: currentPath,
                        isCurrent: idx === segments.length - 1
                    });
                });
            } else {
                // Total Fallback (standard URL parsing)
                const segments = pathname.split('/').filter(Boolean);
                segments.forEach((seg, idx) => {
                    const href = `/${segments.slice(0, idx + 1).join('/')}`;
                    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                    result.push({
                        label,
                        href,
                        isCurrent: idx === segments.length - 1
                    });
                });
            }
        }

        return result;
    }, [pathname]);

    return (
        <div className="bg-gray-50 border-b border-gray-100 py-3">
            <div className="container mx-auto max-w-7xl px-4">
                <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
                    {/* Removed "Inicio" link as requested in Smart Breadcrumbs proposal */}

                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <React.Fragment key={index}>
                                {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-300 flex-shrink-0" />}

                                {crumb.href === '#' || isLast ? (
                                    <span className={`
                                       ${isLast ? 'font-semibold text-hospital-blue' : 'text-gray-500'}
                                   `}>
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-hospital-blue transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
