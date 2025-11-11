---
title: Understanding Android Project Structure
description: Learn how Android projects are organized, what each file and folder does, and how everything fits together
platform: android
order: 3
---

# Understanding Android Project Structure

When you create an Android project, Android Studio generates dozens of files and folders. Understanding this structure is crucial for efficient development. Let's explore every important file and directory.

## Project View Overview

Android Studio offers different project views. We'll use **"Android"** view (the default) which groups files logically:

```
MyApp
├── app
│   ├── manifests
│   │   └── AndroidManifest.xml
│   ├── java (kotlin)
│   │   └── com.example.myapp
│   │       ├── MainActivity.kt
│   │       └── (other Kotlin files)
│   └── res
│       ├── drawable
│       ├── layout
│       │   └── activity_main.xml
│       ├── mipmap
│       ├── values
│       │   ├── colors.xml
│       │   ├── strings.xml
│       │   └── themes.xml
│       └── xml
├── Gradle Scripts
│   ├── build.gradle (Project)
│   ├── build.gradle (Module: app)
│   └── settings.gradle
└── (other files)
```

:::compare-react-native
React Native project structure:
```
MyApp
├── android/          # Native Android code (similar to above)
├── ios/              # Native iOS code
├── src/              # Your React Native code
│   ├── components/
│   ├── screens/
│   └── App.js
├── package.json      # Dependencies
└── node_modules/     # Installed packages
```
React Native separates native platform code from cross-platform JavaScript code, while Android projects contain only Android-specific code.
:::

## The `app` Module

The `app` folder is your main module - where your application code lives.

### 1. AndroidManifest.xml

This is the **most important configuration file** in your app. It tells Android about your app's components, permissions, and features.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <!-- Permissions your app needs -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- App features -->
    <uses-feature 
        android:name="android.hardware.camera"
        android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MyApp">
        
        <!-- Main activity (entry point) -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Other activities -->
        <activity android:name=".SettingsActivity" />
        
        <!-- Services, receivers, providers -->
        <service android:name=".MyBackgroundService" />
        
    </application>

</manifest>
```

**Key Elements:**
- **package**: Unique identifier for your app (reverse domain notation)
- **uses-permission**: Permissions required by your app
- **application**: App-level configuration
- **activity**: Declares each screen/activity in your app
- **intent-filter**: Defines how activities can be launched

:::compare-react-native
React Native uses app.json and AndroidManifest.xml:
```json
// app.json - React Native configuration
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": { /* ... */ },
    "android": {
      "package": "com.example.myapp",
      "permissions": ["CAMERA", "INTERNET"]
    }
  }
}
```
React Native (especially with Expo) abstracts some configuration, while native Android gives you complete control via the manifest.
:::

### 2. Kotlin Source Files (`java` folder)

Despite being named `java`, this folder contains your Kotlin code. It's organized by package name.

```kotlin
package com.example.myapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Activity creation logic
        initializeApp()
    }
    
    private fun initializeApp() {
        // Setup code here
    }
    
    override fun onStart() {
        super.onStart()
        // Called when activity becomes visible
    }
    
    override fun onResume() {
        super.onResume()
        // Called when activity starts interacting with user
    }
    
    override fun onDestroy() {
        super.onDestroy()
        // Cleanup code
    }
}
```

**Package Structure Best Practices:**

```
com.example.myapp
├── MainActivity.kt
├── ui
│   ├── activities
│   │   ├── LoginActivity.kt
│   │   └── ProfileActivity.kt
│   ├── fragments
│   │   └── HomeFragment.kt
│   └── adapters
│       └── UserListAdapter.kt
├── data
│   ├── model
│   │   └── User.kt
│   ├── repository
│   │   └── UserRepository.kt
│   └── remote
│       └── ApiService.kt
└── utils
    └── DateUtils.kt
```

:::compare-react-native
React Native component structure:
```javascript
// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
```
Both organize code by feature, but Kotlin uses classes and packages while React Native uses JavaScript modules and functions.
:::

### 3. Resources (`res` folder)

The `res` folder contains all non-code resources: layouts, images, strings, colors, etc.

#### Layout Files (`res/layout`)

XML files defining your UI structure:

```xml
<!-- res/layout/activity_main.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/hello_world"
        android:textSize="24sp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/click_me"
        app:layout_constraintTop_toBottomOf="@id/textView"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

:::compare-react-native
React Native uses JSX for layouts:
```javascript
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
            <Button title="Click Me" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 24
    }
});
```
Android uses XML for layouts (declarative), while React Native uses JSX (also declarative). Both separate structure from logic.
:::

#### String Resources (`res/values/strings.xml`)

Centralized string management for localization:

```xml
<resources>
    <string name="app_name">My App</string>
    <string name="hello_world">Hello World!</string>
    <string name="click_me">Click Me</string>
    <string name="welcome_message">Welcome to %1$s</string>
    
    <!-- Plurals -->
    <plurals name="number_of_items">
        <item quantity="one">%d item</item>
        <item quantity="other">%d items</item>
    </plurals>
</resources>
```

