---
title: SwiftUI Views & Layouts
description: Master SwiftUI views, layouts, modifiers, and declarative UI building
platform: ios
order: 9
---

# SwiftUI Views & Layouts

SwiftUI is Apple's modern declarative framework for building user interfaces across all Apple platforms. Let's master views, layouts, and UI composition.

## Basic Views

### Text

```swift
struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            // Basic text
            Text("Hello, SwiftUI!")
            
            // Styled text
            Text("Large Title")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.blue)
            
            // Multi-line text
            Text("This is a long text that will wrap to multiple lines automatically")
                .multilineTextAlignment(.center)
                .lineLimit(3)
            
            // Formatted text
            Text("Price: \(49.99, specifier: "%.2f")")
            
            // Date formatting
            Text(Date(), style: .date)
        }
        .padding()
    }
}
```

### Image

```swift
struct ImageExamples: View {
    var body: some View {
        VStack(spacing: 20) {
            // SF Symbol
            Image(systemName: "star.fill")
                .font(.largeTitle)
                .foregroundColor(.yellow)
            
            // Asset image
            Image("myImage")
                .resizable()
                .scaledToFit()
                .frame(width: 200, height: 200)
                .clipShape(Circle())
            
            // With overlay
            Image("profile")
                .resizable()
                .scaledToFill()
                .frame(width: 100, height: 100)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(Color.blue, lineWidth: 3)
                )
                .shadow(radius: 10)
        }
    }
}
```

:::compare-android
Jetpack Compose views:
```kotlin
@Composable
fun ContentView() {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text("Hello, Compose!")
        
        Text(
            "Large Title",
            fontSize = 34.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Blue
        )
        
        Image(
            painter = painterResource(id = R.drawable.image),
            contentDescription = "Image",
            modifier = Modifier
                .size(200.dp)
                .clip(CircleShape)
        )
    }
}
```
SwiftUI and Compose have very similar declarative syntax.
:::

## Layout Containers

### VStack (Vertical Stack)

```swift
struct VStackExample: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("First")
            Text("Second")
            Text("Third")
        }
        .padding()
        .background(Color.gray.opacity(0.2))
        .cornerRadius(10)
    }
}
```

### HStack (Horizontal Stack)

```swift
struct HStackExample: View {
    var body: some View {
        HStack(alignment: .center, spacing: 15) {
            Image(systemName: "star.fill")
            Text("Rating")
            Spacer()
            Text("4.5")
        }
        .padding()
    }
}
```

### ZStack (Depth Stack)

```swift
struct ZStackExample: View {
    var body: some View {
        ZStack {
            // Background
            Image("background")
                .resizable()
                .scaledToFill()
            
            // Overlay
            VStack {
                Spacer()
                Text("Featured")
                    .font(.title)
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.black.opacity(0.7))
            }
        }
        .frame(width: 300, height: 200)
        .clipShape(RoundedRectangle(cornerRadius: 15))
    }
}
```

### Spacer and Divider

```swift
struct SpacerExample: View {
    var body: some View {
        VStack {
            Text("Top")
            
            Spacer()  // Pushes content apart
            
            Text("Middle")
            
            Divider()  // Horizontal line
            
            Text("Bottom")
        }
        .frame(height: 300)
        .padding()
    }
}
```

## Modifiers

Modifiers transform views:

```swift
struct ModifierExample: View {
    var body: some View {
        Text("Hello, SwiftUI!")
            .font(.title)
            .foregroundColor(.white)
            .padding()
            .background(Color.blue)
            .cornerRadius(10)
            .shadow(radius: 5)
            .padding()
            .border(Color.gray, width: 2)
    }
}
```

**Order matters!**

```swift
// Different results
Text("Hello")
    .padding()
    .background(Color.blue)  // Blue background around padding

Text("Hello")
    .background(Color.blue)  // Blue background only around text
    .padding()
```

## Custom Modifiers

```swift
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            .shadow(color: .gray.opacity(0.3), radius: 5, x: 0, y: 2)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}

// Usage
Text("Card Content")
    .cardStyle()
```

## Interactive Views

### Button

