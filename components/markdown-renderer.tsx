'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = React.useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{processedContent}</div>;
}

function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';
  let inCompareBlock = false;
  let compareContent: string[] = [];
  let compareTitle = '';

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(':::compare-')) {
      inCompareBlock = true;
      compareTitle = line.replace(':::compare-', '').trim();
      compareContent = [];
      i++;
      continue;
    }

    if (line === ':::' && inCompareBlock) {
      inCompareBlock = false;
      elements.push(
        <CompareBlock key={`compare-${i}`} title={compareTitle} content={compareContent.join('\n')} />
      );
      compareContent = [];
      i++;
      continue;
    }

    if (inCompareBlock) {
      compareContent.push(line);
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        elements.push(
          <CodeBlock key={`code-${i}`} language={codeLanguage} code={codeContent.join('\n')} />
        );
        codeContent = [];
        codeLanguage = '';
      } else {
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim();
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-4xl font-bold mt-8 mb-4">
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-3xl font-semibold mt-6 mb-3">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-2xl font-semibold mt-4 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].replace('- ', ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside my-4 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} className="h-2" />);
    } else if (line.startsWith('---')) {
      i++;
      continue;
    } else {
      elements.push(
        <p key={`p-${i}`} className="my-3 leading-7">
          {line}
        </p>
      );
    }

    i++;
  }

  return elements;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-6 rounded-lg border bg-muted/50 overflow-hidden">
      {language && (
        <div className="px-4 py-2 bg-muted text-xs font-mono text-muted-foreground border-b">
          {language}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={cn('text-sm font-mono', language && `language-${language}`)}>{code}</code>
      </pre>
    </div>
  );
}

function CompareBlock({ title, content }: { title: string; content: string }) {
  const platformName = title === 'react-native' ? 'React Native' : title === 'android' ? 'Android (Kotlin)' : 'iOS (Swift)';

  return (
    <Alert className="my-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-900 dark:text-blue-100 capitalize">
        Compare with {platformName}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {parseMarkdown(content)}
        </div>
      </AlertDescription>
    </Alert>
  );
}
