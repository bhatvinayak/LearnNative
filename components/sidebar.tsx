'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Smartphone, Apple, Code2 } from 'lucide-react';

interface SidebarItem {
  title: string;
  slug: string;
  order: number;
}

interface SidebarProps {
  platform: string;
  items: SidebarItem[];
}

const platformConfig = {
  android: {
    name: 'Android',
    icon: Smartphone,
    color: 'text-green-600 dark:text-green-400',
  },
  ios: {
    name: 'iOS',
    icon: Apple,
    color: 'text-blue-600 dark:text-blue-400',
  },
  'react-native': {
    name: 'React Native',
    icon: Code2,
    color: 'text-cyan-600 dark:text-cyan-400',
  },
};

export function Sidebar({ platform, items }: SidebarProps) {
  const pathname = usePathname();
  const config = platformConfig[platform as keyof typeof platformConfig];
  const Icon = config?.icon || Code2;

  return (
    <div className="w-64 border-r bg-muted/10 p-4 space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Icon className={cn('h-5 w-5', config?.color)} />
        <span className="font-semibold">{config?.name || platform}</span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const href = `/docs/${platform}/${item.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.slug}
              href={href}
              className={cn(
                'block px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t space-y-1">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase">
          Other Platforms
        </p>
        {Object.entries(platformConfig).map(([key, value]) => {
          if (key === platform) return null;
          const PlatformIcon = value.icon;
          return (
            <Link
              key={key}
              href={`/docs/${key}/getting-started`}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PlatformIcon className={cn('h-4 w-4', value.color)} />
              {value.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
