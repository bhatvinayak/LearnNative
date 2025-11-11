'use client';

import Link from 'next/link';
import { BookOpen, Github, Code2, Smartphone, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <span className="text-xl font-bold">LearnNative</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs/android/getting-started">
              <Button variant="ghost">Docs</Button>
            </Link>
            <a
              href="https://github.com/bhatvinayak/LearnNative.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Learn Mobile Development,
            <br />
            <span className="text-blue-600 dark:text-blue-400">Bridge the Platforms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Open-source learning guides for Android, iOS, and React Native.
            Compare code across platforms and master mobile development.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/docs/android/getting-started">
              <Button size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline">
                <Github className="h-4 w-4 mr-2" />
                Contribute
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/docs/android/getting-started" className="block">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                  <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Android</CardTitle>
                <CardDescription>Kotlin + Jetpack Compose</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build modern Android apps with Kotlin and declarative UI toolkit Jetpack Compose.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Explore guides →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/ios/getting-started" className="block">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                  <Apple className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>iOS</CardTitle>
                <CardDescription>Swift + SwiftUI</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create beautiful iOS apps using Swift and Apple's declarative SwiftUI framework.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Explore guides →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs/react-native/getting-started" className="block">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2">
                  <Code2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle>React Native</CardTitle>
                <CardDescription>JavaScript + React</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Write once, run anywhere. Build cross-platform apps with React Native.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Explore guides →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why LearnNative?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">📚 Comparable Content</h3>
              <p className="text-muted-foreground">
                Learn one platform while seeing equivalent code in others. Perfect for developers switching platforms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">🎯 Modern Stack</h3>
              <p className="text-muted-foreground">
                Focus on current best practices: Compose, SwiftUI, and React Native with TypeScript.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">🌍 Open Source</h3>
              <p className="text-muted-foreground">
                MIT licensed. Contribute lessons, fix errors, and help the community grow.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">🔍 Easy Navigation</h3>
              <p className="text-muted-foreground">
                Search, dark mode, and intuitive sidebar make learning smooth and efficient.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground">
            LearnNative is open source and MIT licensed.
            <br />
            Built with Next.js, Tailwind CSS, and love for mobile development.
          </p>
        </div>
      </main>
    </div>
  );
}
