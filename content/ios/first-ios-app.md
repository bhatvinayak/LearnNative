---
title: Your First iOS App
description: Build a complete interactive iOS app, understand the view lifecycle, and add functionality
platform: ios
order: 4
---

# Your First iOS App

Let's build your first interactive iOS app! We'll start with a simple counter app and then add more functionality to make it interesting.

## Creating the Project

1. Open Xcode
2. **File** → **New** → **Project**
3. Select **iOS** → **App**
4. Configure:
   ```
   Product Name: CounterApp
   Team: Your name
   Organization Identifier: com.yourname
   Interface: SwiftUI
   Language: Swift
   ```
5. Click **Create**

## Understanding SwiftUI View Lifecycle

```
View Lifecycle:
────────────────────────────────────
onAppear()      → View appears on screen
  ↓
Body renders    → UI displays
  ↓
User interacts  → State changes
  ↓
Body re-renders → UI updates
  ↓
onDisappear()   → View leaves screen
```

:::compare-android
Android Activity/Fragment lifecycle:
```
onCreate() → onStart() → onResume()
  ↓
Running (User interacts)
  ↓
onPause() → onStop() → onDestroy()
```
:::compare-react-native
React component lifecycle:
```javascript
useEffect(() => {
    // componentDidMount
    return () => {
        // componentWillUnmount
    };
}, []);
```
SwiftUI's lifecycle is more automatic than Android's, similar to React hooks.
:::

## Basic Counter App

### Step 1: Simple Counter

```swift
// ContentView.swift
import SwiftUI

struct ContentView: View {
    // State variable - changes trigger UI updates
    @State private var counter = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Counter App")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("\(counter)")
                .font(.system(size: 72))
                .fontWeight(.bold)
                .foregroundColor(.blue)
            
            Button("Increment") {
                counter += 1
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```

:::compare-android
Android equivalent (Kotlin + Jetpack Compose):
```kotlin
@Composable
fun CounterScreen() {
    var counter by remember { mutableStateOf(0) }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text("Counter App", fontSize = 32.sp, fontWeight = FontWeight.Bold)
        Text("$counter", fontSize = 72.sp, color = Color.Blue)
        Button(onClick = { counter++ }) {
            Text("Increment")
        }
    }
}
```
SwiftUI and Jetpack Compose have very similar declarative syntax.
:::

### Step 2: Add More Buttons

```swift
struct ContentView: View {
    @State private var counter = 0
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Counter App")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            // Counter display
            Text("\(counter)")
                .font(.system(size: 72))
                .fontWeight(.bold)
                .foregroundColor(counter >= 0 ? .blue : .red)
                .padding()
                .background(
                    Circle()
                        .fill(Color.blue.opacity(0.1))
                        .frame(width: 150, height: 150)
                )
            
            // Button row
            HStack(spacing: 20) {
                Button {
                    counter -= 1
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.red)
                
                Button {
                    counter = 0
                } label: {
                    Image(systemName: "arrow.counterclockwise.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.orange)
                
                Button {
                    counter += 1
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.green)
            }
            
            // Stats
            VStack(spacing: 10) {
                Text("Total Taps: \(abs(counter))")
                    .font(.headline)
                Text(counter > 0 ? "Positive +" : counter < 0 ? "Negative -" : "Neutral")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(10)
        }
        .padding()
    }
}
```

### Step 3: Add Animation

```swift
struct ContentView: View {
    @State private var counter = 0
    @State private var showAlert = false
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Counter App")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            // Animated counter
            Text("\(counter)")
                .font(.system(size: 72))
                .fontWeight(.bold)
                .foregroundColor(counter >= 0 ? .blue : .red)
                .padding()
                .background(
                    Circle()
                        .fill(Color.blue.opacity(0.1))
                        .frame(width: 150, height: 150)
                )
                .scaleEffect(counter == 0 ? 1.0 : 1.1)
                .animation(.spring(response: 0.3), value: counter)
            
            // Buttons
            HStack(spacing: 20) {
                Button {
                    withAnimation {
                        counter -= 1
                    }
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.red)
                
                Button {
                    withAnimation {
                        counter = 0
                    }
                } label: {
                    Image(systemName: "arrow.counterclockwise.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.orange)
                
                Button {
                    withAnimation {
                        counter += 1
                    }
                    // Show alert at milestones
                    if counter == 10 || counter == 50 || counter == 100 {
                        showAlert = true
                    }
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 44))
                }
                .foregroundColor(.green)
            }
            
            // Stats
            VStack(spacing: 10) {
                Text("Total Taps: \(abs(counter))")
                    .font(.headline)
                Text(statusText)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(10)
        }
        .padding()
        .alert("Milestone Reached! 🎉", isPresented: $showAlert) {
            Button("Continue", role: .cancel) { }
        } message: {
            Text("You've reached \(counter) taps!")
        }
    }
    
    private var statusText: String {
        switch counter {
        case ..<0: return "Negative -"
        case 0: return "Neutral"
        case 1...10: return "Getting started!"
        case 11...50: return "Keep going!"
        default: return "Amazing! ⭐"
        }
    }
}
```

