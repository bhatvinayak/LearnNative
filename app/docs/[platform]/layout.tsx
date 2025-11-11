import Link from 'next/link';
import { Code2, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchDialog } from '@/components/search-dialog';
import { getSidebarItems, getAllLessons, getAllPlatforms } from '@/lib/content';
import { MobileNav } from '@/components/mobile-nav';

export default function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { platform: string };
}) {
  const sidebarItems = getSidebarItems(params.platform);

  const allPlatforms = getAllPlatforms();
  const allLessons = allPlatforms.flatMap((platform) =>
    getAllLessons(platform).map((lesson) => ({
      title: lesson.title,
      description: lesson.description,
      platform: lesson.platform,
      slug: lesson.slug,
    }))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <MobileNav platform={params.platform} items={sidebarItems} />
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              <span className="font-bold">LearnNative</span>
            </Link>
            <div className="hidden md:block">
              <SearchDialog lessons={allLessons} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SearchDialog lessons={allLessons} />
            </div>
            <a
              href="https://github.com/bhatvinayak/LearnNative.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <Sidebar platform={params.platform} items={sidebarItems} />
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
