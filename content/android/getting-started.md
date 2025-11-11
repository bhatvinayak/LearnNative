---
title: Getting Started with Android
description: Learn the basics of Android development with Kotlin and Jetpack Compose
platform: android
order: 1
---

# Getting Started with Android

Welcome to Android development! In this guide, we'll set up your development environment and create your first app with Kotlin and Jetpack Compose.

## Prerequisites

- Android Studio (latest version)
- Basic knowledge of programming concepts
- A computer with at least 8GB RAM

## Setting Up Android Studio

Download and install Android Studio from the official website. The setup wizard will guide you through installing the necessary SDK components.

```kotlin
// Your first Compose function
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Understanding Jetpack Compose

Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development with declarative code.

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

:::compare-react-native
In React Native, the equivalent would be:
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

- Explore state management with `remember` and `mutableStateOf`
- Learn about Material Design 3 components
- Build interactive UIs with user input