## State Management

### @State - Local State

```swift
struct CounterView: View {
    @State private var count = 0  // Local to this view
    
    var body: some View {
        VStack {
            Text("\(count)")
            Button("Increment") { count += 1 }
        }
    }
}
```

### @Binding - Shared State

```swift
struct ParentView: View {
    @State private var sharedCount = 0
    
    var body: some View {
        VStack {
            Text("Parent Count: \(sharedCount)")
            ChildView(count: $sharedCount)  // Pass binding
        }
    }
}

struct ChildView: View {
    @Binding var count: Int  // Receives binding
    
    var body: some View {
        Button("Increment") {
            count += 1  // Modifies parent's state
        }
    }
}
```

### @Observable - Shared ViewModel (iOS 17+)

```swift
@Observable
class CounterViewModel {
    var count = 0
    var history: [Int] = []
    
    func increment() {
        count += 1
        history.append(count)
    }
    
    func decrement() {
        count -= 1
        history.append(count)
    }
    
    func reset() {
        count = 0
        history.removeAll()
    }
}

struct ContentView: View {
    @State private var viewModel = CounterViewModel()
    
    var body: some View {
        VStack {
            Text("\(viewModel.count)")
            
            HStack {
                Button("−") { viewModel.decrement() }
                Button("Reset") { viewModel.reset() }
                Button("+") { viewModel.increment() }
            }
            
            List(viewModel.history, id: \.self) { value in
                Text("Count was: \(value)")
            }
        }
    }
}
```

:::compare-android
Android ViewModel:
```kotlin
class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()
    
    fun increment() {
        _count.value++
    }
}

// In Composable
val viewModel: CounterViewModel = viewModel()
val count by viewModel.count.collectAsState()
```
Both use ViewModel pattern for shared state, but iOS 17's @Observable is simpler than Android's StateFlow.
:::

## Building a Todo App

Let's create a more complex app:

```swift
// Models/Todo.swift
struct Todo: Identifiable {
    let id = UUID()
    var title: String
    var isCompleted: Bool = false
    var createdAt = Date()
}

// ViewModels/TodoViewModel.swift
@Observable
class TodoViewModel {
    var todos: [Todo] = []
    var newTodoTitle = ""
    
    var incompleteTodos: [Todo] {
        todos.filter { !$0.isCompleted }
    }
    
    var completedTodos: [Todo] {
        todos.filter { $0.isCompleted }
    }
    
    func addTodo() {
        guard !newTodoTitle.isEmpty else { return }
        
        let todo = Todo(title: newTodoTitle)
        todos.append(todo)
        newTodoTitle = ""
    }
    
    func toggleComplete(_ todo: Todo) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].isCompleted.toggle()
        }
    }
    
    func delete(_ todo: Todo) {
        todos.removeAll { $0.id == todo.id }
    }
    
    func deleteCompleted() {
        todos.removeAll { $0.isCompleted }
    }
}

// Views/ContentView.swift
struct ContentView: View {
    @State private var viewModel = TodoViewModel()
    
    var body: some View {
        NavigationStack {
            VStack {
                // Input section
                HStack {
                    TextField("New todo...", text: $viewModel.newTodoTitle)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit {
                            viewModel.addTodo()
                        }
                    
                    Button {
                        viewModel.addTodo()
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                    }
                    .disabled(viewModel.newTodoTitle.isEmpty)
                }
                .padding()
                
                // Todo list
                List {
                    if !viewModel.incompleteTodos.isEmpty {
                        Section("Active") {
                            ForEach(viewModel.incompleteTodos) { todo in
                                TodoRow(todo: todo) {
                                    viewModel.toggleComplete(todo)
                                }
                            }
                            .onDelete { indexSet in
                                indexSet.forEach { index in
                                    viewModel.delete(viewModel.incompleteTodos[index])
                                }
                            }
                        }
                    }
                    
                    if !viewModel.completedTodos.isEmpty {
                        Section("Completed") {
                            ForEach(viewModel.completedTodos) { todo in
                                TodoRow(todo: todo) {
                                    viewModel.toggleComplete(todo)
                                }
                            }
                            .onDelete { indexSet in
                                indexSet.forEach { index in
                                    viewModel.delete(viewModel.completedTodos[index])
                                }
                            }
                        }
                    }
                    
                    if viewModel.todos.isEmpty {
                        ContentUnavailableView(
                            "No Todos",
                            systemImage: "checkmark.circle",
                            description: Text("Add a todo to get started")
                        )
                    }
                }
                .listStyle(.insetGrouped)
            }
            .navigationTitle("My Todos")
            .toolbar {
                if !viewModel.completedTodos.isEmpty {
                    Button("Clear Completed") {
                        viewModel.deleteCompleted()
                    }
                }
            }
        }
    }
}

// Views/TodoRow.swift
struct TodoRow: View {
    let todo: Todo
    let onToggle: () -> Void
    
    var body: some View {
        HStack {
            Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                .foregroundColor(todo.isCompleted ? .green : .gray)
                .font(.title2)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(todo.title)
                    .strikethrough(todo.isCompleted)
                    .foregroundColor(todo.isCompleted ? .secondary : .primary)
                
                Text(todo.createdAt, style: .relative)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            onToggle()
        }
    }
}
```

