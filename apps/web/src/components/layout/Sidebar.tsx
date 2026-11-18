'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/nav';
import { useUnreadCount } from '@/hooks/useUnreadCount';

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const unread = useUnreadCount();
  const isActive = (href: string) => (href === '/portal' || href === '/clinician' ? pathname === href : pathname.startsWith(href));
  return (
    <aside className="tw-sidebar">
      <Link href="/" className="tw-sidebar__brand">
        Truewell
      </Link>
      <nav aria-label="Primary" className="tw-nav">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
            <span>{item.label}</span>
            {item.label.match(/messages|inbox/i) && unread > 0 ? <span aria-label={`${unread} unread`}>{unread}</span> : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
