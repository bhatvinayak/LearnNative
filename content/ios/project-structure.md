---
title: Understanding iOS Project Structure
description: Learn how iOS projects are organized, what each file and folder does, and how everything fits together
platform: ios
order: 3
---

# Understanding iOS Project Structure

When you create an iOS project, Xcode generates dozens of files and folders. Understanding this structure is crucial for efficient development. Let's explore every important file and directory.

## Project View Overview

Xcode organizes files in two ways: **Project Navigator** (logical) and **Finder** (physical).

```
MyApp.xcodeproj
├── MyApp/
│   ├── MyAppApp.swift          # App entry point
│   ├── ContentView.swift       # Main view (SwiftUI)
│   ├── Assets.xcassets         # Images, colors, icons
│   ├── Preview Content/
│   │   └── Preview Assets      # Preview-only assets
│   └── Info.plist             # App configuration (if needed)
├── MyAppTests/                 # Unit tests
├── MyAppUITests/               # UI tests
└── Products/
    └── MyApp.app              # Compiled app
```

:::compare-react-native
React Native project structure:
```
MyApp/
├── android/          # Native Android code
├── ios/              # Native iOS code
├── src/              # Your React Native code
│   ├── components/
│   ├── screens/
│   └── App.js
├── package.json      # Dependencies
└── node_modules/     # Installed packages
```
:::compare-android
Android project structure:
```
MyApp/
├── app/
│   ├── manifests/
│   │   └── AndroidManifest.xml
│   ├── java/
│   │   └── com.example.myapp/
│   │       └── MainActivity.kt
│   └── res/
│       ├── layout/
│       ├── values/
│       └── drawable/
└── Gradle Scripts/
```
iOS combines code and resources in one folder, while Android separates them more explicitly.
:::

## The App Entry Point (SwiftUI)

### App Structure File

```swift
// MyAppApp.swift
import SwiftUI

@main
struct MyAppApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

**Key Elements:**
- `@main`: Marks the app's entry point
- `App` protocol: Defines app structure
- `WindowGroup`: Container for app's views
- `ContentView()`: Initial view displayed

### App Delegate (UIKit/Legacy)

```swift
// AppDelegate.swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Override point for customization after application launch
        return true
    }
    
    // App lifecycle methods
    func applicationWillResignActive(_ application: UIApplication) {
        // App about to become inactive
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        // App entered background
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        // App about to enter foreground
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        // App became active
    }
}
```

:::compare-android
Android's Application class:
```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // App initialization
    }
}
```
Both handle app-level initialization and lifecycle events.
:::

## Views and View Controllers

### SwiftUI View

```swift
// ContentView.swift
import SwiftUI

struct ContentView: View {
    // State variables
    @State private var counter = 0
    
    // View body
    var body: some View {
        VStack {
            Text("Counter: \(counter)")
                .font(.largeTitle)
            
            Button("Increment") {
                counter += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

// Preview
#Preview {
    ContentView()
}
```

**SwiftUI Concepts:**
- `View` protocol: Defines a piece of UI
- `body`: Required property returning view content
- `@State`: Local view state
- Property wrappers: `@State`, `@Binding`, `@ObservedObject`
- Declarative syntax: Describe what UI should look like

### UIKit View Controller

```swift
// ViewController.swift
import UIKit

class ViewController: UIViewController {
    
    // UI Elements
    private let label: UILabel = {
        let label = UILabel()
        label.text = "Hello, iOS!"
        label.font = .systemFont(ofSize: 24, weight: .bold)
        label.textAlignment = .center
        return label
    }()
    
    private let button: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Tap Me", for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 18)
        return button
    }()
    
    // Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Called before view appears
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // Called after view appears
    }
    
    // Setup
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        // Add subviews
        view.addSubview(label)
        view.addSubview(button)
        
        // Layout
        label.translatesAutoresizingMaskIntoConstraints = false
        button.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -50),
            
            button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            button.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 20)
        ])
        
        // Actions
        button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
    }
    
    @objc private func buttonTapped() {
        label.text = "Button tapped!"
    }
}
```

## Assets.xcassets

Assets catalog stores images, colors, and data assets.

```
Assets.xcassets/
├── AppIcon.appiconset/         # App icon (all sizes)
├── AccentColor.colorset/        # App accent color
├── Image.imageset/              # Custom images
│   ├── image.png               # 1x resolution
│   ├── image@2x.png            # 2x resolution
│   └── image@3x.png            # 3x resolution
└── Contents.json                # Asset metadata
```

### Using Assets in Code

```swift
// SwiftUI
Image("imageName")
Color("customColor")

