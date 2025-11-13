---
title: Dependency Injection with Hilt
description: Master dependency injection with Hilt for scalable, testable Android applications
platform: android
order: 16
---

# Dependency Injection with Hilt

Hilt is Android's recommended dependency injection (DI) solution built on top of Dagger. It simplifies DI setup and integrates seamlessly with Android components.

## Why Dependency Injection?

**Without DI (Manual Dependencies):**
```kotlin
class UserRepository(private val apiService: ApiService, private val database: AppDatabase)

class UserViewModel : ViewModel() {
    // ❌ ViewModel creates its own dependencies
    private val apiService = RetrofitClient.create()
    private val database = AppDatabase.getInstance(context) // Need context!
    private val repository = UserRepository(apiService, database)
}
```

**Problems:**
- Hard to test (can't mock dependencies)
- Tight coupling between classes
- Difficult to replace implementations
- Manual dependency management
- Need to pass context around

**With DI (Injected Dependencies):**
```kotlin
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    // ✅ Dependencies injected automatically
    // Easy to test, loose coupling
}
```

:::compare-react-native
React Context for dependency injection:
```javascript
// Context Provider
const ApiContext = createContext();

function ApiProvider({ children }) {
    const apiService = useMemo(() => new ApiService(), []);
    
    return (
        <ApiContext.Provider value={apiService}>
            {children}
        </ApiContext.Provider>
    );
}

// Usage in component
function UserScreen() {
    const apiService = useContext(ApiContext);
    
    useEffect(() => {
        apiService.getUsers().then(setUsers);
    }, []);
}

// Or use libraries like Redux, MobX for global state
```
Hilt provides compile-time safety and better performance than React Context's runtime approach.
:::

## Setup Hilt

### 1. Add Dependencies

```kotlin
// build.gradle (Project)
buildscript {
    dependencies {
        classpath 'com.google.dagger:hilt-android-gradle-plugin:2.48'
    }
}

// build.gradle (Module: app)
plugins {
    id 'kotlin-kapt'
    id 'dagger.hilt.android.plugin'
}

dependencies {
    // Hilt
    implementation 'com.google.dagger:hilt-android:2.48'
    kapt 'com.google.dagger:hilt-compiler:2.48'
    
    // Hilt ViewModel
    implementation 'androidx.hilt:hilt-navigation-fragment:1.1.0'
    
    // For instrumented tests
    androidTestImplementation 'com.google.dagger:hilt-android-testing:2.48'
    kaptAndroidTest 'com.google.dagger:hilt-compiler:2.48'
}
```

### 2. Create Application Class

```kotlin
@HiltAndroidApp
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize app-level dependencies
    }
}
```

```xml
<!-- AndroidManifest.xml -->
<application
    android:name=".MyApplication"
    ...>
</application>
```

## Basic Hilt Usage

### Injecting into Activity

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    
    // Field injection
    @Inject
    lateinit var analytics: AnalyticsService
    
    @Inject
    lateinit var preferences: PreferencesManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Dependencies are injected before onCreate
        analytics.logScreenView("MainActivity")
        val isDarkMode = preferences.isDarkMode
    }
}
```

### Injecting into Fragment

```kotlin
@AndroidEntryPoint
class HomeFragment : Fragment() {
    
    @Inject
    lateinit var repository: UserRepository
    
    // ViewModel injection (preferred way)
    private val viewModel: HomeViewModel by viewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Dependencies available here
        repository.loadData()
    }
}
```

### Injecting into ViewModel

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository,
    private val analytics: AnalyticsService
) : ViewModel() {
    
    val users: LiveData<List<User>> = userRepository.users.asLiveData()
    
    fun loadUsers() {
        viewModelScope.launch {
            userRepository.refreshUsers()
        }
    }
}

// Usage in Fragment (no manual factory needed!)
@AndroidEntryPoint
class UserListFragment : Fragment() {
    
    private val viewModel: UserViewModel by viewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        viewModel.users.observe(viewLifecycleOwner) { users ->
            adapter.submitList(users)
        }
    }
}
```

## Hilt Modules

