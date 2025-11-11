---
title: Navigation & Fragments
description: Build multi-screen apps with Fragments and the Navigation Component
platform: android
order: 12
---

# Navigation & Fragments

Fragments are reusable UI components that represent a portion of a screen. Combined with the Navigation Component, they enable sophisticated multi-screen apps with proper back stack management.

## What are Fragments?

Fragments are modular sections of an Activity with their own:
- Lifecycle
- Layout
- Logic
- Back stack entry

**Benefits:**
- Reusability across different activities
- Better tablet support (multi-pane layouts)
- Modular, testable code
- Proper lifecycle management

:::compare-react-native
React Navigation for screen management:
```javascript
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Navigate to screen
navigation.navigate('Details', { itemId: 86 });

// Go back
navigation.goBack();
```
Both provide declarative navigation, but Android's Navigation Component integrates more deeply with the platform (back button, deep linking).
:::

## Creating a Basic Fragment

### 1. Add Dependencies

```kotlin
// build.gradle (Module: app)
dependencies {
    // Navigation
    implementation 'androidx.navigation:navigation-fragment-ktx:2.7.5'
    implementation 'androidx.navigation:navigation-ui-ktx:2.7.5'
    
    // Fragment
    implementation 'androidx.fragment:fragment-ktx:1.6.2'
}
```

### 2. Create Fragment Class

```kotlin
class HomeFragment : Fragment() {
    
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Setup UI
        setupViews()
    }
    
    private fun setupViews() {
        binding.welcomeText.text = "Welcome to Home"
        
        binding.detailsButton.setOnClickListener {
            // Navigate to details fragment
            findNavController().navigate(R.id.action_home_to_details)
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null  // Prevent memory leaks
    }
}
```

### 3. Create Fragment Layout

```xml
<!-- fragment_home.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">
    
    <TextView
        android:id="@+id/welcomeText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome!"
        android:textSize="24sp"
        android:textStyle="bold"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
    
    <Button
        android:id="@+id/detailsButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Go to Details"
        app:layout_constraintTop_toBottomOf="@id/welcomeText"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        android:layout_marginTop="24dp" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

## Navigation Component Setup

### 1. Create Navigation Graph

```xml
<!-- res/navigation/nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">
    
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.HomeFragment"
        android:label="Home">
        
        <action
            android:id="@+id/action_home_to_details"
            app:destination="@id/detailsFragment"
            app:enterAnim="@anim/slide_in_right"
            app:exitAnim="@anim/slide_out_left"
            app:popEnterAnim="@anim/slide_in_left"
            app:popExitAnim="@anim/slide_out_right" />
    </fragment>
    
    <fragment
        android:id="@+id/detailsFragment"
        android:name="com.example.app.DetailsFragment"
        android:label="Details">
        
        <argument
            android:name="itemId"
            app:argType="integer"
            android:defaultValue="0" />
    </fragment>
    
</navigation>
```

### 2. Add NavHostFragment to Activity

```xml
<!-- activity_main.xml -->
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

### 3. Setup Activity

```kotlin
class MainActivity : AppCompatActivity() {
    
    private lateinit var navController: NavController
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Get NavController
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        // Setup action bar with navigation
        setupActionBarWithNavController(navController)
    }
    
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }
}
```

## Passing Data Between Fragments

### Using Safe Args (Recommended)

```kotlin
// build.gradle (Project)
buildscript {
    dependencies {
        classpath "androidx.navigation:navigation-safe-args-gradle-plugin:2.7.5"
    }
}

// build.gradle (Module: app)
plugins {
    id 'androidx.navigation.safeargs.kotlin'
}
```

```xml
<!-- Update nav_graph.xml -->
<fragment
    android:id="@+id/detailsFragment"
    android:name="com.example.app.DetailsFragment"
    android:label="Details">
    
    <argument
        android:name="itemId"
        app:argType="integer" />
    
    <argument
        android:name="itemName"
        app:argType="string" />
</fragment>
```

```kotlin
// Navigate with arguments
class HomeFragment : Fragment() {
    
    private fun navigateToDetails(itemId: Int, itemName: String) {
        val action = HomeFragmentDirections.actionHomeToDetails(itemId, itemName)
        findNavController().navigate(action)
    }
}

// Receive arguments
class DetailsFragment : Fragment() {
    
    private val args: DetailsFragmentArgs by navArgs()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val itemId = args.itemId
        val itemName = args.itemName
        
        binding.itemNameText.text = itemName
        loadItemDetails(itemId)
    }
}
```

### Using Bundle (Alternative)

```kotlin
// Send data
val bundle = Bundle().apply {
    putInt("ITEM_ID", 42)
    putString("ITEM_NAME", "Product")
}
findNavController().navigate(R.id.detailsFragment, bundle)

// Receive data
class DetailsFragment : Fragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val itemId = arguments?.getInt("ITEM_ID") ?: 0
        val itemName = arguments?.getString("ITEM_NAME") ?: ""
    }
}
```

