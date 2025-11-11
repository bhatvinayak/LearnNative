---
title: State Management in SwiftUI
description: Master state handling and reactive UI updates in SwiftUI
platform: ios
order: 2
---

# State Management in SwiftUI

SwiftUI uses property wrappers to manage state and trigger view updates automatically.

## Basic State with @State

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

:::compare-react-native
React Native equivalent:
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

## ObservableObject for Complex State

For app-wide state, use ObservableObject:

```swift
class CounterViewModel: ObservableObject {
    @Published var count = 0

    func increment() {
        count += 1
    }
}

struct CounterScreen: View {
    @StateObject private var viewModel = CounterViewModel()

    var body: some View {
        VStack {
            Text("Count: \(viewModel.count)")
            Button("Increment") {
                viewModel.increment()
            }
        }
    }
}
```

## Binding for Two-Way Data Flow

```swift
struct StatefulCounter: View {
    @State private var count = 0

    var body: some View {
        StatelessCounter(count: $count)
    }
}

struct StatelessCounter: View {
    @Binding var count: Int

    var body: some View {
        Button("Count: \(count)") {
            count += 1
        }
    }
}
```
