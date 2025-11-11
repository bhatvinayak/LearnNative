---
title: Views & Layouts
description: Master Android UI building blocks - Views, ViewGroups, and Layout systems
platform: android
order: 9
---

# Views & Layouts

Every Android UI is built from Views and Layouts. Understanding these fundamental building blocks is essential for creating beautiful, responsive interfaces.

## Understanding Views

A **View** is the basic building block of UI - everything you see on screen is a View or ViewGroup.

### Common Views

```xml
<!-- TextView - Display text -->
<TextView
    android:id="@+id/textView"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello, Android!"
    android:textSize="24sp"
    android:textColor="#000000"
    android:textStyle="bold" />

<!-- EditText - Input field -->
<EditText
    android:id="@+id/editText"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Enter your name"
    android:inputType="text"
    android:maxLines="1" />

<!-- Button - Clickable button -->
<Button
    android:id="@+id/button"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Click Me"
    android:textAllCaps="false" />

<!-- ImageView - Display images -->
<ImageView
    android:id="@+id/imageView"
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:src="@drawable/ic_launcher"
    android:contentDescription="App icon"
    android:scaleType="centerCrop" />

<!-- CheckBox - Boolean selection -->
<CheckBox
    android:id="@+id/checkBox"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="I agree to terms" />

<!-- RadioButton - Single selection from group -->
<RadioGroup
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    
    <RadioButton
        android:id="@+id/radioMale"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Male" />
    
    <RadioButton
        android:id="@+id/radioFemale"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Female" />
</RadioGroup>

<!-- Switch - Toggle on/off -->
<Switch
    android:id="@+id/switch1"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Enable notifications" />
```

:::compare-react-native
React Native components:
```javascript
import React from 'react';
import {
    Text,
    TextInput,
    Button,
    Image,
    Switch,
    View
} from 'react-native';

function MyScreen() {
    const [isEnabled, setIsEnabled] = useState(false);
    
    return (
        <View>
            {/* Text display */}
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                Hello, React Native!
            </Text>
            
            {/* Input field */}
            <TextInput
                placeholder="Enter your name"
                maxLength={100}
            />
            
            {/* Button */}
            <Button title="Click Me" onPress={() => {}} />
            
            {/* Image */}
            <Image
                source={require('./icon.png')}
                style={{width: 100, height: 100}}
            />
            
            {/* Switch */}
            <Switch
                value={isEnabled}
                onValueChange={setIsEnabled}
            />
        </View>
    );
}
```
Android uses XML for layouts while React Native uses JSX. Both provide similar UI components with different syntax.
:::

### View Properties

```xml
<!-- Size attributes -->
android:layout_width="match_parent"   <!-- Fill parent width -->
android:layout_width="wrap_content"   <!-- Just enough to fit content -->
android:layout_width="200dp"          <!-- Fixed size in dp -->

android:layout_height="match_parent"
android:layout_height="wrap_content"
android:layout_height="100dp"

<!-- Padding (space inside view) -->
android:padding="16dp"                <!-- All sides -->
android:paddingStart="16dp"
android:paddingEnd="16dp"
android:paddingTop="8dp"
android:paddingBottom="8dp"

<!-- Margin (space outside view) -->
android:layout_margin="16dp"          <!-- All sides -->
android:layout_marginStart="16dp"
android:layout_marginEnd="16dp"
android:layout_marginTop="8dp"
android:layout_marginBottom="8dp"

<!-- Visibility -->
android:visibility="visible"          <!-- Default -->
android:visibility="invisible"        <!-- Hidden but takes space -->
android:visibility="gone"             <!-- Hidden and no space -->

<!-- Background -->
android:background="@color/blue"
android:background="@drawable/rounded_bg"
android:background="#FF5722"

<!-- Elevation (shadow) -->
android:elevation="4dp"
```

## Layout Types

### 1. LinearLayout

Arranges children in a single row or column:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome"
        android:textSize="24sp" />
    
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Username"
        android:layout_marginTop="16dp" />
    
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Password"
        android:inputType="textPassword"
        android:layout_marginTop="8dp" />
    
    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Login"
        android:layout_marginTop="16dp" />
    
</LinearLayout>
```

**Key properties:**
- `android:orientation="vertical"` or `"horizontal"`
- `android:layout_weight` - Distribute space proportionally
- `android:gravity` - Align content inside view
- `android:layout_gravity` - Position view within parent

```xml
<!-- Layout weight example -->
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">
    
    <!-- Takes 1/3 of space -->
    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="Cancel" />
    
    <!-- Takes 2/3 of space -->
    <Button
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="2"
        android:text="Confirm" />
        
</LinearLayout>
```

### 2. RelativeLayout

Position children relative to each other or the parent:

```xml
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">
    
    <!-- Align to parent top -->
    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentTop="true"
        android:layout_centerHorizontal="true"
        android:text="Profile"
        android:textSize="24sp" />
    
    <!-- Below title, centered -->
    <ImageView
        android:id="@+id/profileImage"
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:layout_below="@id/title"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="24dp"
        android:src="@drawable/ic_profile" />
    
    <!-- Below image -->
    <TextView
        android:id="@+id/nameText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_below="@id/profileImage"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="16dp"
        android:text="John Doe"
        android:textSize="20sp" />
    
    <!-- Align to parent bottom -->
    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:text="Edit Profile" />
        
