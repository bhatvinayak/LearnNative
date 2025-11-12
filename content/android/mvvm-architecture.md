---
title: MVVM Architecture
description: Build scalable, maintainable apps with Model-View-ViewModel architecture pattern
platform: android
order: 14
---

# MVVM Architecture

MVVM (Model-View-ViewModel) is the recommended architecture pattern for Android apps. It provides clear separation of concerns, making your code more testable, maintainable, and scalable.

## Understanding MVVM

```
┌─────────────────────────────────────────┐
│              View (UI Layer)            │
│   Activities, Fragments, Composables    │
│  - Observes ViewModel                   │
│  - Displays data                        │
│  - Handles user input                   │
└────────────────┬────────────────────────┘
                 │ observes
                 ↓
┌─────────────────────────────────────────┐
│           ViewModel (Logic)             │
│  - Holds UI state                       │
│  - Handles business logic               │
│  - Survives configuration changes       │
│  - Exposes data via LiveData/Flow       │
└────────────────┬────────────────────────┘
                 │ calls
                 ↓
┌─────────────────────────────────────────┐
│        Model (Data Layer)               │
│  Repository, Database, Network          │
│  - Data source operations               │
│  - Business logic                       │
│  - Data transformation                  │
└─────────────────────────────────────────┘
```

**Benefits of MVVM:**
- ✅ Separation of concerns
- ✅ Easier testing
- ✅ Survives configuration changes (rotation)
- ✅ Reactive UI updates
- ✅ Reusable ViewModels
- ✅ Clear data flow

:::compare-react-native
React/Redux architecture pattern:
```javascript
// Similar separation of concerns

// View (Component)
function ProductList() {
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(loadProducts());
    }, []);
    
    return (
        <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
        />
    );
}

// Actions (like ViewModel methods)
const loadProducts = () => async (dispatch) => {
    dispatch({ type: 'PRODUCTS_LOADING' });
    try {
        const products = await api.getProducts();
        dispatch({ type: 'PRODUCTS_SUCCESS', payload: products });
    } catch (error) {
        dispatch({ type: 'PRODUCTS_ERROR', payload: error });
    }
};

// Reducer (State management)
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTS_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        default:
            return state;
    }
};
```
MVVM and Redux/MobX serve similar purposes: separating UI from business logic with reactive state management.
:::

## Layer 1: Model (Data Layer)

### Entity (Database Model)

```kotlin
@Entity(tableName = "products")
data class Product(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String,
    val category: String,
    val stock: Int,
    val rating: Double,
    val createdAt: Long = System.currentTimeMillis()
)
```

### DAO (Data Access Object)

```kotlin
@Dao
interface ProductDao {
    @Query("SELECT * FROM products ORDER BY createdAt DESC")
    fun getAllProducts(): Flow<List<Product>>
    
    @Query("SELECT * FROM products WHERE id = :productId")
    suspend fun getProductById(productId: Int): Product?
    
    @Query("SELECT * FROM products WHERE category = :category")
    fun getProductsByCategory(category: String): Flow<List<Product>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProduct(product: Product)
    
    @Insert
    suspend fun insertAll(products: List<Product>)
    
    @Update
    suspend fun updateProduct(product: Product)
    
    @Delete
    suspend fun deleteProduct(product: Product)
    
    @Query("DELETE FROM products")
    suspend fun deleteAll()
}
```

### Repository

```kotlin
class ProductRepository(
    private val productDao: ProductDao,
    private val apiService: ApiService
) {
    // Expose local database as Flow
    val products: Flow<List<Product>> = productDao.getAllProducts()
    
    // Fetch from network and update local database
    suspend fun refreshProducts() {
        try {
            val response = apiService.getProducts()
            if (response.isSuccessful) {
                response.body()?.let { products ->
                    productDao.deleteAll()
                    productDao.insertAll(products)
                }
            }
        } catch (e: Exception) {
            // Handle error
            throw e
        }
    }
    
    suspend fun getProductById(id: Int): Product? {
        // Try local first
        val localProduct = productDao.getProductById(id)
        if (localProduct != null) return localProduct
        
        // Fetch from network if not in local
        try {
            val response = apiService.getProductById(id)
            if (response.isSuccessful) {
                response.body()?.let { product ->
                    productDao.insertProduct(product)
                    return product
                }
            }
        } catch (e: Exception) {
            // Handle error
        }
        
        return null
    }
    
    fun getProductsByCategory(category: String): Flow<List<Product>> {
        return productDao.getProductsByCategory(category)
    }
    
    suspend fun addProduct(product: Product) {
        productDao.insertProduct(product)
    }
    
    suspend fun updateProduct(product: Product) {
        productDao.updateProduct(product)
    }
    
    suspend fun deleteProduct(product: Product) {
        productDao.deleteProduct(product)
    }
}
```