Modules tell Hilt how to provide dependencies.

### @Provides - For External Classes

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

### @Binds - For Interfaces

```kotlin
interface UserRepository {
    suspend fun getUsers(): List<User>
}

class UserRepositoryImpl @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) : UserRepository {
    override suspend fun getUsers(): List<User> {
        // Implementation
        return apiService.getUsers()
    }
}

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindUserRepository(
        impl: UserRepositoryImpl
    ): UserRepository
}
```

### Database Module

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideDatabase(
        @ApplicationContext context: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "app_database"
        )
            .fallbackToDestructiveMigration()
            .build()
    }
    
    @Provides
    fun provideUserDao(database: AppDatabase): UserDao {
        return database.userDao()
    }
    
    @Provides
    fun provideProductDao(database: AppDatabase): ProductDao {
        return database.productDao()
    }
}
```

## Scopes in Hilt

```kotlin
// Singleton - Lives for entire app lifetime
@Singleton
@Provides
fun provideAnalytics(): AnalyticsService { ... }

// ViewModelScoped - Lives as long as ViewModel
@ViewModelScoped
@Provides
fun provideUseCase(): UseCase { ... }

// ActivityScoped - Lives as long as Activity
@ActivityScoped
@Provides
fun provideActivityDependency(): ActivityDependency { ... }

// ActivityRetainedScoped - Survives config changes
@ActivityRetainedScoped
@Provides
fun provideRetainedDependency(): RetainedDependency { ... }

// FragmentScoped - Lives as long as Fragment
@FragmentScoped
@Provides
fun provideFragmentDependency(): FragmentDependency { ... }
```

### Component Hierarchy

```
SingletonComponent (Application scope)
    ↓
ActivityRetainedComponent (Survives config changes)
    ↓
ViewModelComponent (ViewModel scope)
    ↓
ActivityComponent (Activity scope)
    ↓
FragmentComponent (Fragment scope)
    ↓
ViewComponent (View scope)
```

## Qualifiers (Multiple Implementations)

```kotlin
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class AuthInterceptor

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class LoggingInterceptor

@Module
@InstallIn(SingletonComponent::class)
object InterceptorModule {
    
    @Provides
    @AuthInterceptor
    fun provideAuthInterceptor(
        tokenManager: TokenManager
    ): Interceptor {
        return Interceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer ${tokenManager.getToken()}")
                .build()
            chain.proceed(request)
        }
    }
    
    @Provides
    @LoggingInterceptor
    fun provideLoggingInterceptor(): Interceptor {
        return HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
    }
    
    @Provides
    @Singleton
    fun provideOkHttpClient(
        @AuthInterceptor authInterceptor: Interceptor,
        @LoggingInterceptor loggingInterceptor: Interceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .build()
    }
}
```

## Practical Example: Complete E-Commerce App

### Data Layer

```kotlin
// API Service
interface ApiService {
    @GET("products")
    suspend fun getProducts(): List<Product>
    
    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Product
    
    @POST("orders")
    suspend fun createOrder(@Body order: Order): OrderResponse
}

// Repository Interface
interface ProductRepository {
    fun getProducts(): Flow<List<Product>>
    suspend fun getProductById(id: Int): Product?
    suspend fun refreshProducts()
}

// Repository Implementation
class ProductRepositoryImpl @Inject constructor(
    private val apiService: ApiService,
    private val productDao: ProductDao,
    private val ioDispatcher: CoroutineDispatcher
) : ProductRepository {
    
    override fun getProducts(): Flow<List<Product>> {
        return productDao.getAllProducts()
    }
    
    override suspend fun getProductById(id: Int): Product? {
        return withContext(ioDispatcher) {
            productDao.getProductById(id) ?: run {
                val product = apiService.getProductById(id)
                productDao.insert(product)
                product
            }
        }
    }
    
    override suspend fun refreshProducts() {
        withContext(ioDispatcher) {
            val products = apiService.getProducts()
            productDao.deleteAll()
            productDao.insertAll(products)
        }
    }
}
```

### Hilt Modules

```kotlin
// Network Module
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideGson(): Gson {
        return GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
            .create()
    }
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
            })
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(
        okHttpClient: OkHttpClient,
        gson: Gson
    ): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }
    
    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}

