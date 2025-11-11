---
title: Material Design Components
description: Build beautiful, modern UIs with Material Design 3 components and theming
platform: android
order: 10
---

# Material Design Components

Material Design is Google's design system for creating beautiful, intuitive user interfaces. Material Design 3 (Material You) brings personalization and modern aesthetics to Android apps.

## Setting Up Material Components

### Add Dependency

```kotlin
// build.gradle (Module: app)
dependencies {
    implementation 'com.google.android.material:material:1.10.0'
}
```

### Apply Material Theme

```xml
<!-- res/values/themes.xml -->
<resources>
    <style name="Theme.MyApp" parent="Theme.Material3.DayNight">
        <!-- Primary brand color -->
        <item name="colorPrimary">@color/md_theme_light_primary</item>
        <item name="colorOnPrimary">@color/md_theme_light_onPrimary</item>
        <item name="colorPrimaryContainer">@color/md_theme_light_primaryContainer</item>
        
        <!-- Secondary brand color -->
        <item name="colorSecondary">@color/md_theme_light_secondary</item>
        <item name="colorOnSecondary">@color/md_theme_light_onSecondary</item>
        
        <!-- Surface colors -->
        <item name="colorSurface">@color/md_theme_light_surface</item>
        <item name="colorOnSurface">@color/md_theme_light_onSurface</item>
        
        <!-- Background -->
        <item name="android:colorBackground">@color/md_theme_light_background</item>
        
        <!-- Error colors -->
        <item name="colorError">@color/md_theme_light_error</item>
        <item name="colorOnError">@color/md_theme_light_onError</item>
        
        <!-- Status bar -->
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
```

:::compare-react-native
React Native uses custom theming:
```javascript
// Theme configuration
const theme = {
    colors: {
        primary: '#6750A4',
        onPrimary: '#FFFFFF',
        secondary: '#625B71',
        surface: '#FFFBFE',
        background: '#FFFBFE',
        error: '#B3261E',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

// Apply with ThemeProvider
import { ThemeProvider } from 'styled-components';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Navigation />
        </ThemeProvider>
    );
}
```
Android has built-in Material theming, while React Native requires third-party libraries or custom implementation.
:::

## Material Buttons

```xml
<!-- Standard Button -->
<Button
    android:id="@+id/filledButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Filled Button"
    style="@style/Widget.Material3.Button" />

<!-- Outlined Button -->
<Button
    android:id="@+id/outlinedButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Outlined Button"
    style="@style/Widget.Material3.Button.OutlinedButton" />

<!-- Text Button -->
<Button
    android:id="@+id/textButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Text Button"
    style="@style/Widget.Material3.Button.TextButton" />

<!-- Elevated Button -->
<Button
    android:id="@+id/elevatedButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Elevated Button"
    style="@style/Widget.Material3.Button.ElevatedButton" />

<!-- Tonal Button -->
<Button
    android:id="@+id/tonalButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Tonal Button"
    style="@style/Widget.Material3.Button.TonalButton" />

<!-- Icon Button -->
<Button
    android:id="@+id/iconButton"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Download"
    app:icon="@drawable/ic_download"
    app:iconGravity="start" />
```

```kotlin
class ButtonsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityButtonsBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityButtonsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        binding.filledButton.setOnClickListener {
            showSnackbar("Filled button clicked")
        }
        
        // Disable button
        binding.filledButton.isEnabled = false
        
        // Change button text
        binding.textButton.text = "New Text"
        
        // Programmatically set icon
        binding.iconButton.icon = getDrawable(R.drawable.ic_check)
    }
    
    private fun showSnackbar(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
    }
}
```

## Text Fields (TextInputLayout)