**Usage in Kotlin:**
```kotlin
// In Activity or Fragment
val appName = getString(R.string.app_name)
val welcome = getString(R.string.welcome_message, "Android Dev")
val items = resources.getQuantityString(R.plurals.number_of_items, 5, 5)
```

**Localization:**
```
res/
├── values/
│   └── strings.xml          (Default - English)
├── values-es/
│   └── strings.xml          (Spanish)
├── values-fr/
│   └── strings.xml          (French)
└── values-hi/
    └── strings.xml          (Hindi)
```

:::compare-react-native
React Native uses i18n libraries:
```javascript
import i18n from 'i18n-js';

// translations/en.json
{
    "hello": "Hello World!",
    "welcome": "Welcome to {{name}}"
}

// Usage
<Text>{i18n.t('hello')}</Text>
<Text>{i18n.t('welcome', { name: 'React Native' })}</Text>
```
:::

#### Colors (`res/values/colors.xml`)

```xml
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    
    <!-- Custom colors -->
    <color name="primary">#FF6200EE</color>
    <color name="background">#FFFFFF</color>
    <color name="text_primary">#000000</color>
    <color name="text_secondary">#757575</color>
</resources>
```

#### Themes (`res/values/themes.xml`)

```xml
<resources>
    <!-- Base application theme -->
    <style name="Theme.MyApp" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        
        <item name="colorSecondary">@color/teal_200</item>
        <item name="colorSecondaryVariant">@color/teal_700</item>
        <item name="colorOnSecondary">@color/black</item>
        
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>
</resources>
```

#### Drawables (`res/drawable`)

Images and vector graphics:

```xml
<!-- res/drawable/ic_favorite.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24"
    android:tint="?attr/colorControlNormal">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M12,21.35l-1.45,-1.32C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3c1.74,0 3.41,0.81 4.5,2.09C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.42 22,8.5c0,3.78 -3.4,6.86 -8.55,11.54L12,21.35z"/>
</vector>
```

**Folder qualifiers for different densities:**
```
drawable/
drawable-mdpi/       (1x)
drawable-hdpi/       (1.5x)
drawable-xhdpi/      (2x)
drawable-xxhdpi/     (3x)
drawable-xxxhdpi/    (4x)
```

## Gradle Build System

Gradle is Android's build automation tool. It compiles your code, manages dependencies, and creates APKs.

### Project-Level `build.gradle`

```kotlin
// build.gradle (Project)
buildscript {
    ext.kotlin_version = "1.9.0"
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:8.1.0"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

### Module-Level `build.gradle`

```kotlin
// build.gradle (Module: app)
plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'kotlin-kapt'
}

android {
    namespace 'com.example.myapp'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }
    
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    // AndroidX libraries
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Lifecycle components
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.6.2'
    
    // Testing
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
```

:::compare-react-native
React Native uses package.json:
```json
{
  "name": "MyApp",
  "version": "1.0.0",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-navigation": "^6.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0"
  }
}
```
Both manage dependencies, but Gradle is more powerful for Android-specific configuration.
:::

## The R Class (Generated Resources)

Android generates an `R` class that provides type-safe access to all resources:

```kotlin
// Accessing resources via R class
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)  // Layout
        
        val textView = findViewById<TextView>(R.id.textView)  // View ID
        textView.text = getString(R.string.hello_world)  // String
        textView.setTextColor(getColor(R.color.primary))  // Color
        
        val icon = getDrawable(R.drawable.ic_favorite)  // Drawable
    }
}
```

**R class structure:**
```
R
├── R.layout (layouts)
├── R.id (view IDs)
├── R.string (strings)
├── R.color (colors)
├── R.drawable (images)
├── R.mipmap (app icons)
└── R.style (themes & styles)
```

## Build Variants

Android supports multiple build variants for different environments:

```kotlin
// In build.gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            versionNameSuffix "-DEBUG"
            buildConfigField "String", "API_URL", "\"https://api-dev.example.com\""
        }
        release {
            minifyEnabled true
            buildConfigField "String", "API_URL", "\"https://api.example.com\""
        }
    }
    
    flavorDimensions "version"
    productFlavors {
        free {
            dimension "version"
            applicationIdSuffix ".free"
        }
        paid {
            dimension "version"
            applicationIdSuffix ".paid"
        }
    }
}

// Usage in code
val apiUrl = BuildConfig.API_URL
```

This creates variants: **freeDebug**, **freeRelease**, **paidDebug**, **paidRelease**

## Key Takeaways

✅ **AndroidManifest.xml** declares app components and permissions  
✅ **Kotlin code** goes in the `java` folder (organized by package)  
✅ **Resources** (`res/`) contain layouts, strings, images, and styles  
✅ **Gradle** manages dependencies and builds your app  
✅ **R class** provides type-safe access to resources  
✅ **Build variants** allow different configurations for debug/release  

## Next Steps

Now that you understand the project structure, let's create your first Android app and see how all these pieces work together!

---

**Resources:**
- [App Resources Overview](https://developer.android.com/guide/topics/resources/providing-resources)
- [Configure Your Build](https://developer.android.com/studio/build)
- [App Manifest Overview](https://developer.android.com/guide/topics/manifest/manifest-intro)