// Database Module
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideAppDatabase(
        @ApplicationContext context: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "ecommerce_database"
        )
            .fallbackToDestructiveMigration()
            .build()
    }
    
    @Provides
    fun provideProductDao(database: AppDatabase) = database.productDao()
    
    @Provides
    fun provideOrderDao(database: AppDatabase) = database.orderDao()
    
    @Provides
    fun provideUserDao(database: AppDatabase) = database.userDao()
}

// Repository Module
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindProductRepository(
        impl: ProductRepositoryImpl
    ): ProductRepository
    
    @Binds
    @Singleton
    abstract fun bindOrderRepository(
        impl: OrderRepositoryImpl
    ): OrderRepository
    
    @Binds
    @Singleton
    abstract fun bindUserRepository(
        impl: UserRepositoryImpl
    ): UserRepository
}

// Dispatcher Module
@Module
@InstallIn(SingletonComponent::class)
object DispatcherModule {
    
    @Provides
    @DefaultDispatcher
    fun provideDefaultDispatcher(): CoroutineDispatcher = Dispatchers.Default
    
    @Provides
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
    
    @Provides
    @MainDispatcher
    fun provideMainDispatcher(): CoroutineDispatcher = Dispatchers.Main
}

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class DefaultDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class MainDispatcher
```

### ViewModel with Hilt

```kotlin
@HiltViewModel
class ProductListViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    val products: StateFlow<List<Product>> = productRepository.getProducts()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
    
    init {
        refreshProducts()
    }
    
    fun refreshProducts() {
        viewModelScope.launch(ioDispatcher) {
            _uiState.value = UiState.Loading
            
            try {
                productRepository.refreshProducts()
                _uiState.value = UiState.Success
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
    
    sealed class UiState {
        object Loading : UiState()
        object Success : UiState()
        data class Error(val message: String) : UiState()
    }
}

@HiltViewModel
class ProductDetailViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    
    private val productId: Int = savedStateHandle["productId"] ?: 0
    
    private val _product = MutableStateFlow<Product?>(null)
    val product: StateFlow<Product?> = _product.asStateFlow()
    
    init {
        loadProduct()
    }
    
    private fun loadProduct() {
        viewModelScope.launch {
            _product.value = productRepository.getProductById(productId)
        }
    }
}
```

### Fragment with Hilt

```kotlin
@AndroidEntryPoint
class ProductListFragment : Fragment() {
    
    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: ProductListViewModel by viewModels()
    
    @Inject
    lateinit var analytics: AnalyticsService
    
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
        
        analytics.logScreenView("ProductList")
        
        setupRecyclerView()
        observeViewModel()
        setupSwipeRefresh()
    }
    
    private fun setupRecyclerView() {
        adapter = ProductAdapter { product ->
            navigateToDetails(product.id)
        }
        
        binding.recyclerView.apply {
            layoutManager = GridLayoutManager(context, 2)
            adapter = this@ProductListFragment.adapter
        }
    }
    
    private fun observeViewModel() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                launch {
                    viewModel.products.collect { products ->
                        adapter.submitList(products)
                    }
                }
                
                launch {
                    viewModel.uiState.collect { state ->
                        handleUiState(state)
                    }
                }
            }
        }
    }
    
    private fun handleUiState(state: ProductListViewModel.UiState) {
        when (state) {
            is ProductListViewModel.UiState.Loading -> {
                binding.progressBar.visibility = View.VISIBLE
            }
            is ProductListViewModel.UiState.Success -> {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefresh.isRefreshing = false
            }
            is ProductListViewModel.UiState.Error -> {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefresh.isRefreshing = false
                showError(state.message)
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.refreshProducts()
        }
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("RETRY") {
                viewModel.refreshProducts()
            }
            .show()
    }
    
    private fun navigateToDetails(productId: Int) {
        val action = ProductListFragmentDirections
            .actionProductListToProductDetail(productId)
        findNavController().navigate(action)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Testing with Hilt

### Unit Testing ViewModel

```kotlin
@HiltAndroidTest
class ProductListViewModelTest {
    
    @get:Rule
    var hiltRule = HiltAndroidRule(this)
    
    @get:Rule
    val instantTaskExecutorRule = InstantTaskExecutorRule()
    
    @Inject
    lateinit var productRepository: ProductRepository
    
    private lateinit var viewModel: ProductListViewModel
    
    @Before
    fun setup() {
        hiltRule.inject()
        viewModel = ProductListViewModel(productRepository, Dispatchers.Unconfined)
    }
    
    @Test
    fun `refreshProducts updates uiState to Success when repository succeeds`() = runTest {
        // Given
        coEvery { productRepository.refreshProducts() } returns Unit
        
        // When
        viewModel.refreshProducts()
        
        // Then
        assertEquals(ProductListViewModel.UiState.Success, viewModel.uiState.value)
    }
}
```

### Custom Test Module

```kotlin
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [RepositoryModule::class]
)
abstract class TestRepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindProductRepository(
        impl: FakeProductRepository
    ): ProductRepository
}

class FakeProductRepository @Inject constructor() : ProductRepository {
    private val products = MutableStateFlow<List<Product>>(emptyList())
    
    override fun getProducts(): Flow<List<Product>> = products
    
    override suspend fun getProductById(id: Int): Product? {
        return products.value.find { it.id == id }
    }
    
    override suspend fun refreshProducts() {
        products.value = listOf(
            Product(1, "Test Product", 99.99, "Electronics")
        )
    }
    
    fun setProducts(productList: List<Product>) {
        products.value = productList
    }
}
```

## Common Patterns

### Providing Context

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideSharedPreferences(
        @ApplicationContext context: Context
    ): SharedPreferences {
        return context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    }
}
```

### Assisted Injection (Constructor Parameters)

```kotlin
class ReportGenerator @AssistedInject constructor(
    private val repository: ReportRepository,
    @Assisted private val reportType: ReportType
) {
    @AssistedFactory
    interface Factory {
        fun create(reportType: ReportType): ReportGenerator
    }
    
    fun generate() {
        // Generate report
    }
}

// Usage
@AndroidEntryPoint
class ReportActivity : AppCompatActivity() {
    
    @Inject
    lateinit var reportGeneratorFactory: ReportGenerator.Factory
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val generator = reportGeneratorFactory.create(ReportType.MONTHLY)
        generator.generate()
    }
}
```

## Key Takeaways

✅ Hilt simplifies dependency injection setup  
✅ Use `@HiltAndroidApp` for Application class  
✅ Annotate Activities/Fragments with `@AndroidEntryPoint`  
✅ Use `@HiltViewModel` for ViewModels  
✅ `@Provides` for external classes, `@Binds` for interfaces  
✅ Scopes control dependency lifetime  
✅ Qualifiers distinguish multiple implementations  
✅ Makes testing easier with dependency replacement  

## Best Practices

1. **Use interfaces for repositories** - Easier to mock in tests
2. **Prefer @Binds over @Provides** - More efficient
3. **Use appropriate scopes** - Avoid memory leaks
4. **Create separate modules** - Better organization
5. **Use qualifiers for variants** - Clear distinction
6. **Inject interfaces, not implementations** - Loose coupling
7. **Test with Hilt** - Replace modules for testing

## Practice Exercise

Create a news app with Hilt:
1. Network module with Retrofit
2. Database module with Room
3. Repository layer with DI
4. ViewModels with injected repositories
5. Fragments with injected dependencies
6. Multiple qualifiers for different API endpoints
7. Unit tests with Hilt testing

## Next Steps

Next, we'll explore Retrofit for API integration and network calls!

---

**Resources:**
- [Hilt Documentation](https://developer.android.com/training/dependency-injection/hilt-android)
- [Dependency Injection Guide](https://developer.android.com/training/dependency-injection)
- [Hilt Testing](https://developer.android.com/training/dependency-injection/hilt-testing)