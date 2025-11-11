---
title: Your First Android App
description: Build a complete "Hello World" app, understand the Activity lifecycle, and add interactive functionality
platform: android
order: 4
---

# Your First Android App

Let's build your first interactive Android app! We'll start with a simple Hello World app and then add functionality to make it more interesting.

## Creating the Project

1. Open Android Studio
2. Click **"New Project"**
3. Select **"Empty Activity"**
4. Configure your project:

```
Name: HelloWorld
Package name: com.example.helloworld
Save location: Choose your preferred location
Language: Kotlin
Minimum SDK: API 24 (Android 7.0) - Covers 95% of devices
```

5. Click **Finish** and wait for Gradle to sync

## Understanding What Was Generated

Android Studio created these key files:

```
HelloWorld/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/helloworld/
│   │   │   └── MainActivity.kt          ← Your main code
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── activity_main.xml    ← Your UI layout
│   │   │   └── values/
│   │   │       └── strings.xml          ← Text strings
│   │   └── AndroidManifest.xml          ← App configuration
│   └── build.gradle                      ← Dependencies
```

## The Activity Lifecycle

Before diving into code, let's understand the Activity lifecycle - how Android manages your app's screens:

```
        ┌──────────────┐
        │   onCreate   │  Activity is created
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   onStart    │  Activity becomes visible
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   onResume   │  Activity starts interacting with user
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   Running    │  ← User interacts with app
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   onPause    │  Losing focus (e.g., popup appears)
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   onStop     │  No longer visible
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   onDestroy  │  Activity is destroyed
        └──────────────┘
```

:::compare-react-native
React Native components have their own lifecycle:
```javascript
import React, { useEffect } from 'react';

function MyScreen() {
    // Equivalent to onCreate + onStart + onResume
    useEffect(() => {
        console.log('Component mounted');
        
        // Equivalent to onDestroy
        return () => {
            console.log('Component unmounted');
        };
    }, []);
    
    return <View>...</View>;
}
```
React uses hooks for lifecycle management, while Android uses override methods. Both serve the same purpose: manage component/activity lifecycle.
:::

## MainActivity.kt - Your First Code

Let's examine the generated `MainActivity.kt`:

```kotlin
package com.example.helloworld

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

**Breaking it down:**

- `class MainActivity : AppCompatActivity()` - MainActivity inherits from AppCompatActivity (a base class for activities)
- `override fun onCreate()` - Called when activity is created
- `super.onCreate(savedInstanceState)` - Call parent class implementation (required)
- `setContentView(R.layout.activity_main)` - Load the UI layout

## The Layout File - Designing Your UI

Open `res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textSize="24sp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

**Key concepts:**
- `ConstraintLayout` - Flexible layout system for positioning views
- `TextView` - Displays text
- `android:id` - Unique identifier to reference view from code
- `layout_width/height` - Size attributes (`match_parent`, `wrap_content`, or specific dp)
- Constraint attributes - Position the view relative to parent/other views

## Running Your First App

1. Click the **Run** button (▶️) in the toolbar
2. Select your emulator or connected device
3. Wait for the app to build and deploy (30-60 seconds first time)
4. See "Hello World!" displayed on the screen

🎉 Congratulations! You've created and run your first Android app!

## Making It Interactive - Adding a Button

Let's add interactivity. We'll add a button that changes the text when clicked.

### Step 1: Update the Layout