## Fragment Lifecycle

```
┌────────────────┐
│   onAttach     │  Fragment attached to activity
└────────┬───────┘
         ↓
┌────────────────┐
│   onCreate     │  Fragment created
└────────┬───────┘
         ↓
┌────────────────┐
│onCreateView    │  Create fragment's view
└────────┬───────┘
         ↓
┌────────────────┐
│onViewCreated   │  View created, safe to access views
└────────┬───────┘
         ↓
┌────────────────┐
│   onStart      │  Fragment becomes visible
└────────┬───────┘
         ↓
┌────────────────┐
│   onResume     │  Fragment interactive
└────────┬───────┘
         ↓
┌────────────────┐
│   Running      │  User interacts
└────────┬───────┘
         ↓
┌────────────────┐
│   onPause      │  Fragment losing focus
└────────┬───────┘
         ↓
┌────────────────┐
│   onStop       │  Fragment no longer visible
└────────┬───────┘
         ↓
┌────────────────┐
│onDestroyView   │  View destroyed
└────────┬───────┘
         ↓
┌────────────────┐
│  onDestroy     │  Fragment destroyed
└────────┬───────┘
         ↓
┌────────────────┐
│   onDetach     │  Fragment detached from activity
└────────────────┘
```

```kotlin
class ExampleFragment : Fragment() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Initialize non-view objects
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate layout
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // Setup views, click listeners, observe LiveData
    }
    
    override fun onStart() {
        super.onStart()
        // Fragment becomes visible
    }
    
    override fun onResume() {
        super.onResume()
        // Fragment interactive, start animations
    }
    
    override fun onPause() {
        super.onPause()
        // Fragment losing focus, pause ongoing actions
    }
    
    override fun onStop() {
        super.onStop()
        // Fragment no longer visible
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        // Clean up view-related resources
        _binding = null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        // Final cleanup
    }
}
```

## Fragment Communication

### Using ViewModel (Recommended)

```kotlin
// Shared ViewModel
class SharedViewModel : ViewModel() {
    private val _selectedItem = MutableLiveData<Item>()
    val selectedItem: LiveData<Item> = _selectedItem
    
    fun selectItem(item: Item) {
        _selectedItem.value = item
    }
}

// Fragment A - Send data
class ListFragment : Fragment() {
    private val viewModel: SharedViewModel by activityViewModels()
    
    private fun onItemClick(item: Item) {
        viewModel.selectItem(item)
        findNavController().navigate(R.id.action_list_to_details)
    }
}

// Fragment B - Receive data
class DetailsFragment : Fragment() {
    private val viewModel: SharedViewModel by activityViewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        viewModel.selectedItem.observe(viewLifecycleOwner) { item ->
            displayItem(item)
        }
    }
}
```

### Using Fragment Result API

```kotlin
// Fragment A - Send result
class DialogFragment : Fragment() {
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        binding.confirmButton.setOnClickListener {
            val result = Bundle().apply {
                putString("RESULT_KEY", "confirmed")
            }
            setFragmentResult("requestKey", result)
            findNavController().popBackStack()
        }
    }
}

// Fragment B - Receive result
class HomeFragment : Fragment() {
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setFragmentResultListener("requestKey") { _, bundle ->
            val result = bundle.getString("RESULT_KEY")
            Toast.makeText(context, "Result: $result", Toast.LENGTH_SHORT).show()
        }
    }
}
```

## Bottom Navigation with Fragments

```xml
<!-- activity_main.xml -->
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@id/bottomNavigation"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
    
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        app:menu="@menu/bottom_nav_menu"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

```xml
<!-- res/menu/bottom_nav_menu.xml -->
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/homeFragment"
        android:icon="@drawable/ic_home"
        android:title="Home" />
    
    <item
        android:id="@+id/searchFragment"
        android:icon="@drawable/ic_search"
        android:title="Search" />
    
    <item
        android:id="@+id/profileFragment"
        android:icon="@drawable/ic_person"
        android:title="Profile" />
</menu>
```

```xml
<!-- res/navigation/nav_graph.xml -->
<navigation
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">
    
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.HomeFragment"
        android:label="Home" />
    
    <fragment
        android:id="@+id/searchFragment"
        android:name="com.example.app.SearchFragment"
        android:label="Search" />
    
    <fragment
        android:id="@+id/profileFragment"
        android:name="com.example.app.ProfileFragment"
        android:label="Profile" />
