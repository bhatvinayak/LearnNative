# LearnNative

**Learn Mobile Development, Bridge the Platforms**

LearnNative is an open-source documentation website that provides comprehensive learning guides for Android (Kotlin + Jetpack Compose), iOS (Swift + SwiftUI), and React Native. The unique feature of LearnNative is its cross-platform code comparisons, allowing developers to see equivalent implementations across all three platforms.

## Features

- 📚 **Comparable Content**: Learn one platform while seeing equivalent code in others
- 🎯 **Modern Stack**: Focus on current best practices (Compose, SwiftUI, React Native)
- 🌍 **Open Source**: MIT licensed, community-driven content
- 🔍 **Easy Navigation**: Search functionality, sidebar navigation, and dark/light mode
- 💡 **Cross-Platform Comparisons**: Special comparison blocks show equivalent code

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Content**: Markdown with gray-matter
- **Search**: Fuse.js for client-side search
- **Theme**: next-themes for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git https://github.com/bhatvinayak/LearnNative.git
cd LearnNative

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
LearnNative/
├── app/                    # Next.js app directory
│   ├── docs/              # Documentation pages
│   ├── contribute/        # Contribution guide
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── search-dialog.tsx # Search functionality
│   └── markdown-renderer.tsx # Markdown processing
├── content/              # Markdown lesson files
│   ├── android/         # Android (Kotlin) lessons
│   ├── ios/             # iOS (Swift) lessons
│   └── react-native/    # React Native lessons
├── lib/                 # Utility functions
│   └── content.ts       # Content parsing utilities
└── LICENSE              # MIT License
```

## Writing Lessons

Lessons are written in Markdown and stored in the `content/` directory. Each lesson includes frontmatter metadata and supports special comparison blocks.

### Lesson Template

```markdown
---
title: Your Lesson Title
description: Brief description of the lesson
platform: android
order: 1
---

# Your Lesson Title

Your lesson content here...

\`\`\`kotlin
// Code example
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
:::
```

### Comparison Blocks

Use these special blocks to show equivalent code across platforms:

- `:::compare-react-native` - For Android/iOS lessons
- `:::compare-android` - For React Native/iOS lessons
- `:::compare-ios` - For React Native/Android lessons

Always close comparison blocks with `:::`.

## Contributing

We welcome contributions! Here's how you can help:

1. **Add New Lessons**: Create markdown files in the appropriate platform directory
2. **Improve Existing Content**: Fix typos, clarify explanations, update code examples
3. **Add Comparisons**: Add comparison blocks to existing lessons
4. **Report Issues**: Open an issue for bugs or suggestions

See the [Contribution Guide](http://localhost:3000/contribute) for detailed instructions.

### Contribution Workflow

```bash
# Fork the repository and clone your fork
git clone https://github.com/bhatvinayak/LearnNative.git
cd LearnNative

# Create a new branch
git checkout -b my-new-lesson

# Make your changes
# Add your lesson to content/platform/lesson-name.md

# Test your changes
npm run dev

# Build to verify
npm run build

# Commit and push
git add .
git commit -m "Add lesson: Your Lesson Title"
git push origin my-new-lesson

# Open a pull request on GitHub
```

## Building for Production

```bash
npm run build
npm run start
```

The site uses static generation and can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Community

- **Issues**: Report bugs or suggest features on [GitHub Issues](https://github.com/bhatvinayak/LearnNative/issues)
- **Pull Requests**: Contribute code via [Pull Requests](https://github.com/bhatvinayak/LearnNative/pulls)

## Acknowledgments

Built with love for the mobile development community. Special thanks to all contributors who help make cross-platform learning accessible to everyone.

---

**Happy Learning! 🚀**