```swift
struct ButtonExamples: View {
    @State private var counter = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(counter)")
                .font(.title)
            
            // Basic button
            Button("Increment") {
                counter += 1
            }
            
            // Custom button
            Button {
                counter += 1
            } label: {
                HStack {
                    Image(systemName: "plus.circle")
                    Text("Add One")
                }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            
            // Button styles
            Button("Prominent") {
                counter += 1
            }
            .buttonStyle(.borderedProminent)
            
            Button("Bordered") {
                counter += 1
            }
            .buttonStyle(.bordered)
        }
    }
}
```

### TextField

```swift
struct TextFieldExample: View {
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    
    var body: some View {
        Form {
            Section("Personal Info") {
                TextField("Name", text: $name)
                TextField("Email", text: $email)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                
                SecureField("Password", text: $password)
            }
            
            Section {
                Button("Submit") {
                    submitForm()
                }
                .disabled(name.isEmpty || email.isEmpty)
            }
        }
    }
    
    func submitForm() {
        print("Name: \(name), Email: \(email)")
    }
}
```

### Toggle

```swift
struct ToggleExample: View {
    @State private var isOn = false
    @State private var notifications = true
    
    var body: some View {
        VStack(spacing: 20) {
            Toggle("Enable Feature", isOn: $isOn)
            
            Toggle(isOn: $notifications) {
                HStack {
                    Image(systemName: "bell.fill")
                    Text("Notifications")
                }
            }
            .toggleStyle(.switch)
            
            if notifications {
                Text("Notifications enabled")
                    .foregroundColor(.green)
            }
        }
        .padding()
    }
}
```

### Slider

```swift
struct SliderExample: View {
    @State private var volume: Double = 50
    @State private var brightness: Double = 0.5
    
    var body: some View {
        VStack(spacing: 30) {
            VStack {
                Text("Volume: \(Int(volume))")
                Slider(value: $volume, in: 0...100, step: 1)
            }
            
            VStack {
                Text("Brightness: \(brightness, specifier: "%.2f")")
                Slider(value: $brightness, in: 0...1)
                    .accentColor(.yellow)
            }
        }
        .padding()
    }
}
```

### Picker

```swift
struct PickerExample: View {
    @State private var selectedColor = "Red"
    @State private var selectedIndex = 0
    
    let colors = ["Red", "Green", "Blue", "Yellow"]
    
    var body: some View {
        Form {
            // Standard picker
            Picker("Color", selection: $selectedColor) {
                ForEach(colors, id: \.self) { color in
                    Text(color).tag(color)
                }
            }
            
            // Segmented picker
            Picker("Options", selection: $selectedIndex) {
                Text("First").tag(0)
                Text("Second").tag(1)
                Text("Third").tag(2)
            }
            .pickerStyle(.segmented)
            
            // Wheel picker
            Picker("Choose", selection: $selectedColor) {
                ForEach(colors, id: \.self) { color in
                    Text(color).tag(color)
                }
            }
            .pickerStyle(.wheel)
        }
    }
}
```

## Lists

```swift
struct ListView: View {
    let fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
    
    var body: some View {
        List {
            // Simple list
            ForEach(fruits, id: \.self) { fruit in
                Text(fruit)
            }
            
            // Sections
            Section("Favorites") {
                Text("Apple")
                Text("Banana")
            }
            
            Section("Others") {
                Text("Cherry")
                Text("Date")
            }
        }
    }
}

// List with custom rows
struct CustomListView: View {
    let items = [
        Item(name: "Item 1", icon: "star.fill"),
        Item(name: "Item 2", icon: "heart.fill"),
        Item(name: "Item 3", icon: "bookmark.fill")
    ]
    
    var body: some View {
        List(items) { item in
            HStack {
                Image(systemName: item.icon)
                    .foregroundColor(.blue)
                Text(item.name)
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
            }
        }
    }
}

struct Item: Identifiable {
    let id = UUID()
    let name: String
    let icon: String
}
```

:::compare-react-native
React Native FlatList:
```javascript
import { FlatList, View, Text } from 'react-native';

function ListView() {
    const fruits = ["Apple", "Banana", "Cherry"];
    
    return (
        <FlatList
            data={fruits}
            renderItem={({ item }) => (
                <View>
                    <Text>{item}</Text>
                </View>
            )}
            keyExtractor={item => item}
        />
    );
}
```
SwiftUI List and React Native FlatList serve similar purposes.
:::

## Grid Layouts