</navigation>
```

```kotlin
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupNavigation()
    }
    
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        // Connect BottomNavigationView with NavController
        binding.bottomNavigation.setupWithNavController(navController)
        
        // Optional: Handle reselection
        binding.bottomNavigation.setOnItemReselectedListener { item ->
            // Scroll to top or refresh
            when (item.itemId) {
                R.id.homeFragment -> {
                    // Scroll to top of home feed
                }
            }
        }
    }
}
```

## Practical Example: E-Commerce App

```kotlin
// Product List Fragment
class ProductListFragment : Fragment() {
    
    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: ProductAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductListBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        loadProducts()
    }
    
    private fun setupRecyclerView() {
        adapter = ProductAdapter { product ->
            navigateToDetails(product)
        }
        
        binding.recyclerView.apply {
            layoutManager = GridLayoutManager(context, 2)
            adapter = this@ProductListFragment.adapter
        }
    }
    
    private fun navigateToDetails(product: Product) {
        val action = ProductListFragmentDirections
            .actionProductListToProductDetails(product.id, product.name)
        findNavController().navigate(action)
    }
    
    private fun loadProducts() {
        // Load products from repository/ViewModel
        val products = listOf(
            Product(1, "Laptop", 999.99, "laptop.jpg"),
            Product(2, "Phone", 699.99, "phone.jpg"),
            Product(3, "Tablet", 499.99, "tablet.jpg")
        )
        adapter.submitList(products)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Product Details Fragment
class ProductDetailsFragment : Fragment() {
    
    private var _binding: FragmentProductDetailsBinding? = null
    private val binding get() = _binding!!
    private val args: ProductDetailsFragmentArgs by navArgs()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductDetailsBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        loadProductDetails()
        setupButtons()
    }
    
    private fun loadProductDetails() {
        val productId = args.productId
        val productName = args.productName
        
        binding.productName.text = productName
        // Load more details using productId
    }
    
    private fun setupButtons() {
        binding.addToCartButton.setOnClickListener {
            addToCart()
        }
        
        binding.buyNowButton.setOnClickListener {
            navigateToCheckout()
        }
    }
    
    private fun addToCart() {
        Snackbar.make(binding.root, "Added to cart", Snackbar.LENGTH_SHORT)
            .setAction("VIEW") {
                navigateToCart()
            }
            .show()
    }
    
    private fun navigateToCheckout() {
        val action = ProductDetailsFragmentDirections
            .actionProductDetailsToCheckout()
        findNavController().navigate(action)
    }
    
    private fun navigateToCart() {
        findNavController().navigate(R.id.cartFragment)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Cart Fragment
class CartFragment : Fragment() {
    
    private var _binding: FragmentCartBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: CartAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCartBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        loadCartItems()
        setupCheckoutButton()
    }
    
    private fun setupRecyclerView() {
        adapter = CartAdapter(
            onQuantityChanged = { item, quantity ->
                updateQuantity(item, quantity)
            },
            onRemoveClick = { item ->
                removeItem(item)
            }
        )
        
        binding.cartRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@CartFragment.adapter
        }
    }
    
    private fun loadCartItems() {
        // Load cart items from repository/ViewModel
    }
    
    private fun setupCheckoutButton() {
        binding.checkoutButton.setOnClickListener {
            val action = CartFragmentDirections.actionCartToCheckout()
            findNavController().navigate(action)
        }
    }
    
    private fun updateQuantity(item: CartItem, quantity: Int) {
        // Update quantity
        updateTotalPrice()
    }
    
    private fun removeItem(item: CartItem) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Remove Item")
            .setMessage("Remove ${item.productName} from cart?")
            .setPositiveButton("Remove") { _, _ ->
                // Remove item
                updateTotalPrice()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun updateTotalPrice() {
        val total = adapter.currentList.sumOf { it.price * it.quantity }
        binding.totalPriceText.text = "$${"%.2f".format(total)}"
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Key Takeaways

✅ Fragments enable modular, reusable UI components  
✅ Navigation Component provides type-safe navigation  
✅ Use Safe Args for type-safe argument passing  
✅ Always nullify binding in onDestroyView to prevent memory leaks  
✅ Use `by activityViewModels()` for shared ViewModels  
✅ Fragment Result API for one-time communication  
✅ Bottom Navigation integrates seamlessly with Navigation Component  

## Practice Exercise

Create a news app with:
1. Bottom Navigation (Home, Categories, Bookmarks, Profile)
2. Article list fragment with RecyclerView
3. Article detail fragment with Safe Args
4. Search fragment with search functionality
5. Proper back stack management
6. Shared ViewModel for article state

## Next Steps

Next, we'll explore data persistence with SharedPreferences and Room database!

---

**Resources:**
- [Fragments Guide](https://developer.android.com/guide/fragments)
- [Navigation Component](https://developer.android.com/guide/navigation)
- [Fragment Communication](https://developer.android.com/guide/fragments/communicate)