---
title: State Management in React Native
description: Master state handling with hooks and context in React Native
platform: react-native
order: 2
---

# State Management in React Native

React Native uses React hooks for managing component state and side effects.

## Basic State with useState

```javascript
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <View style={styles.spacer} />
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  text: { fontSize: 24 },
  spacer: { height: 8 },
});
```

:::compare-android
Kotlin + Compose equivalent:
```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Count: $count", fontSize = 24.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```
:::

:::compare-ios
Swift + SwiftUI equivalent:
```swift
struct Counter: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 8) {
            Text("Count: \(count)")
                .font(.title)

            Button("Increment") {
                count += 1
            }
        }
        .padding()
    }
}
```
:::

## Context API for Global State

```javascript
import { createContext, useContext, useState } from 'react';

const CountContext = createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
}

function Counter() {
  const { count, setCount } = useContext(CountContext);

  return (
    <Button
      title={`Count: ${count}`}
      onPress={() => setCount(count + 1)}
    />
  );
}
```

## Lifting State Up

```javascript
function StatefulCounter() {
  const [count, setCount] = useState(0);
  return <StatelessCounter count={count} onIncrement={() => setCount(count + 1)} />;
}

function StatelessCounter({ count, onIncrement }) {
  return <Button title={`Count: ${count}`} onPress={onIncrement} />;
}
```
