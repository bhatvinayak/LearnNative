---
title: State Management in Compose
description: Master state handling and reactive UI updates in Jetpack Compose
platform: android
order: 2
---

# State Management in Compose

State is any value that can change over time. In Jetpack Compose, state changes trigger UI recomposition.

## Basic State with remember

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

:::compare-react-native
React Native equivalent using useState:
```javascript
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
```
:::

## ViewModel for Complex State

For larger apps, use ViewModel to manage state:

```kotlin
class CounterViewModel : ViewModel() {
    private val _count = mutableStateOf(0)
    val count: State<Int> = _count

    fun increment() {
        _count.value++
    }
}

@Composable
fun CounterScreen(viewModel: CounterViewModel = viewModel()) {
    val count by viewModel.count

    Column {
        Text("Count: $count")
        Button(onClick = { viewModel.increment() }) {
            Text("Increment")
        }
    }
}
```

## State Hoisting

Lift state up to make composables stateless and reusable:

```kotlin
@Composable
fun StatefulCounter() {
    var count by remember { mutableStateOf(0) }
    StatelessCounter(count = count, onIncrement = { count++ })
}

@Composable
fun StatelessCounter(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
```