### API Service (for network calls)

```kotlin
interface ApiService {
    @GET("products")
    suspend fun getProducts(): Response<List<Product>>
    
    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Response<Product>
    
    @GET("products/category/{category}")
    suspend fun getProductsByCategory(@Path("category") category: String): Response<List<Product>>
    
    @POST("products")
    suspend fun createProduct(@Body product: Product): Response<Product>
    
    @PUT("products/{id}")
    suspend fun updateProduct(@Path("id") id: Int, @Body product: Product): Response<Product>
    
    @DELETE("products/{id}")
    suspend fun deleteProduct(@Path("id") id: Int): Response<Unit>
}
```

## Layer 2: ViewModel

### Basic ViewModel

```kotlin
class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {
    
    // UI State
    private val _uiState = MutableLiveData<ProductUiState>()
    val uiState: LiveData<ProductUiState> = _uiState
    
    // Products from database
    val products: LiveData<List<Product>> = repository.products.asLiveData()
    
    // Loading state
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    // Error state
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    init {
        loadProducts()
    }
    
    fun loadProducts() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                repository.refreshProducts()
                _uiState.value = ProductUiState.Success
            } catch (e: Exception) {
                _error.value = e.message
                _uiState.value = ProductUiState.Error(e.message ?: "Unknown error")
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun getProductById(id: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            
            try {
                val product = repository.getProductById(id)
                if (product != null) {
                    _uiState.value = ProductUiState.ProductLoaded(product)
                } else {
                    _error.value = "Product not found"
                }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun addProduct(product: Product) {
        viewModelScope.launch {
            try {
                repository.addProduct(product)
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
    
    fun deleteProduct(product: Product) {
        viewModelScope.launch {
            try {
                repository.deleteProduct(product)
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
    
    fun clearError() {
        _error.value = null
    }
}

// UI State sealed class
sealed class ProductUiState {
    object Loading : ProductUiState()
    object Success : ProductUiState()
    data class Error(val message: String) : ProductUiState()
    data class ProductLoaded(val product: Product) : ProductUiState()
}
```

### ViewModel with StateFlow (Modern Approach)

```kotlin
class ProductViewModelFlow(
    private val repository: ProductRepository
) : ViewModel() {
    
    // UI State as StateFlow
    private val _uiState = MutableStateFlow<ProductUiState>(ProductUiState.Loading)
    val uiState: StateFlow<ProductUiState> = _uiState.asStateFlow()
    
    // Products from repository
    val products: StateFlow<List<Product>> = repository.products
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
    
    init {
        loadProducts()
    }
    
    fun loadProducts() {
        viewModelScope.launch {
            _uiState.value = ProductUiState.Loading
            
            try {
                repository.refreshProducts()
                _uiState.value = ProductUiState.Success
            } catch (e: Exception) {
                _uiState.value = ProductUiState.Error(e.message ?: "Unknown error")
            }
        }
    }
    
    fun retry() {
        loadProducts()
    }
}
```

### ViewModel Factory

```kotlin
class ProductViewModelFactory(
    private val repository: ProductRepository
) : ViewModelProvider.Factory {
    
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ProductViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return ProductViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

## Layer 3: View (UI Layer)

### Fragment with ViewModel

```kotlin
class ProductListFragment : Fragment() {
    
    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!
    