</RelativeLayout>
```

**Common positioning attributes:**
- `layout_above`, `layout_below`
- `layout_toStartOf`, `layout_toEndOf`
- `layout_alignParentTop`, `layout_alignParentBottom`
- `layout_centerInParent`, `layout_centerHorizontal`, `layout_centerVertical`

### 3. ConstraintLayout (Recommended)

The most powerful and flexible layout:

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">
    
    <ImageView
        android:id="@+id/profileImage"
        android:layout_width="80dp"
        android:layout_height="80dp"
        android:src="@drawable/ic_profile"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
    
    <TextView
        android:id="@+id/nameText"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="John Doe"
        android:textSize="18sp"
        android:layout_marginStart="16dp"
        app:layout_constraintStart_toEndOf="@id/profileImage"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="@id/profileImage" />
    
    <TextView
        android:id="@+id/emailText"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="john@example.com"
        android:layout_marginStart="16dp"
        app:layout_constraintStart_toEndOf="@id/profileImage"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@id/nameText" />
    
    <Button
        android:id="@+id/followButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Follow"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toBottomOf="@id/profileImage"
        android:layout_marginTop="16dp" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

**Key concepts:**
- Every view needs constraints in two dimensions (horizontal & vertical)
- `constraint[Side]_to[Side]Of` - Connect sides to other views or parent
- `layout_width="0dp"` with constraints = match constraints
- Better performance than nested layouts

:::compare-react-native
React Native uses Flexbox:
```javascript
import { View, Image, Text, Button, StyleSheet } from 'react-native';

function ProfileCard() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('./profile.png')}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.email}>john@example.com</Text>
                </View>
            </View>
            <Button title="Follow" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    info: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        color: '#666',
    },
});
```
ConstraintLayout is similar to CSS Grid, while React Native uses Flexbox for layouts.
:::

### 4. FrameLayout

Stack children on top of each other:

```xml
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="200dp">
    
    <!-- Background image -->
    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:src="@drawable/background"
        android:scaleType="centerCrop" />
    
    <!-- Overlay text -->
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="Featured"
        android:textSize="32sp"
        android:textColor="#FFFFFF"
        android:textStyle="bold" />
    
    <!-- Overlay button -->
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"
        android:text="View" />
        
</FrameLayout>
```

## Working with Views in Code

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupViews()
    }
    
    private fun setupViews() {
        // TextView
        binding.titleText.text = "Welcome!"
        binding.titleText.textSize = 24f
        binding.titleText.setTextColor(Color.BLACK)
        
        // EditText
        binding.nameInput.hint = "Enter your name"
        binding.nameInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                val name = s.toString()
                binding.greetingText.text = "Hello, $name!"
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
        
        // Button
        binding.submitButton.setOnClickListener {
            val name = binding.nameInput.text.toString()
            if (name.isNotEmpty()) {
                Toast.makeText(this, "Hello, $name!", Toast.LENGTH_SHORT).show()
            }
        }
        
        // ImageView
        binding.profileImage.setImageResource(R.drawable.ic_profile)
        binding.profileImage.setOnClickListener {
            // Handle image click
            openImagePicker()
        }
        
        // CheckBox
        binding.agreeCheckbox.setOnCheckedChangeListener { _, isChecked ->
            binding.submitButton.isEnabled = isChecked
        }
        
        // RadioGroup
        binding.radioGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.radioMale -> handleGenderSelection("Male")
                R.id.radioFemale -> handleGenderSelection("Female")
            }
        }
        
        // Switch
        binding.notificationSwitch.setOnCheckedChangeListener { _, isChecked ->
            updateNotificationSettings(isChecked)
        }
        
        // Visibility changes
        binding.loadingProgress.visibility = View.VISIBLE  // Show
        binding.loadingProgress.visibility = View.INVISIBLE  // Hide but take space
        binding.loadingProgress.visibility = View.GONE  // Hide and no space
        
        // Enable/Disable
        binding.submitButton.isEnabled = false
        binding.nameInput.isEnabled = true
    }
    
    private fun handleGenderSelection(gender: String) {
        Toast.makeText(this, "Selected: $gender", Toast.LENGTH_SHORT).show()
    }
    
    private fun updateNotificationSettings(enabled: Boolean) {
        // Save preference
        getSharedPreferences("settings", MODE_PRIVATE)
            .edit()
            .putBoolean("notifications", enabled)
            .apply()
    }
    
    private fun openImagePicker() {
        // Implementation for image picker
    }
}
```

## Creating Custom Views

