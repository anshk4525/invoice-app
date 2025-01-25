"use client";

import { cn } from '@/lib/utils';
import { HomeIcon, Users2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const dashboardlinks = [
  {
    id: 0,
    name: 'Dashboard',
    link: '/dashboard',
    icon: HomeIcon,
  },
  {
    id: 1,
    name: 'Invoices',
    link: '/dashboard/invoices',
    icon: Users2,
  },
];

const Dashboardlinks = () => {
  const pathname = usePathname();

  return (
    <>
      {dashboardlinks.map((link) => (
        <Link
          className={cn(
            pathname === link.link
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground',
              "flex items-center gap-3 rounded-lg py-2 px-3 transition-all hover:text-primary"
          )}
          href={link.link}
          key={link.id}
        >
          <link.icon className="h-4 w-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default Dashboardlinks;