## Navigation

### NavigationStack (iOS 16+)

```swift
struct ContentView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink("Profile") {
                    ProfileView()
                }
                
                NavigationLink("Settings") {
                    SettingsView()
                }
                
                NavigationLink("About") {
                    AboutView()
                }
            }
            .navigationTitle("Home")
        }
    }
}

struct ProfileView: View {
    var body: some View {
        Text("Profile Screen")
            .navigationTitle("Profile")
    }
}
```

### Programmatic Navigation

```swift
struct ContentView: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            VStack {
                Button("Go to Detail") {
                    path.append("Detail")
                }
                
                Button("Go to Settings") {
                    path.append("Settings")
                }
                
                Button("Go Back to Root") {
                    path = NavigationPath()
                }
            }
            .navigationDestination(for: String.self) { value in
                switch value {
                case "Detail":
                    DetailView()
                case "Settings":
                    SettingsView()
                default:
                    Text("Unknown destination")
                }
            }
            .navigationTitle("Home")
        }
    }
}
```

:::compare-android
Android Navigation:
```kotlin
// Using Navigation Component
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen(navController) }
    composable("detail") { DetailScreen() }
}

// Navigate
navController.navigate("detail")

// Pop back
navController.popBackStack()
```
Both provide type-safe navigation with back stack management.
:::

## User Input

```swift
struct FormView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var age = 0
    @State private var agreedToTerms = false
    @State private var selectedColor = "Red"
    
    let colors = ["Red", "Green", "Blue", "Yellow"]
    
    var body: some View {
        Form {
            Section("Personal Info") {
                TextField("Name", text: $name)
                TextField("Email", text: $email)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                
                Stepper("Age: \(age)", value: $age, in: 0...120)
            }
            
            Section("Preferences") {
                Picker("Favorite Color", selection: $selectedColor) {
                    ForEach(colors, id: \.self) { color in
                        Text(color).tag(color)
                    }
                }
                
                Toggle("Agree to Terms", isOn: $agreedToTerms)
            }
            
            Section {
                Button("Submit") {
                    submitForm()
                }
                .disabled(!agreedToTerms || name.isEmpty)
            }
        }
        .navigationTitle("Sign Up")
    }
    
    func submitForm() {
        print("Name: \(name)")
        print("Email: \(email)")
        print("Age: \(age)")
        print("Color: \(selectedColor)")
    }
}
```

## Key Takeaways

✅ **@State** manages local view state  
✅ **@Binding** shares state between views  
✅ **@Observable** creates shared view models  
✅ **NavigationStack** handles navigation  
✅ **List** displays scrollable collections  
✅ **Form** groups input elements  
✅ **Animations** enhance user experience  
✅ **Modifiers** customize view appearance  

## Common Patterns

### 1. Loading State

```swift
struct ContentView: View {
    @State private var isLoading = false
    @State private var data: [String] = []
    
    var body: some View {
        VStack {
            if isLoading {
                ProgressView()
            } else {
                List(data, id: \.self) { item in
                    Text(item)
                }
            }
        }
        .task {
            await loadData()
        }
    }
    
    func loadData() async {
        isLoading = true
        // Simulate network call
        try? await Task.sleep(for: .seconds(2))
        data = ["Item 1", "Item 2", "Item 3"]
        isLoading = false
    }
}
```

### 2. Alert Dialog

```swift
struct ContentView: View {
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        Button("Show Alert") {
            alertMessage = "This is an alert!"
            showAlert = true
        }
        .alert("Alert Title", isPresented: $showAlert) {
            Button("OK", role: .cancel) { }
            Button("Delete", role: .destructive) {
                // Handle destructive action
            }
        } message: {
            Text(alertMessage)
        }
    }
}
```

### 3. Sheet Modal

```swift
struct ContentView: View {
    @State private var showSheet = false
    
    var body: some View {
        Button("Show Sheet") {
            showSheet = true
        }
        .sheet(isPresented: $showSheet) {
            SheetView()
        }
    }
}

struct SheetView: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            Text("Sheet Content")
                .navigationTitle("Sheet")
                .toolbar {
                    Button("Done") {
                        dismiss()
                    }
                }
        }
    }
}
```

## Practice Exercise

Enhance the Todo app with:
1. Edit todo functionality
2. Due dates for todos
3. Categories/tags
4. Search functionality
5. Persistent storage (UserDefaults)
6. Custom color themes

## Next Steps

Now that you understand basic iOS app structure and SwiftUI, let's dive into Swift fundamentals to write more powerful code!

---

**Resources:**
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)