Modify `activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textSize="32sp"
        android:textStyle="bold"
        android:textColor="@color/purple_500"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@id/button"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me!"
        android:textSize="18sp"
        app:layout_constraintTop_toBottomOf="@id/textView"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="24dp" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

### Step 2: Add Click Handling in Kotlin

Update `MainActivity.kt`:

```kotlin
package com.example.helloworld

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    // Counter variable to track clicks
    private var clickCount = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Get references to views
        val textView = findViewById<TextView>(R.id.textView)
        val button = findViewById<Button>(R.id.button)
        
        // Set click listener
        button.setOnClickListener {
            clickCount++
            textView.text = "Button clicked $clickCount times!"
        }
    }
}
```

:::compare-react-native
React Native equivalent:
```javascript
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
    const [clickCount, setClickCount] = useState(0);
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Button clicked {clickCount} times!
            </Text>
            <Button 
                title="Click Me!" 
                onPress={() => setClickCount(clickCount + 1)} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6200EE',
        marginBottom: 24
    }
});
```
Both handle clicks and update UI, but Kotlin uses listeners while React Native uses state hooks.
:::

### Step 3: Run and Test

1. Run the app again
2. Click the button
3. Watch the text update with each click!

## Using View Binding (Modern Approach)

View Binding is a safer, more efficient way to access views. Let's upgrade our code:

### Step 1: Enable View Binding

In `build.gradle (Module: app)`:

```kotlin
android {
    // ... other configuration
    
    buildFeatures {
        viewBinding true
    }
}
```

Click **"Sync Now"** when prompted.

### Step 2: Update MainActivity

```kotlin
package com.example.helloworld

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.helloworld.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private var clickCount = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize view binding
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Access views directly through binding
        binding.button.setOnClickListener {
            clickCount++
            binding.textView.text = "Button clicked $clickCount times!"
        }
    }
}
```

**Benefits of View Binding:**
- ✅ Type-safe (no more ClassCastException)
- ✅ Null-safe (only views in layout are accessible)
- ✅ No manual casting required
- ✅ Better IDE support with autocomplete

## Adding Multiple Features

Let's make our app more interesting by adding a reset button and counter display:

### Updated Layout (`activity_main.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="24dp"
    android:background="#F5F5F5">

    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Counter"
        android:textSize="28sp"
        android:textStyle="bold"
        android:textColor="@color/purple_700"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="32dp" />

    <TextView
        android:id="@+id/counterText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="0"
        android:textSize="72sp"
        android:textStyle="bold"
        android:textColor="@color/purple_500"
        app:layout_constraintTop_toBottomOf="@id/titleText"
        app:layout_constraintBottom_toTopOf="@id/clickButton"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <Button
        android:id="@+id/clickButton"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="Click Me!"
        android:textSize="20sp"
        app:layout_constraintWidth_percent="0.8"
        app:layout_constraintBottom_toTopOf="@id/resetButton"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginBottom="16dp" />

    <Button
        android:id="@+id/resetButton"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="Reset"
        android:textSize="20sp"
        app:layout_constraintWidth_percent="0.8"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginBottom="64dp"
        style="@style/Widget.Material3.Button.OutlinedButton" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

### Updated Activity Code

```kotlin
package com.example.helloworld

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.helloworld.databinding.ActivityMainBinding
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private var clickCount = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupClickHandlers()
    }
    
    private fun setupClickHandlers() {
        // Increment counter
        binding.clickButton.setOnClickListener {
            clickCount++
            updateCounterDisplay()
            
            // Show milestone messages
            when (clickCount) {
                10 -> showMessage("Great! You've reached 10 clicks!")
                25 -> showMessage("Awesome! 25 clicks and counting!")
                50 -> showMessage("Wow! 50 clicks! You're persistent!")
            }
        }
        
        // Reset counter
        binding.resetButton.setOnClickListener {
            clickCount = 0
            updateCounterDisplay()
            showMessage("Counter reset to 0")
        }
    }
    
    private fun updateCounterDisplay() {
        binding.counterText.text = clickCount.toString()
    }
    
    private fun showMessage(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }
    
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        // Save counter value when activity is destroyed
        outState.putInt("clickCount", clickCount)
    }
    
    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        // Restore counter value
        clickCount = savedInstanceState.getInt("clickCount", 0)
        updateCounterDisplay()
    }
}
```

**New Concepts Introduced:**

1. **Private Methods**: `setupClickHandlers()`, `updateCounterDisplay()`, `showMessage()`
   - Organize code into logical functions
   
2. **Snackbar**: Material Design component for showing brief messages

3. **State Persistence**: `onSaveInstanceState()` and `onRestoreInstanceState()`
   - Saves data when activity is destroyed (e.g., screen rotation)
   - Restores data when activity is recreated

