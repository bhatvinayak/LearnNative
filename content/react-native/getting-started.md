---
title: Getting Started with React Native
description: Learn the basics of cross-platform development with React Native
platform: react-native
order: 1
---

# Getting Started with React Native

React Native lets you build mobile apps using React and JavaScript/TypeScript. Write once, run on both iOS and Android.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- iOS: macOS with Xcode
- Android: Android Studio

## Setting Up Your Environment

Install React Native CLI and create a new project:

```bash
npx react-native init DevBridgeApp
cd DevBridgeApp
npm start
```

## Your First Component

```javascript
function Greeting({ name }) {
  return <Text>Hello, {name}!</Text>;
}
```

## Building a Screen

```javascript
import { View, Text, Button, StyleSheet } from 'react-native';

function HelloWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DevBridge!</Text>
      <View style={styles.spacer} />
      <Button title="Get Started" onPress={() => console.log('Pressed')} />
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

:::compare-android
Kotlin + Jetpack Compose equivalent:
```kotlin
@Composable
fun HelloWorldScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Welcome to DevBridge!",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { /* Handle click */ }) {
            Text("Get Started")
        }
    }
}
```
:::

:::compare-ios
Swift + SwiftUI equivalent:
```swift
struct HelloWorldScreen: View {
    var body: some View {
        VStack(spacing: 16) {
            Text("Welcome to DevBridge!")
                .font(.title)
                .fontWeight(.bold)

            Button("Get Started") {
                print("Pressed")
            }
            .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}
```
:::

## Next Steps

- Learn about useState and useEffect hooks
- Explore React Navigation for routing
- Build cross-platform UIs with platform-specific code