```xml
<!-- Basic Text Field -->
<com.google.android.material.textfield.TextInputLayout
    android:id="@+id/nameInputLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Name"
    style="@style/Widget.Material3.TextInputLayout.OutlinedBox">
    
    <com.google.android.material.textfield.TextInputEditText
        android:id="@+id/nameInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="textPersonName"
        android:maxLines="1" />
</com.google.android.material.textfield.TextInputLayout>

<!-- With Start Icon -->
<com.google.android.material.textfield.TextInputLayout
    android:id="@+id/emailInputLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Email"
    app:startIconDrawable="@drawable/ic_email"
    style="@style/Widget.Material3.TextInputLayout.OutlinedBox">
    
    <com.google.android.material.textfield.TextInputEditText
        android:id="@+id/emailInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="textEmailAddress" />
</com.google.android.material.textfield.TextInputLayout>

<!-- Password Field with Toggle -->
<com.google.android.material.textfield.TextInputLayout
    android:id="@+id/passwordInputLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Password"
    app:startIconDrawable="@drawable/ic_lock"
    app:endIconMode="password_toggle"
    style="@style/Widget.Material3.TextInputLayout.OutlinedBox">
    
    <com.google.android.material.textfield.TextInputEditText
        android:id="@+id/passwordInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="textPassword" />
</com.google.android.material.textfield.TextInputLayout>

<!-- Filled Style -->
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Phone"
    app:startIconDrawable="@drawable/ic_phone"
    style="@style/Widget.Material3.TextInputLayout.FilledBox">
    
    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="phone" />
</com.google.android.material.textfield.TextInputLayout>

<!-- With Character Counter -->
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Bio"
    app:counterEnabled="true"
    app:counterMaxLength="100"
    style="@style/Widget.Material3.TextInputLayout.OutlinedBox">
    
    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="textMultiLine"
        android:lines="3"
        android:gravity="top"
        android:maxLength="100" />
</com.google.android.material.textfield.TextInputLayout>
```

```kotlin
// Validation with TextInputLayout
class FormActivity : AppCompatActivity() {
    private lateinit var binding: ActivityFormBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFormBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupValidation()
    }
    
    private fun setupValidation() {
        // Email validation
        binding.emailInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                val email = s.toString()
                if (email.isEmpty()) {
                    binding.emailInputLayout.error = null
                } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                    binding.emailInputLayout.error = "Invalid email format"
                } else {
                    binding.emailInputLayout.error = null
                }
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
        
        // Password validation
        binding.passwordInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                val password = s.toString()
                when {
                    password.isEmpty() -> {
                        binding.passwordInputLayout.error = null
                    }
                    password.length < 8 -> {
                        binding.passwordInputLayout.error = "Password must be at least 8 characters"
                    }
                    !password.any { it.isUpperCase() } -> {
                        binding.passwordInputLayout.error = "Password must contain uppercase letter"
                    }
                    !password.any { it.isDigit() } -> {
                        binding.passwordInputLayout.error = "Password must contain a number"
                    }
                    else -> {
                        binding.passwordInputLayout.error = null
                        binding.passwordInputLayout.helperText = "Strong password"
                    }
                }
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }
}
```

## Cards

```xml
<!-- Elevated Card (default) -->
<com.google.android.material.card.MaterialCardView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:cardElevation="4dp"
    app:cardCornerRadius="12dp">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">
        
        <ImageView
            android:layout_width="match_parent"
            android:layout_height="160dp"
            android:scaleType="centerCrop"
            android:src="@drawable/product_image" />
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Product Name"
            android:textSize="18sp"
            android:textStyle="bold"
            android:layout_marginTop="12dp" />
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="$99.99"
            android:textSize="16sp"
            android:textColor="@color/purple_500"
            android:layout_marginTop="4dp" />
        
        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Add to Cart"
            android:layout_marginTop="12dp"
            style="@style/Widget.Material3.Button.TonalButton" />
    </LinearLayout>
    
</com.google.android.material.card.MaterialCardView>

<!-- Outlined Card -->
<com.google.android.material.card.MaterialCardView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:strokeWidth="1dp"
    app:strokeColor="@color/md_theme_light_outline"
    app:cardElevation="0dp"
    app:cardCornerRadius="12dp">
    
    <!-- Content -->
    
</com.google.android.material.card.MaterialCardView>

<!-- Clickable Card -->
<com.google.android.material.card.MaterialCardView
    android:id="@+id/clickableCard"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    android:clickable="true"
    android:focusable="true"
    app:cardCornerRadius="12dp"
    style="@style/Widget.Material3.CardView.Elevated">
    
    <!-- Content -->
    
</com.google.android.material.card.MaterialCardView>
```