    // ViewModel with factory
    private val viewModel: ProductViewModel by viewModels {
        ProductViewModelFactory(
            ProductRepository(
                requireContext().database.productDao(),
                RetrofitClient.apiService
            )
        )
    }
    
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
        observeViewModel()
        setupSwipeRefresh()
    }
    
    private fun setupRecyclerView() {
        adapter = ProductAdapter(
            onItemClick = { product ->
                navigateToDetails(product.id)
            },
            onDeleteClick = { product ->
                showDeleteConfirmation(product)
            }
        )
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@ProductListFragment.adapter
        }
    }
    
    private fun observeViewModel() {
        // Observe products
        viewModel.products.observe(viewLifecycleOwner) { products ->
            adapter.submitList(products)
            updateEmptyState(products.isEmpty())
        }
        
        // Observe loading state
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefresh.isRefreshing = isLoading
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
        
        // Observe errors
        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                showError(it)
                viewModel.clearError()
            }
        }
        
        // Observe UI state
        viewModel.uiState.observe(viewLifecycleOwner) { state ->
            handleUiState(state)
        }
    }
    
    private fun handleUiState(state: ProductUiState) {
        when (state) {
            is ProductUiState.Loading -> {
                binding.progressBar.visibility = View.VISIBLE
                binding.errorLayout.visibility = View.GONE
            }
            is ProductUiState.Success -> {
                binding.progressBar.visibility = View.GONE
                binding.errorLayout.visibility = View.GONE
            }
            is ProductUiState.Error -> {
                binding.progressBar.visibility = View.GONE
                binding.errorLayout.visibility = View.VISIBLE
                binding.errorText.text = state.message
            }
            is ProductUiState.ProductLoaded -> {
                // Handle specific product loaded
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadProducts()
        }
    }
    
    private fun updateEmptyState(isEmpty: Boolean) {
        binding.emptyState.visibility = if (isEmpty) View.VISIBLE else View.GONE
        binding.recyclerView.visibility = if (isEmpty) View.GONE else View.VISIBLE
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("RETRY") {
                viewModel.loadProducts()
            }
            .show()
    }
    
    private fun showDeleteConfirmation(product: Product) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Delete Product")
            .setMessage("Are you sure you want to delete ${product.name}?")
            .setPositiveButton("Delete") { _, _ ->
                viewModel.deleteProduct(product)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun navigateToDetails(productId: Int) {
        val action = ProductListFragmentDirections
            .actionProductListToProductDetails(productId)
        findNavController().navigate(action)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

### Fragment with StateFlow

```kotlin
class ProductListFragmentFlow : Fragment() {
    
    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: ProductViewModelFlow by viewModels {
        ProductViewModelFactory(repository)
    }
    
    private lateinit var adapter: ProductAdapter
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeViewModel()
    }
    
    private fun observeViewModel() {
        // Collect products
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.products.collect { products ->
                    adapter.submitList(products)
                    updateEmptyState(products.isEmpty())
                }
            }
        }
        
        // Collect UI state
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    handleUiState(state)
                }
            }
        }
    }
    
    private fun handleUiState(state: ProductUiState) {
        when (state) {
            is ProductUiState.Loading -> {
                binding.progressBar.visibility = View.VISIBLE
            }
            is ProductUiState.Success -> {
                binding.progressBar.visibility = View.GONE
            }
            is ProductUiState.Error -> {
                binding.progressBar.visibility = View.GONE
                showError(state.message)
            }
            is ProductUiState.ProductLoaded -> {
                // Handle
            }
        }
    }
}
```

## Complete MVVM Example: Shopping Cart

```kotlin
// Data Model
data class CartItem(
    val product: Product,
    var quantity: Int
)

// Repository
class CartRepository(
    private val productDao: ProductDao,
    private val preferencesManager: PreferencesManager
) {
    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()
    
    init {
        loadCart()
    }
    
    private fun loadCart() {
        // Load from preferences or database
        val savedCart = preferencesManager.getCart()
        _cartItems.value = savedCart
    }
    
    fun addToCart(product: Product, quantity: Int = 1) {
        val currentCart = _cartItems.value.toMutableList()
        val existingItem = currentCart.find { it.product.id == product.id }
        
        if (existingItem != null) {
            existingItem.quantity += quantity
        } else {
            currentCart.add(CartItem(product, quantity))
        }
        
        _cartItems.value = currentCart
        saveCart(currentCart)
    }
    
    fun removeFromCart(productId: Int) {
        val currentCart = _cartItems.value.toMutableList()
        currentCart.removeAll { it.product.id == productId }
        _cartItems.value = currentCart
        saveCart(currentCart)
    }
    
    fun updateQuantity(productId: Int, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        
        val currentCart = _cartItems.value.toMutableList()
        currentCart.find { it.product.id == productId }?.quantity = quantity
        _cartItems.value = currentCart
        saveCart(currentCart)
    }
    
    fun clearCart() {
        _cartItems.value = emptyList()
        saveCart(emptyList())
    }
    
    private fun saveCart(cart: List<CartItem>) {
        preferencesManager.saveCart(cart)
    }
    
    fun getTotal(): Double {
        return _cartItems.value.sumOf { it.product.price * it.quantity }
    }
    
    fun getItemCount(): Int {
        return _cartItems.value.sumOf { it.quantity }
    }
}

// ViewModel
class CartViewModel(
    private val cartRepository: CartRepository
) : ViewModel() {
    
    val cartItems: StateFlow<List<CartItem>> = cartRepository.cartItems
    
    val total: StateFlow<Double> = cartItems.map { items ->
        items.sumOf { it.product.price * it.quantity }
    }.stateIn(viewModelScope, SharingStarted.Lazily, 0.0)
    
    val itemCount: StateFlow<Int> = cartItems.map { items ->
        items.sumOf { it.quantity }
    }.stateIn(viewModelScope, SharingStarted.Lazily, 0)
    
    fun addToCart(product: Product, quantity: Int = 1) {
        cartRepository.addToCart(product, quantity)
    }
    
    fun removeFromCart(productId: Int) {
        cartRepository.removeFromCart(productId)
    }
    
    fun updateQuantity(productId: Int, quantity: Int) {
        cartRepository.updateQuantity(productId, quantity)
    }
    
    fun clearCart() {
        cartRepository.clearCart()
    }
    
    fun checkout() {
        viewModelScope.launch {
            // Process checkout
            // Call API, update database, etc.
        }
    }
}

// Fragment
class CartFragment : Fragment() {
    
    private var _binding: FragmentCartBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: CartViewModel by viewModels {
        CartViewModelFactory(cartRepository)
    }
    
    private lateinit var adapter: CartAdapter
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeCart()
        setupButtons()
    }
    
    private fun setupRecyclerView() {
        adapter = CartAdapter(
            onQuantityChanged = { item, quantity ->
                viewModel.updateQuantity(item.product.id, quantity)
            },
            onRemoveClick = { item ->
                viewModel.removeFromCart(item.product.id)
            }
        )
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@CartFragment.adapter
        }
    }
    
    private fun observeCart() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                // Observe cart items
                launch {
                    viewModel.cartItems.collect { items ->
                        adapter.submitList(items)
                        updateEmptyState(items.isEmpty())
                    }
                }
                
                // Observe total
                launch {
                    viewModel.total.collect { total ->
                        binding.totalText.text = "$${"%.2f".format(total)}"
                    }
                }
                
                // Observe item count
                launch {
                    viewModel.itemCount.collect { count ->
                        binding.itemCountText.text = "$count items"
                    }
                }
            }
        }
    }
    
    private fun setupButtons() {
        binding.checkoutButton.setOnClickListener {
            viewModel.checkout()
            navigateToCheckout()
        }
        
        binding.clearButton.setOnClickListener {
            showClearConfirmation()
        }
    }
    
    private fun updateEmptyState(isEmpty: Boolean) {
        binding.emptyState.visibility = if (isEmpty) View.VISIBLE else View.GONE
        binding.cartContent.visibility = if (isEmpty) View.GONE else View.VISIBLE
    }
    
    private fun showClearConfirmation() {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Clear Cart")
            .setMessage("Remove all items from cart?")
            .setPositiveButton("Clear") { _, _ ->
                viewModel.clearCart()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun navigateToCheckout() {
        findNavController().navigate(R.id.action_cart_to_checkout)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Testing MVVM Components

### Testing ViewModel

```kotlin
class ProductViewModelTest {
    
    @get:Rule
    val instantTaskExecutorRule = InstantTaskExecutorRule()
    
    private lateinit var viewModel: ProductViewModel
    private lateinit var repository: ProductRepository
    
    @Before
    fun setup() {
        repository = mockk()
        viewModel = ProductViewModel(repository)
    }
    
    @Test
    fun `loadProducts updates uiState to Success when repository call succeeds`() = runTest {
        // Given
        coEvery { repository.refreshProducts() } returns Unit
        
        // When
        viewModel.loadProducts()
        
        // Then
        assertEquals(ProductUiState.Success, viewModel.uiState.value)
        assertFalse(viewModel.isLoading.value == true)
    }
    
    @Test
    fun `loadProducts updates uiState to Error when repository call fails`() = runTest {
        // Given
        val errorMessage = "Network error"
        coEvery { repository.refreshProducts() } throws Exception(errorMessage)
        
        // When
        viewModel.loadProducts()
        
        // Then
        assertTrue(viewModel.uiState.value is ProductUiState.Error)
        assertEquals(errorMessage, viewModel.error.value)
    }
}
```

## Key Takeaways

✅ MVVM separates UI, business logic, and data layers  
✅ ViewModel survives configuration changes  
✅ Repository pattern abstracts data sources  
✅ Use LiveData or StateFlow for reactive UI updates  
✅ ViewModelScope manages coroutines lifecycle  
✅ Easier to test each layer independently  
✅ Single source of truth for UI state  

## Best Practices

1. **Never pass Context to ViewModel** (use AndroidViewModel if needed)
2. **ViewModel should not reference Views** directly
3. **Repository handles all data operations**
4. **Use sealed classes for UI states**
5. **Collect Flows in repeatOnLifecycle(STARTED)**
6. **Always nullify binding in onDestroyView**
7. **Use Factory pattern for ViewModel dependencies**

## Practice Exercise

Create a weather app with MVVM:
1. Repository fetching from weather API
2. Room database for offline caching
3. ViewModel managing UI state
4. Fragment displaying weather data
5. Pull-to-refresh functionality
6. Error handling and retry logic

## Next Steps

Next, we'll dive deeper into ViewModel and LiveData patterns!

---

**Resources:**
- [Guide to App Architecture](https://developer.android.com/topic/architecture)
- [ViewModel Overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [Repository Pattern](https://developer.android.com/codelabs/android-room-with-a-view-kotlin)