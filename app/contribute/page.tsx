'use client';

import Link from 'next/link';
import { ArrowLeft, Code2, Github, FileText, BookOpen, GitPullRequest } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ContributePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 " />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/docs/android/getting-started">
              <Button variant="ghost" size="sm">
                Docs
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Contribute to LearnNative</h1>
          <p className="text-xl text-muted-foreground">
            Help us build the best cross-platform mobile development learning resource.
            Everyone is welcome to contribute!
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                <Github className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Fork and clone the repository</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                LearnNative is an open-source project hosted on GitHub. To get started:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Fork the repository at https://github.com/bhatvinayak/LearnNative.git</li>
                <li>Clone your fork locally</li>
                <li>Create a new branch for your changes</li>
                <li>Make your changes and test them</li>
                <li>Submit a pull request</li>
              </ol>
              <pre className="mt-4 p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{`git clone https://github.com/bhatvinayak/LearnNative.git
cd LearnNative
git checkout -b my-new-lesson
npm install
npm run dev`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Writing Lessons</CardTitle>
              <CardDescription>Create markdown files in the content directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Lessons are written in Markdown and stored in the <code className="bg-muted px-1 py-0.5 rounded">content/</code> directory.
              </p>

              <div>
                <h4 className="font-semibold mb-2">File Structure:</h4>
                <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                  <code>{`content/
├── android/
│   ├── getting-started.md
│   └── state-management.md
├── ios/
│   ├── getting-started.md
│   └── state-management.md
└── react-native/
    ├── getting-started.md
    └── state-management.md`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Markdown Template:</h4>
                <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                  <code>{`---
title: Your Lesson Title
description: Brief description of the lesson
platform: android
order: 1
---

# Your Lesson Title

Lesson content here...

\`\`\`kotlin
// Code examples
fun example() {
    println("Hello LearnNative!")
}
\`\`\`

:::compare-react-native
React Native equivalent:
\`\`\`javascript
function example() {
  console.log("Hello LearnNative!");
}
\`\`\`
:::`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle>Comparison Blocks</CardTitle>
              <CardDescription>Help learners see equivalent code across platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Use comparison blocks to show how the same concept is implemented in other platforms:
              </p>

              <div>
                <h4 className="font-semibold mb-2">Available Comparisons:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><code className="bg-muted px-1 py-0.5 rounded">:::compare-react-native</code> - For Android/iOS lessons</li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">:::compare-android</code> - For React Native/iOS lessons</li>
                  <li><code className="bg-muted px-1 py-0.5 rounded">:::compare-ios</code> - For React Native/Android lessons</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Always close comparison blocks with <code className="bg-muted px-1 py-0.5 rounded">:::</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2">
                <GitPullRequest className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Contribution Guidelines</CardTitle>
              <CardDescription>Best practices for contributing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Write clear, concise lessons focused on one topic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Include comparison blocks to show equivalent code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Test code examples to ensure they work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Use proper markdown formatting and syntax highlighting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Follow existing lesson structure and naming conventions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Keep lessons platform-agnostic where possible</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>Ready to Contribute?</CardTitle>
              <CardDescription>Start making an impact today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Whether you're fixing typos, adding new lessons, or improving existing content,
                every contribution helps developers learn better.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/bhatvinayak/LearnNative.git"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
                <Link href="/docs/android/getting-started">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Lessons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Questions? Open an issue on GitHub or reach out to the community.
            <br />
            Thank you for helping make LearnNative better!
          </p>
        </div>
      </main>
    </div>
  );
}
