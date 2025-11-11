---
title: Setting Up Development Environment
description: Install and configure Android Studio, set up your first emulator, and prepare for Android development
platform: android
order: 2
---

# Setting Up Your Development Environment

Before writing your first line of code, you need to set up Android Studio and configure your development environment. This lesson will guide you through the entire process.

## System Requirements

**Minimum Requirements:**
- **OS**: Windows 10/11, macOS 10.14+, or Linux (64-bit)
- **RAM**: 8 GB (16 GB recommended)
- **Disk Space**: 8 GB (SSD recommended)
- **Screen Resolution**: 1280 x 800 minimum

:::compare-react-native
React Native setup is similar but lighter:
```bash
# React Native requires Node.js and npm
node --version  # Should be 18+
npm --version   # Or use yarn

# Install React Native CLI
npm install -g react-native-cli

# For Android, you still need Android Studio
# For iOS, you need Xcode (macOS only)
```
Both require Android Studio for Android development, but React Native also needs Node.js.
:::

## Step 1: Download Android Studio

1. Visit [developer.android.com/studio](https://developer.android.com/studio)
2. Download the latest stable version for your OS
3. The download includes:
   - Android Studio IDE
   - Android SDK
   - Android Emulator
   - Gradle build system

**File Sizes:**
- Windows: ~1 GB
- macOS: ~900 MB
- Linux: ~1 GB

## Step 2: Install Android Studio

### Windows Installation

```bash
# Run the downloaded .exe file
# Follow the setup wizard
# Choose "Standard" installation type
# Wait for components to download (may take 15-30 minutes)
```

### macOS Installation

```bash
# Open the downloaded .dmg file
# Drag Android Studio to Applications folder
# Launch Android Studio
# Follow the setup wizard
```

### Linux Installation

```bash
# Extract the downloaded tar.gz
tar -xvf android-studio-*.tar.gz

# Move to /opt
sudo mv android-studio /opt/

# Run Android Studio
cd /opt/android-studio/bin
./studio.sh
```

## Step 3: Initial Configuration

When you first launch Android Studio, you'll see the Setup Wizard:

1. **Choose UI Theme**: Light or Dark (you can change this later)
2. **Select Install Type**: Choose "Standard"
3. **SDK Components**: The wizard will install:
   - Android SDK Platform
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

```kotlin
// These SDK components allow you to:
// - Compile your Kotlin code
// - Build APK files
// - Run apps on emulators
// - Debug apps on physical devices
```

## Step 4: Configure SDK and Tools

After installation, verify your setup:

1. Open Android Studio
2. Click **"More Actions"** → **"SDK Manager"**
3. Check installed components:

```
SDK Platforms (Install these):
├── Android 14.0 (API 34) - Latest
├── Android 13.0 (API 33)
└── Android 12.0 (API 31) - Good baseline

SDK Tools (Should be installed):
├── Android SDK Build-Tools
├── Android Emulator
├── Android SDK Platform-Tools
└── Intel x86 Emulator Accelerator (if on Intel CPU)
```

:::compare-react-native
React Native developers need additional SDK platforms:
```bash
# React Native typically targets multiple API levels
# Install API 31, 33, and 34 for broad compatibility

# Also configure environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
:::

## Step 5: Create Your First Virtual Device

An Android Virtual Device (AVD) is an emulator configuration that lets you test apps without a physical device.

### Creating an AVD

1. In Android Studio, click **"More Actions"** → **"Virtual Device Manager"**
2. Click **"Create Device"**
3. Select a device definition:
   - **Recommended**: Pixel 6 or Pixel 7
   - Screen size, resolution, and density are pre-configured

4. Select a system image:
   - **Recommended**: Latest API level with Google APIs
   - Choose the **x86_64** version (faster on Intel/AMD)
   - Download if not already available (500-1500 MB)

5. Configure AVD settings:
   ```
   AVD Name: Pixel_7_API_34
   Startup Orientation: Portrait
   Graphics: Automatic
   RAM: 2048 MB (or more if available)
   ```

6. Click **Finish**

### Starting Your Emulator

```kotlin
// From Android Studio:
// 1. Click the device dropdown in the toolbar
// 2. Select your AVD
// 3. Click the play button

// Or use command line:
// Navigate to: Android/Sdk/emulator/
// Run: ./emulator -avd Pixel_7_API_34
```

:::compare-react-native
React Native can use the same AVD:
```bash
# Start the emulator
emulator -avd Pixel_7_API_34

# In another terminal, run your React Native app
npx react-native run-android

# The app will automatically deploy to the running emulator
```
:::

## Step 6: Configure Physical Device (Optional)

Testing on real devices gives you the most accurate results.

### Enable Developer Options

On your Android device:

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **USB Debugging**

### Connect Device

```bash
# Connect via USB cable
# On Windows, you may need to install USB drivers

# Verify connection
adb devices

# Output should show:
# List of devices attached
# ABC123456789    device
```

If your device isn't recognized:

```bash
# Restart ADB server
adb kill-server
adb start-server
adb devices
```

## Step 7: Understanding the Android Studio Interface

```
┌─────────────────────────────────────────────────┐
│  File  Edit  View  Navigate  Code  Analyze      │  Menu Bar
├─────────────────────────────────────────────────┤
│  ▶ Run | ▲ | Device: Pixel 7 API 34             │  Toolbar
├──────────┬──────────────────────────────────────┤
│ Project  │  MainActivity.kt                      │
│ Explorer │  ┌───────────────────────────────┐   │
│          │  │ class MainActivity : ...      │   │  Editor
│ └─ app   │  │   override fun onCreate() {   │   │
│   └─ src │  │     setContentView(...)       │   │
│          │  └───────────────────────────────┘   │
├──────────┴──────────────────────────────────────┤
│ Build | Logcat | Terminal | TODO                │  Tool Windows
└─────────────────────────────────────────────────┘
```

**Key Areas:**
- **Project Explorer**: File and folder structure
- **Editor**: Where you write code
- **Toolbar**: Build, run, and debug controls
- **Tool Windows**: Build output, logs, terminal

## Step 8: Verify Installation

Let's create a test project to verify everything works:

1. Click **"New Project"**
2. Select **"Empty Activity"**
3. Configure project:
   ```
   Name: HelloAndroid
   Package name: com.yourname.helloandroid
   Save location: Choose a directory
   Language: Kotlin
   Minimum SDK: API 24 (Android 7.0)
   ```

4. Click **"Finish"**
5. Wait for Gradle build (first build takes 2-5 minutes)
6. Click **Run** ▶️ button
7. Select your emulator or device
8. App should launch showing "Hello Android!"

:::compare-react-native
Creating a React Native project:
```bash
# Using React Native CLI
npx react-native init HelloReactNative

# Navigate to project
cd HelloReactNative

# Run on Android
npx react-native run-android

# Or using Expo (easier for beginners)
npx create-expo-app HelloExpo
cd HelloExpo
npx expo start
```
React Native projects are created via command line, while Android projects use the Android Studio wizard.
:::

## Common Setup Issues and Solutions

### Issue 1: Emulator Won't Start

**Solution:**
```bash
# Check if virtualization is enabled
# Windows: Enable Hyper-V or HAXM
# macOS: Already enabled
# Linux: Enable KVM

# For Windows, run in PowerShell (admin):
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

### Issue 2: Gradle Build Fails

**Solution:**
```kotlin
// Check gradle version in build.gradle
// Update if necessary

// Clear cache and rebuild
// File → Invalidate Caches / Restart
```

### Issue 3: SDK Components Missing

**Solution:**
- Open SDK Manager
- Install missing components
- Restart Android Studio

### Issue 4: Device Not Recognized

**Solution:**
```bash
# Install device drivers (Windows)
# Enable USB Debugging on device
# Try different USB cable/port
# Restart ADB: adb kill-server && adb start-server
```

## Keyboard Shortcuts to Learn

Master these for productivity:

**General:**
- `Ctrl + S` / `Cmd + S`: Save all
- `Ctrl + Alt + L` / `Cmd + Option + L`: Format code
- `Ctrl + /` / `Cmd + /`: Comment/uncomment line

**Navigation:**
- `Ctrl + N` / `Cmd + O`: Find class
- `Ctrl + Shift + N` / `Cmd + Shift + O`: Find file
- `Ctrl + B` / `Cmd + B`: Go to declaration

**Running:**
- `Shift + F10` / `Ctrl + R`: Run app
- `Shift + F9` / `Ctrl + D`: Debug app

## Environment Configuration Checklist

Before moving to the next lesson, ensure you have:

✅ Android Studio installed and configured  
✅ At least one Android SDK platform (API 31+)  
✅ An AVD (emulator) created and tested  
✅ Gradle build completes successfully  
✅ Hello World app runs on emulator/device  
✅ ADB recognizes your device (if using physical device)  
✅ Basic keyboard shortcuts memorized  

## Pro Tips

1. **Use SSD**: Install Android Studio and SDK on SSD for faster builds
2. **Allocate RAM**: Give emulator at least 2GB RAM (4GB if available)
3. **Enable Instant Run**: Speeds up deployment during development
4. **Use Hardware Acceleration**: Enable HAXM/Hyper-V for faster emulator
5. **Keep SDK Updated**: Update components regularly via SDK Manager

## Next Steps

Now that your environment is set up, you're ready to dive into Android project structure and understand how an Android app is organized!

---

**Resources:**
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Configure Hardware Acceleration](https://developer.android.com/studio/run/emulator-acceleration)
- [ADB Documentation](https://developer.android.com/studio/command-line/adb)