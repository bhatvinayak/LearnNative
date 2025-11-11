import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLesson, getAllLessons } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  const platforms = ['android', 'ios', 'react-native'];
  const params: { platform: string; slug: string }[] = [];

  platforms.forEach((platform) => {
    const lessons = getAllLessons(platform);
    lessons.forEach((lesson) => {
      params.push({
        platform,
        slug: lesson.slug,
      });
    });
  });

  return params;
}

export default function LessonPage({
  params,
}: {
  params: { platform: string; slug: string };
}) {
  const lesson = getLesson(params.platform, params.slug);

  if (!lesson) {
    notFound();
  }

  const allLessons = getAllLessons(params.platform);
  const currentIndex = allLessons.findIndex((l) => l.slug === params.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-xl text-muted-foreground">{lesson.description}</p>
      </div>

      <div className="mb-12">
        <MarkdownRenderer content={lesson.content} />
      </div>

      <div className="flex items-center justify-between pt-8 border-t">
        {prevLesson ? (
          <Link href={`/docs/${params.platform}/${prevLesson.slug}`}>
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/docs/${params.platform}/${nextLesson.slug}`}>
            <Button variant="outline">
              {nextLesson.title}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