4. **When Expression**: Kotlin's version of switch statement

:::compare-react-native
React Native handles state persistence differently:
```javascript
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [clickCount, setClickCount] = useState(0);
    
    // Load saved count on mount
    useEffect(() => {
        loadCount();
    }, []);
    
    // Save count whenever it changes
    useEffect(() => {
        saveCount();
    }, [clickCount]);
    
    const loadCount = async () => {
        const saved = await AsyncStorage.getItem('clickCount');
        if (saved) setClickCount(parseInt(saved));
    };
    
    const saveCount = async () => {
        await AsyncStorage.setItem('clickCount', clickCount.toString());
    };
    
    return (
        // ... UI components
    );
}
```
Android uses Bundle for temporary state, while React Native uses AsyncStorage for persistent storage.
:::

## Testing Screen Rotation

1. Run your app
2. Click the button several times
3. Rotate the device/emulator (Ctrl+F11 or Ctrl+F12)
4. The counter value is preserved! 🎉

Without `onSaveInstanceState()`, the counter would reset to 0 on rotation.

## Adding String Resources

Let's use proper string resources instead of hardcoded strings:

### Update `res/values/strings.xml`

```xml
<resources>
    <string name="app_name">Hello World</string>
    <string name="title">Click Counter</string>
    <string name="click_button">Click Me!</string>
    <string name="reset_button">Reset</string>
    <string name="reset_message">Counter reset to 0</string>
    <string name="milestone_10">Great! You\'ve reached 10 clicks!</string>
    <string name="milestone_25">Awesome! 25 clicks and counting!</string>
    <string name="milestone_50">Wow! 50 clicks! You\'re persistent!</string>
</resources>
```

### Update Layout to Use String Resources

```xml
<TextView
    android:id="@+id/titleText"
    android:text="@string/title"
    ... />

<Button
    android:id="@+id/clickButton"
    android:text="@string/click_button"
    ... />
```

### Update Code to Use String Resources

```kotlin
private fun showMessage(messageResId: Int) {
    Snackbar.make(binding.root, getString(messageResId), Snackbar.LENGTH_SHORT).show()
}

// In setupClickHandlers():
when (clickCount) {
    10 -> showMessage(R.string.milestone_10)
    25 -> showMessage(R.string.milestone_25)
    50 -> showMessage(R.string.milestone_50)
}
```

**Why use string resources?**
- ✅ Easy localization (support multiple languages)
- ✅ Centralized text management
- ✅ Reusability across different screens

## Common Issues and Solutions

### Issue 1: App Crashes on Launch

**Error**: `NullPointerException`

**Solution**: Make sure `onCreate()` calls `super.onCreate()` first and then `setContentView()`

### Issue 2: Button Click Not Working

**Solution**: Check that:
- View IDs match in XML and code
- `setOnClickListener` is called after `setContentView`

### Issue 3: View Binding Not Found

**Solution**:
- Sync Gradle after enabling view binding
- Rebuild project (Build → Rebuild Project)

## Key Takeaways

✅ **Activities** are the building blocks of Android apps  
✅ **Lifecycle methods** manage activity states (onCreate, onStart, etc.)  
✅ **View Binding** provides safe, efficient view access  
✅ **State persistence** preserves data across configuration changes  
✅ **String resources** enable localization and centralized text management  
✅ **Material Components** provide polished UI elements (Snackbar, Buttons)  

## Challenge Exercise

Enhance the app by adding:
1. A "Double" button that multiplies the counter by 2
2. Different text colors based on counter value (green for 0-10, orange for 11-25, red for 26+)
3. Disable the reset button when counter is 0

## Next Steps

Now that you understand basic app structure and interactivity, let's dive into Kotlin fundamentals to write more powerful and expressive code!

---

**Resources:**
- [Activity Lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle)
- [View Binding](https://developer.android.com/topic/libraries/view-binding)
- [Saving UI States](https://developer.android.com/topic/libraries/architecture/saving-states)