:::compare-react-native
React Native card component:
```javascript
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function ProductCard({ product }) {
    return (
        <TouchableOpacity style={styles.card}>
            <Image 
                source={{ uri: product.image }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 160,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: '#6750A4',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#E8DEF8',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
});
```
Both provide card components with similar styling capabilities.
:::

## Chips

```xml
<!-- Single Choice Chips -->
<com.google.android.material.chip.ChipGroup
    android:id="@+id/chipGroup"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:singleSelection="true"
    app:selectionRequired="true">
    
    <com.google.android.material.chip.Chip
        android:id="@+id/chipAll"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="All"
        android:checked="true"
        style="@style/Widget.Material3.Chip.Filter" />
    
    <com.google.android.material.chip.Chip
        android:id="@+id/chipActive"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Active"
        style="@style/Widget.Material3.Chip.Filter" />
    
    <com.google.android.material.chip.Chip
        android:id="@+id/chipCompleted"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Completed"
        style="@style/Widget.Material3.Chip.Filter" />
</com.google.android.material.chip.ChipGroup>

<!-- Action Chips -->
<com.google.android.material.chip.Chip
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Add tag"
    app:chipIcon="@drawable/ic_add"
    style="@style/Widget.Material3.Chip.Assist" />

<!-- Input Chips (removable) -->
<com.google.android.material.chip.Chip
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Kotlin"
    app:closeIcon="@drawable/ic_close"
    app:closeIconEnabled="true"
    style="@style/Widget.Material3.Chip.Input" />
```

```kotlin
class ChipsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityChipsBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChipsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Listen to chip selection
        binding.chipGroup.setOnCheckedStateChangeListener { group, checkedIds ->
            val selectedChipId = checkedIds.firstOrNull()
            when (selectedChipId) {
                R.id.chipAll -> filterTasks("all")
                R.id.chipActive -> filterTasks("active")
                R.id.chipCompleted -> filterTasks("completed")
            }
        }
        
        // Add chips dynamically
        addTagChips(listOf("Android", "Kotlin", "Java", "Material Design"))
    }
    
    private fun addTagChips(tags: List<String>) {
        tags.forEach { tag ->
            val chip = Chip(this).apply {
                text = tag
                isCloseIconVisible = true
                setOnCloseIconClickListener {
                    binding.tagChipGroup.removeView(this)
                }
            }
            binding.tagChipGroup.addView(chip)
        }
    }
    
    private fun filterTasks(filter: String) {
        // Filter logic
    }
}
```

## Floating Action Button (FAB)

```xml
<!-- Regular FAB -->
<com.google.android.material.floatingactionbutton.FloatingActionButton
    android:id="@+id/fab"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="bottom|end"
    android:layout_margin="16dp"
    android:contentDescription="Add"
    app:srcCompat="@drawable/ic_add" />

<!-- Extended FAB -->
<com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton
    android:id="@+id/extendedFab"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="bottom|end"
    android:layout_margin="16dp"
    android:text="Create Task"
    app:icon="@drawable/ic_add" />

<!-- Small FAB -->
<com.google.android.material.floatingactionbutton.FloatingActionButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:fabSize="mini"
    app:srcCompat="@drawable/ic_edit" />
```

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        binding.fab.setOnClickListener {
            // Open create dialog or activity
            openCreateTaskDialog()
        }
        
        // Hide FAB on scroll
        binding.recyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                if (dy > 0) {
                    binding.fab.hide()
                } else {
                    binding.fab.show()
                }
            }
        })
    }
}
```

## Snackbar

```kotlin
// Basic Snackbar
Snackbar.make(view, "Item deleted", Snackbar.LENGTH_SHORT).show()

// With action
Snackbar.make(view, "Item deleted", Snackbar.LENGTH_LONG)
    .setAction("UNDO") {
        // Restore deleted item
        restoreItem()
    }
    .show()

// Custom styling
Snackbar.make(view, "Error occurred", Snackbar.LENGTH_LONG)
    .setBackgroundTint(getColor(R.color.error))
    .setTextColor(getColor(R.color.white))
    .setActionTextColor(getColor(R.color.yellow))
    .setAction("RETRY") {
        retryOperation()
    }
    .show()