// UIKit
UIImage(named: "imageName")
UIColor(named: "customColor")
```

### App Icon Sizes

```
AppIcon.appiconset/
├── Icon-20@2x.png      # 40x40   (iPhone Notification)
├── Icon-20@3x.png      # 60x60   (iPhone Notification)
├── Icon-29@2x.png      # 58x58   (iPhone Settings)
├── Icon-29@3x.png      # 87x87   (iPhone Settings)
├── Icon-40@2x.png      # 80x80   (iPhone Spotlight)
├── Icon-40@3x.png      # 120x120 (iPhone Spotlight)
├── Icon-60@2x.png      # 120x120 (iPhone App)
├── Icon-60@3x.png      # 180x180 (iPhone App)
└── Icon-1024.png       # 1024x1024 (App Store)
```

:::compare-android
Android resources:
```
res/
├── drawable/           # Images
├── mipmap/            # App icons
│   ├── mdpi/          # 1x
│   ├── hdpi/          # 1.5x
│   ├── xhdpi/         # 2x
│   ├── xxhdpi/        # 3x
│   └── xxxhdpi/       # 4x
├── values/
│   ├── colors.xml
│   └── strings.xml
└── layout/            # XML layouts
```
Both use density-based image assets, but iOS uses @2x, @3x notation while Android uses folder names.
:::

## Info.plist (Configuration)

Info.plist contains app configuration (now often in project settings).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>My App</string>
    
    <key>CFBundleIdentifier</key>
    <string>com.example.myapp</string>
    
    <key>CFBundleVersion</key>
    <string>1</string>
    
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to take photos</string>
    
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need location to show nearby places</string>
    
    <key>UILaunchScreen</key>
    <dict/>
</dict>
</plist>
```

**Common Keys:**
- `CFBundleIdentifier`: Unique app identifier
- `CFBundleVersion`: Build number (increment each build)
- `CFBundleShortVersionString`: User-visible version (1.0, 1.1, etc.)
- `NS*UsageDescription`: Permission descriptions
- `UILaunchScreen`: Launch screen configuration

:::compare-android
Android's AndroidManifest.xml:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">
    
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.LOCATION" />
    
    <application
        android:label="My App"
        android:icon="@mipmap/ic_launcher">
        
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```
Both define app metadata and permissions, but iOS emphasizes user-facing permission descriptions.
:::

## Project Settings

### Target Settings

```
Target → General:
├── Display Name          # App name on home screen
├── Bundle Identifier     # Unique app ID
├── Version              # User-visible version
├── Build                # Internal build number
├── Deployment Target    # Minimum iOS version
└── Device Orientation   # Supported orientations
```

### Build Configuration

```swift
// Debug vs Release
#if DEBUG
print("Debug mode")
let apiURL = "https://api-dev.example.com"
#else
print("Release mode")
let apiURL = "https://api.example.com"
#endif
```

### Signing & Capabilities

```
Signing & Capabilities:
├── Automatically manage signing
├── Team                    # Development team
├── Bundle Identifier       # App ID
├── Provisioning Profile   # Device authorization
└── Capabilities           # App features
    ├── Push Notifications
    ├── App Groups
    ├── iCloud
    └── In-App Purchase
```

## File Organization Best Practices

### Recommended Structure (SwiftUI)

```
MyApp/
├── App/
│   ├── MyAppApp.swift
│   └── ContentView.swift
├── Views/
│   ├── HomeView.swift
│   ├── ProfileView.swift
│   └── SettingsView.swift
├── ViewModels/
│   ├── HomeViewModel.swift
│   └── ProfileViewModel.swift
├── Models/
│   ├── User.swift
│   └── Product.swift
├── Services/
│   ├── NetworkService.swift
│   └── StorageService.swift
├── Utilities/
│   ├── Extensions.swift
│   └── Constants.swift
└── Resources/
    └── Assets.xcassets
```

### Recommended Structure (UIKit)

```
MyApp/
├── Application/
│   ├── AppDelegate.swift
│   └── SceneDelegate.swift
├── ViewControllers/
│   ├── HomeViewController.swift
│   ├── ProfileViewController.swift
│   └── SettingsViewController.swift
├── Views/
│   ├── CustomButton.swift
│   └── UserCell.swift
├── Models/
│   ├── User.swift
│   └── Product.swift
├── Networking/
│   ├── APIService.swift
│   └── Endpoints.swift
├── Database/
│   └── CoreDataManager.swift
└── Resources/
    ├── Assets.xcassets
    └── Storyboards/