```swift
struct GridExample: View {
    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    let items = Array(1...20)
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(items, id: \.self) { item in
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color.blue)
                        .frame(height: 100)
                        .overlay(
                            Text("\(item)")
                                .foregroundColor(.white)
                                .font(.title)
                        )
                }
            }
            .padding()
        }
    }
}

// Adaptive grid
struct AdaptiveGridExample: View {
    let items = Array(1...50)
    
    var body: some View {
        ScrollView {
            LazyVGrid(
                columns: [GridItem(.adaptive(minimum: 80))],
                spacing: 10
            ) {
                ForEach(items, id: \.self) { item in
                    Circle()
                        .fill(Color.blue)
                        .frame(height: 80)
                        .overlay(Text("\(item)").foregroundColor(.white))
                }
            }
            .padding()
        }
    }
}
```

## ScrollView

```swift
struct ScrollViewExample: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                ForEach(0..<50) { index in
                    Text("Row \(index)")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(10)
                }
            }
            .padding()
        }
        
        // Horizontal scroll
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 15) {
                ForEach(0..<10) { index in
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color.blue)
                        .frame(width: 200, height: 150)
                        .overlay(
                            Text("Card \(index)")
                                .foregroundColor(.white)
                        )
                }
            }
            .padding()
        }
    }
}
```

## Practical Example: Profile Screen

```swift
struct ProfileView: View {
    @State private var name = "John Doe"
    @State private var bio = "iOS Developer"
    @State private var notificationsEnabled = true
    @State private var selectedTheme = "Light"
    
    let themes = ["Light", "Dark", "Auto"]
    
    var body: some View {
        NavigationStack {
            Form {
                // Profile Section
                Section {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 80, height: 80)
                            .foregroundColor(.blue)
                        
                        VStack(alignment: .leading, spacing: 5) {
                            Text(name)
                                .font(.title2)
                                .fontWeight(.bold)
                            Text(bio)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding(.leading, 10)
                    }
                    .padding(.vertical, 10)
                }
                
                // Information Section
                Section("Information") {
                    TextField("Name", text: $name)
                    TextField("Bio", text: $bio)
                }
                
                // Settings Section
                Section("Settings") {
                    Toggle("Notifications", isOn: $notificationsEnabled)
                    
                    Picker("Theme", selection: $selectedTheme) {
                        ForEach(themes, id: \.self) { theme in
                            Text(theme).tag(theme)
                        }
                    }
                }
                
                // Actions Section
                Section {
                    Button("Save Changes") {
                        saveProfile()
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundColor(.blue)
                    
                    Button("Log Out") {
                        logOut()
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Profile")
        }
    }
    
    func saveProfile() {
        print("Saving profile...")
    }
    
    func logOut() {
        print("Logging out...")
    }
}
```

## State Management

### @State

```swift
struct StateExample: View {
    @State private var counter = 0
    @State private var isShowingSheet = false
    
    var body: some View {
        VStack {
            Text("Counter: \(counter)")
            
            Button("Increment") {
                counter += 1
            }
            
            Button("Show Sheet") {
                isShowingSheet = true
            }
            .sheet(isPresented: $isShowingSheet) {
                SheetView()
            }
        }
    }
}
```

### @Binding

```swift
struct ParentView: View {
    @State private var text = ""
    
    var body: some View {
        VStack {
            Text("Text: \(text)")
            ChildView(text: $text)
        }
    }
}

struct ChildView: View {
    @Binding var text: String
    
    var body: some View {
        TextField("Enter text", text: $text)
            .textFieldStyle(.roundedBorder)
            .padding()
    }
}
```

## Key Takeaways

✅ **SwiftUI is declarative** - describe what you want, not how  
✅ **Views are structs** - lightweight and efficient  
✅ **Modifiers transform views** - order matters  
✅ **State drives UI updates** - @State, @Binding  
✅ **Layout containers** - VStack, HStack, ZStack  
✅ **Lists and grids** - efficient scrolling collections  
✅ **Form** groups input controls  

## Practice Exercise

Create a settings screen with:
1. Profile section with image and name
2. Toggle switches for preferences
3. Picker for theme selection
4. List of menu options
5. Custom card style modifier
6. Proper spacing and alignment

## Next Steps

Next, we'll explore UIKit fundamentals for building traditional iOS interfaces!

---

**Resources:**
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)