// Positioned above FAB
Snackbar.make(view, "Message", Snackbar.LENGTH_SHORT)
    .setAnchorView(binding.fab)  // Snackbar appears above FAB
    .show()
```

## Bottom Navigation

```xml
<!-- activity_main.xml -->
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <FrameLayout
        android:id="@+id/container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="?attr/actionBarSize" />
    
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        app:menu="@menu/bottom_navigation_menu" />
    
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

```xml
<!-- res/menu/bottom_navigation_menu.xml -->
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/nav_home"
        android:icon="@drawable/ic_home"
        android:title="Home" />
    
    <item
        android:id="@+id/nav_search"
        android:icon="@drawable/ic_search"
        android:title="Search" />
    
    <item
        android:id="@+id/nav_favorites"
        android:icon="@drawable/ic_favorite"
        android:title="Favorites" />
    
    <item
        android:id="@+id/nav_profile"
        android:icon="@drawable/ic_person"
        android:title="Profile" />
</menu>
```

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomNavigation()
    }
    
    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(HomeFragment())
                    true
                }
                R.id.nav_search -> {
                    loadFragment(SearchFragment())
                    true
                }
                R.id.nav_favorites -> {
                    loadFragment(FavoritesFragment())
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
        
        // Set default selection
        binding.bottomNavigation.selectedItemId = R.id.nav_home
    }
    
    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .commit()
    }
}
```

## Dialog

```kotlin
// Material Alert Dialog
MaterialAlertDialogBuilder(this)
    .setTitle("Delete Item?")
    .setMessage("This action cannot be undone.")
    .setPositiveButton("Delete") { dialog, _ ->
        deleteItem()
        dialog.dismiss()
    }
    .setNegativeButton("Cancel") { dialog, _ ->
        dialog.dismiss()
    }
    .show()

// With single choice
val options = arrayOf("Option 1", "Option 2", "Option 3")
var selectedOption = 0

MaterialAlertDialogBuilder(this)
    .setTitle("Select Option")
    .setSingleChoiceItems(options, selectedOption) { _, which ->
        selectedOption = which
    }
    .setPositiveButton("OK") { dialog, _ ->
        handleSelection(options[selectedOption])
        dialog.dismiss()
    }
    .setNegativeButton("Cancel", null)
    .show()

// With multiple choice
val items = arrayOf("Item 1", "Item 2", "Item 3")
val checkedItems = booleanArrayOf(false, true, false)

MaterialAlertDialogBuilder(this)
    .setTitle("Select Items")
    .setMultiChoiceItems(items, checkedItems) { _, which, isChecked ->
        checkedItems[which] = isChecked
    }
    .setPositiveButton("OK") { dialog, _ ->
        handleMultipleSelection(items, checkedItems)
        dialog.dismiss()
    }
    .show()

// Custom view dialog
val dialogView = layoutInflater.inflate(R.layout.dialog_custom, null)
val nameInput = dialogView.findViewById<TextInputEditText>(R.id.nameInput)

MaterialAlertDialogBuilder(this)
    .setTitle("Enter Name")
    .setView(dialogView)
    .setPositiveButton("Save") { dialog, _ ->
        val name = nameInput.text.toString()
        saveName(name)
        dialog.dismiss()
    }
    .setNegativeButton("Cancel", null)
    .show()
