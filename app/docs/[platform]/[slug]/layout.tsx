import { getLesson } from '@/lib/content';

export async function generateMetadata({
  params,
}: {
  params: { platform: string; slug: string };
}) {
  const lesson = getLesson(params.platform, params.slug);

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${lesson.title} | DevBridge`,
    description: lesson.description,
  };
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
