'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResult {
  title: string;
  description: string;
  platform: string;
  slug: string;
}

interface SearchDialogProps {
  lessons: SearchResult[];
  isIconOnly?: boolean;
}

export function SearchDialog({ lessons, isIconOnly }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  const fuse = React.useMemo(
    () =>
      new Fuse(lessons, {
        keys: ['title', 'description', 'platform'],
        threshold: 0.3,
      }),
    [lessons]
  );

  const results = React.useMemo(() => {
    if (!query) return lessons.slice(0, 8);
    return fuse.search(query).map((result) => result.item).slice(0, 8);
  }, [query, fuse, lessons]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (platform: string, slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/docs/${platform}/${slug}`);
  };

  return (
    <>
      {isIconOnly ? (
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="relative hidden w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 md:flex"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search lessons...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Lessons</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search for lessons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={`${result.platform}-${result.slug}`}
                    onClick={() => handleSelect(result.platform, result.slug)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 capitalize">
                      {result.platform.replace('-', ' ')}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No results found.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