```

## Bottom Sheet

```xml
<!-- Bottom Sheet Layout -->
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <!-- Main Content -->
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
    
    <!-- Bottom Sheet -->
    <LinearLayout
        android:id="@+id/bottomSheet"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp"
        android:background="@drawable/bottom_sheet_background"
        app:layout_behavior="com.google.android.material.bottomsheet.BottomSheetBehavior">
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Bottom Sheet Title"
            android:textSize="20sp"
            android:textStyle="bold" />
        
        <TextView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="This is a bottom sheet with some content"
            android:layout_marginTop="8dp" />
        
        <Button
            android:id="@+id/actionButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Action"
            android:layout_marginTop="16dp" />
    </LinearLayout>
    
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<LinearLayout>
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomSheet()
    }
    
    private fun setupBottomSheet() {
        bottomSheetBehavior = BottomSheetBehavior.from(binding.bottomSheet)
        
        // Set initial state
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_HIDDEN
        
        // Listen to state changes
        bottomSheetBehavior.addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(bottomSheet: View, newState: Int) {
                when (newState) {
                    BottomSheetBehavior.STATE_EXPANDED -> {
                        // Fully expanded
                    }
                    BottomSheetBehavior.STATE_COLLAPSED -> {
                        // Partially visible
                    }
                    BottomSheetBehavior.STATE_HIDDEN -> {
                        // Hidden
                    }
                }
            }
            
            override fun onSlide(bottomSheet: View, slideOffset: Float) {
                // Called while dragging
            }
        })
        
        // Show bottom sheet
        binding.showSheetButton.setOnClickListener {
            bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
        }
    }
}

// Bottom Sheet Dialog Fragment
class OptionsBottomSheet : BottomSheetDialogFragment() {
    private var _binding: BottomSheetOptionsBinding? = null
    private val binding get() = _binding!!
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = BottomSheetOptionsBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        binding.option1.setOnClickListener {
            // Handle option 1
            dismiss()
        }
        
        binding.option2.setOnClickListener {
            // Handle option 2
            dismiss()
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Show bottom sheet dialog
val bottomSheet = OptionsBottomSheet()
bottomSheet.show(supportFragmentManager, "OptionsBottomSheet")
```

## Progress Indicators

```xml
<!-- Linear Progress Indicator -->
<com.google.android.material.progressindicator.LinearProgressIndicator
    android:id="@+id/linearProgress"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:indeterminate="true" />

<!-- Determinate Linear Progress -->
<com.google.android.material.progressindicator.LinearProgressIndicator
    android:id="@+id/downloadProgress"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:max="100"
    android:progress="0" />

<!-- Circular Progress Indicator -->
<com.google.android.material.progressindicator.CircularProgressIndicator
    android:id="@+id/circularProgress"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:indeterminate="true" />

<!-- Determinate Circular Progress -->
<com.google.android.material.progressindicator.CircularProgressIndicator
    android:id="@+id/uploadProgress"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:max="100"
    android:progress="0" />
```

```kotlin
class ProgressActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProgressBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProgressBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Show indeterminate progress
        binding.linearProgress.show()
        
        // Simulate download progress
        simulateDownload()
    }
    
