import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  platform: string;
  order: number;
  content: string;
}

export interface SidebarItem {
  title: string;
  slug: string;
  order: number;
}

const contentDirectory = path.join(process.cwd(), 'content');

export function getAllLessons(platform: string): Lesson[] {
  const platformDir = path.join(contentDirectory, platform);

  if (!fs.existsSync(platformDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(platformDir);
  const lessons = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(platformDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        platform: data.platform || platform,
        order: data.order || 999,
        content,
      };
    });

  return lessons.sort((a, b) => a.order - b.order);
}

export function getLesson(platform: string, slug: string): Lesson | null {
  try {
    const fullPath = path.join(contentDirectory, platform, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      platform: data.platform || platform,
      order: data.order || 999,
      content,
    };
  } catch {
    return null;
  }
}

export function getSidebarItems(platform: string): SidebarItem[] {
  const lessons = getAllLessons(platform);
  return lessons.map((lesson) => ({
    title: lesson.title,
    slug: lesson.slug,
    order: lesson.order,
  }));
}

export function getAllPlatforms(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