```kotlin
class CircularProgressView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {
    
    private var progress = 0f
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 10f
        color = Color.BLUE
    }
    
    fun setProgress(value: Float) {
        progress = value.coerceIn(0f, 100f)
        invalidate()  // Request redraw
    }
    
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        
        val centerX = width / 2f
        val centerY = height / 2f
        val radius = minOf(centerX, centerY) - paint.strokeWidth
        
        // Draw background circle
        paint.color = Color.LTGRAY
        canvas.drawCircle(centerX, centerY, radius, paint)
        
        // Draw progress arc
        paint.color = Color.BLUE
        val sweepAngle = 360f * (progress / 100f)
        val rectF = RectF(
            centerX - radius,
            centerY - radius,
            centerX + radius,
            centerY + radius
        )
        canvas.drawArc(rectF, -90f, sweepAngle, false, paint)
        
        // Draw percentage text
        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            textSize = 48f
            textAlign = Paint.Align.CENTER
            color = Color.BLACK
        }
        val text = "${progress.toInt()}%"
        canvas.drawText(text, centerX, centerY + 16f, textPaint)
    }
}

// Usage in XML
<com.example.app.CircularProgressView
    android:id="@+id/progressView"
    android:layout_width="200dp"
    android:layout_height="200dp" />

// Usage in code
binding.progressView.setProgress(75f)
```

## Practical Example: Login Screen

```xml
<!-- activity_login.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="24dp"
    android:background="#F5F5F5">
    
    <ImageView
        android:id="@+id/logoImage"
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:src="@drawable/ic_logo"
        android:contentDescription="App logo"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="48dp" />
    
    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome Back"
        android:textSize="28sp"
        android:textStyle="bold"
        android:textColor="#000000"
        app:layout_constraintTop_toBottomOf="@id/logoImage"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="24dp" />
    
    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/emailInputLayout"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toBottomOf="@id/titleText"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="32dp"
        app:startIconDrawable="@drawable/ic_email"
        style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox">
        
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/emailInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Email"
            android:inputType="textEmailAddress"
            android:maxLines="1" />
    </com.google.android.material.textfield.TextInputLayout>
    
    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/passwordInputLayout"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toBottomOf="@id/emailInputLayout"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="16dp"
        app:startIconDrawable="@drawable/ic_lock"
        app:endIconMode="password_toggle"
        style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox">
        
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/passwordInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Password"
            android:inputType="textPassword"
            android:maxLines="1" />
    </com.google.android.material.textfield.TextInputLayout>
    
    <CheckBox
        android:id="@+id/rememberCheckbox"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Remember me"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/passwordInputLayout"
        android:layout_marginTop="8dp" />
    
    <Button
        android:id="@+id/loginButton"
        android:layout_width="0dp"
        android:layout_height="56dp"
        android:text="Login"
        android:textSize="16sp"
        app:layout_constraintTop_toBottomOf="@id/rememberCheckbox"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="24dp" />
    
    <TextView
        android:id="@+id/forgotPasswordText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Forgot Password?"
        android:textColor="@color/purple_500"
        android:textSize="14sp"
        app:layout_constraintTop_toBottomOf="@id/loginButton"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="16dp" />
    
    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:visibility="gone"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

```kotlin
class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupViews()
    }
    
    private fun setupViews() {
        binding.loginButton.setOnClickListener {
            handleLogin()
        }
        
        binding.forgotPasswordText.setOnClickListener {
            // Navigate to forgot password screen
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }
    }
    
    private fun handleLogin() {
        val email = binding.emailInput.text.toString()
        val password = binding.passwordInput.text.toString()
        
        // Validate inputs
        when {
            email.isEmpty() -> {
                binding.emailInputLayout.error = "Email is required"
                return
            }
            !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> {
                binding.emailInputLayout.error = "Invalid email format"
                return
            }
            password.isEmpty() -> {
                binding.passwordInputLayout.error = "Password is required"
                return
            }
            password.length < 6 -> {
                binding.passwordInputLayout.error = "Password must be at least 6 characters"
                return
            }
        }
        
        // Clear errors
        binding.emailInputLayout.error = null
        binding.passwordInputLayout.error = null
        
        // Show loading
        binding.progressBar.visibility = View.VISIBLE
        binding.loginButton.isEnabled = false
        
        // Simulate login (replace with actual API call)
        binding.root.postDelayed({
            binding.progressBar.visibility = View.GONE
            binding.loginButton.isEnabled = true
            
            // Navigate to main activity
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, 2000)
    }
}
```

## Key Takeaways

✅ Views are the building blocks of Android UI  
✅ Use ConstraintLayout for complex, flat hierarchies (better performance)  
✅ LinearLayout for simple sequential layouts  
✅ Always use `dp` for sizes, `sp` for text  
✅ View Binding provides type-safe access to views  
✅ Custom views extend View or existing view classes  
✅ Validate user input and provide clear error messages  

## Practice Exercise

Create a profile screen with:
1. Profile picture (ImageView)
2. Name and bio (TextViews)
3. Edit button
4. Stats (followers, following, posts) using ConstraintLayout
5. Action buttons (Follow, Message)

## Next Steps

Next, we'll explore Material Design components for beautiful, polished UIs!

---

**Resources:**
- [View Documentation](https://developer.android.com/reference/android/view/View)
- [Layouts Guide](https://developer.android.com/guide/topics/ui/declaring-layout)
- [ConstraintLayout](https://developer.android.com/training/constraint-layout)