    private fun simulateDownload() {
        var progress = 0
        val handler = Handler(Looper.getMainLooper())
        
        val runnable = object : Runnable {
            override fun run() {
                if (progress <= 100) {
                    binding.downloadProgress.setProgressCompat(progress, true)
                    binding.uploadProgress.setProgressCompat(progress, true)
                    progress += 10
                    handler.postDelayed(this, 500)
                } else {
                    // Download complete
                    binding.linearProgress.hide()
                }
            }
        }
        
        handler.post(runnable)
    }
}
```

## Practical Example: E-Commerce Product Screen

```xml
<!-- activity_product_detail.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
        
        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:title="Product Details"
            app:navigationIcon="@drawable/ic_back" />
    </com.google.android.material.appbar.AppBarLayout>
    
    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">
        
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">
            
            <!-- Product Image -->
            <com.google.android.material.card.MaterialCardView
                android:layout_width="match_parent"
                android:layout_height="300dp"
                app:cardCornerRadius="16dp"
                app:cardElevation="4dp">
                
                <ImageView
                    android:id="@+id/productImage"
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:scaleType="centerCrop"
                    android:contentDescription="Product image" />
            </com.google.android.material.card.MaterialCardView>
            
            <!-- Product Title -->
            <TextView
                android:id="@+id/productTitle"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Wireless Headphones"
                android:textSize="24sp"
                android:textStyle="bold"
                android:layout_marginTop="16dp" />
            
            <!-- Rating -->
            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:layout_marginTop="8dp">
                
                <TextView
                    android:id="@+id/ratingText"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="★ 4.5"
                    android:textSize="16sp"
                    android:textColor="@color/orange" />
                
                <TextView
                    android:id="@+id/reviewCount"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="(128 reviews)"
                    android:textSize="14sp"
                    android:textColor="@android:color/darker_gray"
                    android:layout_marginStart="8dp" />
            </LinearLayout>
            
            <!-- Price -->
            <TextView
                android:id="@+id/priceText"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="$79.99"
                android:textSize="32sp"
                android:textStyle="bold"
                android:textColor="@color/purple_500"
                android:layout_marginTop="16dp" />
            
            <!-- Color Selection -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Color"
                android:textSize="16sp"
                android:textStyle="bold"
                android:layout_marginTop="24dp" />
            
            <com.google.android.material.chip.ChipGroup
                android:id="@+id/colorChipGroup"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                app:singleSelection="true"
                app:selectionRequired="true">
                
                <com.google.android.material.chip.Chip
                    android:id="@+id/chipBlack"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Black"
                    android:checked="true"
                    style="@style/Widget.Material3.Chip.Filter" />
                
                <com.google.android.material.chip.Chip
                    android:id="@+id/chipWhite"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="White"
                    style="@style/Widget.Material3.Chip.Filter" />
                
                <com.google.android.material.chip.Chip
                    android:id="@+id/chipBlue"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Blue"
                    style="@style/Widget.Material3.Chip.Filter" />
            </com.google.android.material.chip.ChipGroup>
            
            <!-- Description -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Description"
                android:textSize="16sp"
                android:textStyle="bold"
                android:layout_marginTop="24dp" />
            
            <TextView
                android:id="@+id/descriptionText"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Premium wireless headphones with active noise cancellation and 30-hour battery life."
                android:textSize="14sp"
                android:lineSpacingExtra="4dp"
                android:layout_marginTop="8dp" />
            
            <!-- Quantity Selector -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Quantity"
                android:textSize="16sp"
                android:textStyle="bold"
                android:layout_marginTop="24dp" />
            
            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:layout_marginTop="8dp">
                
                <Button
                    android:id="@+id/decreaseButton"
                    android:layout_width="48dp"
                    android:layout_height="48dp"
                    android:text="-"
                    android:textSize="20sp"
                    style="@style/Widget.Material3.Button.OutlinedButton" />
                
                <TextView
                    android:id="@+id/quantityText"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="1"
                    android:textSize="20sp"
                    android:layout_gravity="center"
                    android:paddingHorizontal="24dp" />
                
                <Button
                    android:id="@+id/increaseButton"
                    android:layout_width="48dp"
                    android:layout_height="48dp"
                    android:text="+"
                    android:textSize="20sp"
                    style="@style/Widget.Material3.Button.OutlinedButton" />
            </LinearLayout>
            
            <View
                android:layout_width="match_parent"
                android:layout_height="80dp" />
        </LinearLayout>
    </androidx.core.widget.NestedScrollView>
    
    <!-- Bottom Buttons -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:orientation="horizontal"
        android:padding="16dp"
        android:background="@color/white"
        android:elevation="8dp">
        
        <Button
            android:id="@+id/addToCartButton"
            android:layout_width="0dp"
            android:layout_height="56dp"
            android:layout_weight="1"
            android:text="Add to Cart"
            android:layout_marginEnd="8dp"
            style="@style/Widget.Material3.Button.OutlinedButton" />
        
        <Button
            android:id="@+id/buyNowButton"
            android:layout_width="0dp"
            android:layout_height="56dp"
            android:layout_weight="1"
            android:text="Buy Now"
            android:layout_marginStart="8dp" />
    </LinearLayout>
    
    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/favoriteFab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="top|end"
        android:layout_margin="16dp"
        app:srcCompat="@drawable/ic_favorite_border"
        app:layout_anchor="@id/productImage"
        app:layout_anchorGravity="top|end" />
    
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