```

## Swift Package Manager

Modern dependency management built into Xcode.

### Adding Packages

```
File → Add Packages...
Enter package URL: https://github.com/Alamofire/Alamofire.git
Select version
Add to target
```

### Package.swift (for libraries)

```swift
// Package.swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyLibrary",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "MyLibrary",
            targets: ["MyLibrary"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/Alamofire/Alamofire.git",
            from: "5.8.0"
        )
    ],
    targets: [
        .target(
            name: "MyLibrary",
            dependencies: ["Alamofire"]
        ),
        .testTarget(
            name: "MyLibraryTests",
            dependencies: ["MyLibrary"]
        )
    ]
)
```

:::compare-android
Android uses Gradle:
```kotlin
// build.gradle
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'androidx.core:core-ktx:1.12.0'
}
```
Both provide native package management, but iOS's is more integrated with Xcode.
:::

## Build Phases

```
Target → Build Phases:
├── Dependencies            # Target dependencies
├── Compile Sources        # Swift/Objective-C files to compile
├── Link Binary With Libraries  # Frameworks to link
├── Copy Bundle Resources  # Files to include in app bundle
└── Run Script            # Custom build scripts
```

### Common Build Script

```bash
# Run SwiftLint for code quality
if which swiftlint >/dev/null; then
  swiftlint
else
  echo "warning: SwiftLint not installed"
fi
```

## Schemes

Schemes define how to build, run, test, and archive your app.

```
Product → Scheme → Edit Scheme:
├── Build              # Which targets to build
├── Run                # Debug configuration
│   ├── Build Configuration: Debug
│   └── Executable: MyApp.app
├── Test               # Unit and UI tests
├── Profile            # Performance testing
├── Analyze            # Static analysis
└── Archive            # App Store builds
```

## Practical Example: Project Setup

```swift
// Project structure for a Todo app

// Models/Todo.swift
struct Todo: Identifiable, Codable {
    let id: UUID
    var title: String
    var isCompleted: Bool
    var createdAt: Date
}

// ViewModels/TodoViewModel.swift
import Foundation

@Observable
class TodoViewModel {
    var todos: [Todo] = []
    
    func addTodo(title: String) {
        let todo = Todo(
            id: UUID(),
            title: title,
            isCompleted: false,
            createdAt: Date()
        )
        todos.append(todo)
    }
    
    func toggleComplete(_ todo: Todo) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].isCompleted.toggle()
        }
    }
}

// Views/ContentView.swift
import SwiftUI

struct ContentView: View {
    @State private var viewModel = TodoViewModel()
    @State private var newTodoTitle = ""
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.todos) { todo in
                    HStack {
                        Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(todo.isCompleted ? .green : .gray)
                        
                        Text(todo.title)
                            .strikethrough(todo.isCompleted)
                    }
                    .onTapGesture {
                        viewModel.toggleComplete(todo)
                    }
                }
            }
            .navigationTitle("Todos")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Add") {
                        viewModel.addTodo(title: newTodoTitle)
                        newTodoTitle = ""
                    }
                }
            }
        }
    }
}
```

## Key Takeaways

✅ **App entry point** in `@main` struct (SwiftUI) or AppDelegate (UIKit)  
✅ **Views** define UI components (SwiftUI) or ViewControllers (UIKit)  
✅ **Assets.xcassets** stores images and colors with @2x/@3x variants  
✅ **Info.plist** contains app configuration and permissions  
✅ **Target settings** define app identity and capabilities  
✅ **Swift Package Manager** handles dependencies  
✅ **Project organization** improves maintainability  
✅ **Build configurations** separate debug and release  

## Best Practices

1. **Organize by feature or layer** - Group related files
2. **Use Asset Catalogs** - Never add images directly to project
3. **Modular architecture** - Separate concerns (MVVM, etc.)
4. **Version control** - Exclude build artifacts (.gitignore)
5. **Consistent naming** - Follow Swift conventions
6. **Documentation** - Add comments for complex logic
7. **Extensions** - Separate extensions in their own files

## Next Steps

Now that you understand the project structure, let's create your first complete iOS app with interactive functionality!

---

**Resources:**
- [Xcode Project Structure](https://developer.apple.com/documentation/xcode/organizing-your-code)
- [Info.plist Keys](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Introduction/Introduction.html)
- [Swift Package Manager](https://www.swift.org/package-manager/)