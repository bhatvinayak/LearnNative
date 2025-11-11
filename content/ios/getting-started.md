---
title: Getting Started with iOS
description: Learn the basics of iOS development with Swift and SwiftUI
platform: ios
order: 1
---

# Getting Started with iOS

Welcome to iOS development! This guide will help you set up your environment and build your first SwiftUI app.

## Prerequisites

- macOS (required for iOS development)
- Xcode (latest version from Mac App Store)
- Apple Developer account (free tier is sufficient)

## Setting Up Xcode

Install Xcode from the Mac App Store and run it to complete the setup. Xcode includes everything you need: compiler, simulator, and interface builder.

```swift
// Your first SwiftUI View
struct Greeting: View {
    var name: String

    var body: some View {
        Text("Hello, \(name)!")
    }
}
```

## Understanding SwiftUI

SwiftUI is Apple's declarative framework for building UIs across all Apple platforms.

```swift
struct HelloWorldScreen: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Welcome to DevBridge!")
                .font(.title)
                .fontWeight(.bold)

            Button("Get Started") {
                // Handle action
            }
            .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}
```

:::compare-react-native
React Native equivalent:
```javascript
function HelloWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DevBridge!</Text>
      <View style={styles.spacer} />
      <Button title="Get Started" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  spacer: {
    height: 16,
  },
});
```
:::

## Next Steps

- Learn about @State and @Binding
- Explore SwiftUI's built-in components
- Build responsive layouts with stacks