```kotlin
class ProductDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProductDetailBinding
    private var quantity = 1
    private var isFavorite = false
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProductDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupQuantitySelector()
        setupButtons()
        loadProductData()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }
    
    private fun setupQuantitySelector() {
        binding.decreaseButton.setOnClickListener {
            if (quantity > 1) {
                quantity--
                binding.quantityText.text = quantity.toString()
            }
        }
        
        binding.increaseButton.setOnClickListener {
            if (quantity < 10) {
                quantity++
                binding.quantityText.text = quantity.toString()
            }
        }
    }
    
    private fun setupButtons() {
        // Add to Cart
        binding.addToCartButton.setOnClickListener {
            addToCart()
        }
        
        // Buy Now
        binding.buyNowButton.setOnClickListener {
            buyNow()
        }
        
        // Favorite Toggle
        binding.favoriteFab.setOnClickListener {
            isFavorite = !isFavorite
            updateFavoriteIcon()
            
            val message = if (isFavorite) {
                "Added to favorites"
            } else {
                "Removed from favorites"
            }
            
            Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT)
                .setAnchorView(binding.buyNowButton.parent as View)
                .show()
        }
        
        // Color Selection
        binding.colorChipGroup.setOnCheckedStateChangeListener { group, checkedIds ->
            val selectedChipId = checkedIds.firstOrNull()
            when (selectedChipId) {
                R.id.chipBlack -> updateProductColor("Black")
                R.id.chipWhite -> updateProductColor("White")
                R.id.chipBlue -> updateProductColor("Blue")
            }
        }
    }
    
    private fun loadProductData() {
        // Simulate loading product data
        binding.productTitle.text = "Wireless Headphones Pro"
        binding.priceText.text = "$79.99"
        binding.ratingText.text = "★ 4.5"
        binding.reviewCount.text = "(128 reviews)"
        binding.descriptionText.text = """
            Premium wireless headphones with active noise cancellation,
            30-hour battery life, and premium sound quality.
            Perfect for music lovers and professionals.
        """.trimIndent()
    }
    
    private fun addToCart() {
        // Show progress
        binding.addToCartButton.isEnabled = false
        
        // Simulate adding to cart
        Handler(Looper.getMainLooper()).postDelayed({
            binding.addToCartButton.isEnabled = true
            
            Snackbar.make(binding.root, "Added $quantity item(s) to cart", Snackbar.LENGTH_LONG)
                .setAction("VIEW CART") {
                    // Navigate to cart
                    startActivity(Intent(this, CartActivity::class.java))
                }
                .setAnchorView(binding.buyNowButton.parent as View)
                .show()
        }, 1000)
    }
    
    private fun buyNow() {
        // Navigate to checkout
        val intent = Intent(this, CheckoutActivity::class.java).apply {
            putExtra("QUANTITY", quantity)
            putExtra("PRODUCT_ID", getProductId())
        }
        startActivity(intent)
    }
    
    private fun updateFavoriteIcon() {
        val iconRes = if (isFavorite) {
            R.drawable.ic_favorite_filled
        } else {
            R.drawable.ic_favorite_border
        }
        binding.favoriteFab.setImageResource(iconRes)
    }
    
    private fun updateProductColor(color: String) {
        // Update product image based on color
        Snackbar.make(binding.root, "Selected color: $color", Snackbar.LENGTH_SHORT)
            .setAnchorView(binding.buyNowButton.parent as View)
            .show()
    }
    
    private fun getProductId(): String = "PROD_001"
}
```

## Key Takeaways

✅ Material Design provides polished, consistent UI components  
✅ Material 3 (Material You) supports dynamic theming and personalization  
✅ Use TextInputLayout for validated text inputs with error messages  
✅ Cards group related content effectively  
✅ FABs highlight primary actions  
✅ Snackbars provide lightweight, non-intrusive feedback  
✅ Bottom Navigation and Bottom Sheets improve mobile UX  
✅ Chips enable compact selections and filters  

## Practice Exercise

Create a social media post screen with:
1. AppBar with back button and menu
2. User profile card with avatar and name
3. Post content with images (using CardView)
4. Action buttons (Like, Comment, Share) using IconButtons
5. FAB for creating new post
6. Bottom Navigation for app sections

## Next Steps

Next, we'll dive into RecyclerView for displaying efficient, scrollable lists of data!

---

**Resources:**
- [Material Design 3](https://m3.material.io/)
- [Material Components Android](https://material.io/develop/android)
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)