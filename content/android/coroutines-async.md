---
title: Coroutines & Async Programming
description: Master Kotlin Coroutines for efficient asynchronous programming in Android
platform: android
order: 18
---

# Coroutines & Async Programming

Kotlin Coroutines provide a powerful way to handle asynchronous operations without blocking threads, making your Android apps more responsive and efficient.

## Why Coroutines?

**Traditional Callbacks (Callback Hell):**
```kotlin
// ❌ Hard to read and maintain
fetchUser(userId) { user ->
    fetchPosts(user.id) { posts ->
        fetchComments(posts[0].id) { comments ->
            updateUI(comments)
        }
    }
}
```

**With Coroutines:**
```kotlin
// ✅ Clean, sequential code
viewModelScope.launch {
    val user = fetchUser(userId)
    val posts = fetchPosts(user.id)
    val comments = fetchComments(posts[0].id)
    updateUI(comments)
}
```

:::compare-react-native
JavaScript async/await:
```javascript
// Very similar to Kotlin coroutines
async function loadData() {
    try {
        const user = await fetchUser(userId);
        const posts = await fetchPosts(user.id);
        const comments = await fetchComments(posts[0].id);
        updateUI(comments);
    } catch (error) {
        handleError(error);
    }
}

// Or using Promises
fetchUser(userId)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => updateUI(comments))
    .catch(error => handleError(error));
```
Kotlin coroutines and JavaScript async/await solve the same problem with similar syntax.
:::

## Setup

```kotlin
// build.gradle (Module: app)
dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // For testing
    testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3'
}
```

## Coroutine Basics

### Launch - Fire and Forget

```kotlin
// Launch a coroutine
GlobalScope.launch {
    // This runs on a background thread
    val data = fetchData()
    println("Data: $data")
}

// In ViewModel
viewModelScope.launch {
    // Automatically cancelled when ViewModel is cleared
    val users = repository.getUsers()
    _users.value = users
}

// In Activity/Fragment
lifecycleScope.launch {
    // Automatically cancelled when lifecycle is destroyed
    val result = performTask()
    updateUI(result)
}
```

### Async - Return a Result

```kotlin
// Single async operation
val deferred = async {
    fetchData()
}
val result = deferred.await()

// Parallel execution
val users = async { fetchUsers() }
val posts = async { fetchPosts() }
val products = async { fetchProducts() }

// Wait for all
val userData = users.await()
val postData = posts.await()
val productData = products.await()
```

### Suspending Functions

```kotlin
// Regular function (blocks thread)
fun fetchData(): String {
    Thread.sleep(1000)
    return "Data"
}

// Suspend function (doesn't block)
suspend fun fetchData(): String {
    delay(1000) // Suspends, doesn't block
    return "Data"
}

// Calling suspend functions
suspend fun loadUserProfile(userId: Int): UserProfile {
    val user = fetchUser(userId) // suspend function
    val posts = fetchPosts(userId) // suspend function
    return UserProfile(user, posts)
}
```

## Dispatchers

```kotlin
// Dispatchers.Main - UI operations
viewModelScope.launch(Dispatchers.Main) {
    updateUI()
}

// Dispatchers.IO - Network, disk operations
viewModelScope.launch(Dispatchers.IO) {
    val data = database.query()
    val response = apiService.fetch()
}

// Dispatchers.Default - CPU-intensive work
viewModelScope.launch(Dispatchers.Default) {
    val result = performHeavyCalculation()
}

// Switch between dispatchers
viewModelScope.launch(Dispatchers.IO) {
    val data = fetchData() // IO thread
    
    withContext(Dispatchers.Main) {
        updateUI(data) // Main thread
    }
}
```

## Structured Concurrency

### CoroutineScope

```kotlin
class MyRepository(private val apiService: ApiService) {
    
    // Create custom scope
    private val repositoryScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    fun fetchData() {
        repositoryScope.launch {
            val data = apiService.getData()
            // Process data
        }
    }
    
    // Clean up
    fun cleanup() {
        repositoryScope.cancel()
    }
}

// In ViewModel (preferred)
class MyViewModel : ViewModel() {
    
    // viewModelScope is automatically cancelled in onCleared()
    fun loadData() {
        viewModelScope.launch {
            // Safe to use
        }
    }
}

// In Fragment
class MyFragment : Fragment() {
    
    // lifecycleScope is automatically cancelled
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        lifecycleScope.launch {
            // Safe to use
        }
        
        // Or use viewLifecycleOwner for fragments
        viewLifecycleOwner.lifecycleScope.launch {
            // Cancelled when view is destroyed
        }
    }
}
```

### Job Hierarchy

```kotlin
val parentJob = Job()
val scope = CoroutineScope(Dispatchers.Default + parentJob)

scope.launch { // Child job 1
    println("Child 1 started")
    delay(1000)
    println("Child 1 completed")
}

scope.launch { // Child job 2
    println("Child 2 started")
    delay(500)
    println("Child 2 completed")
}

// Cancel parent cancels all children
delay(700)
parentJob.cancel()
println("Parent cancelled")
```

### SupervisorJob

```kotlin
// Regular Job - one child failure cancels all
val job = Job()
val scope = CoroutineScope(job)

scope.launch {
    delay(100)
    throw Exception("Child 1 failed")
}

scope.launch {
    delay(200)
    println("Child 2 completed") // Won't print
}

// SupervisorJob - failures are isolated
val supervisorJob = SupervisorJob()
val scope2 = CoroutineScope(supervisorJob)

scope2.launch {
    delay(100)
    throw Exception("Child 1 failed")
}

scope2.launch {
    delay(200)
    println("Child 2 completed") // Will print
}
```

## Exception Handling

```kotlin
// Try-catch
viewModelScope.launch {
    try {
        val data = apiService.getData()
        updateUI(data)
    } catch (e: Exception) {
        handleError(e)
    }
}

// CoroutineExceptionHandler
val exceptionHandler = CoroutineExceptionHandler { _, exception ->
    println("Caught: ${exception.message}")
}

viewModelScope.launch(exceptionHandler) {
    throw Exception("Something went wrong")
}

// Supervision with error handling
supervisorScope {
    val job1 = launch {
        try {
            riskyOperation1()
        } catch (e: Exception) {
            handleError(e)
        }
    }
    
    val job2 = launch {
        try {
            riskyOperation2()
        } catch (e: Exception) {
            handleError(e)
        }
    }
}
```

## Flow - Reactive Streams

### Basic Flow

```kotlin
// Create a flow
fun getNumbers(): Flow<Int> = flow {
    for (i in 1..5) {
        delay(100)
        emit(i)
    }
}

// Collect flow
lifecycleScope.launch {
    getNumbers().collect { number ->
        println("Received: $number")
    }
}

// Flow from other sources
fun getUsersFlow(): Flow<List<User>> = flow {
    while (true) {
        val users = database.getUsers()
        emit(users)
        delay(5000) // Refresh every 5 seconds
    }
}
```

### Flow Operators

```kotlin
val flow = flow {
    emit(1)
    emit(2)
    emit(3)
}

// Map
flow.map { it * 2 }
    .collect { println(it) } // 2, 4, 6

// Filter
flow.filter { it > 1 }
    .collect { println(it) } // 2, 3

// Transform
flow.transform { value ->
    emit("String: $value")
    emit("Double: ${value * 2}")
}.collect { println(it) }

// Take
flow.take(2)
    .collect { println(it) } // 1, 2

// Combine flows
val flow1 = flowOf(1, 2, 3)
val flow2 = flowOf("A", "B", "C")

flow1.zip(flow2) { num, letter ->
    "$num$letter"
}.collect { println(it) } // 1A, 2B, 3C
```

### StateFlow & SharedFlow

```kotlin
class MyViewModel : ViewModel() {
    
    // StateFlow - holds state, always has value
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // SharedFlow - events, may not have value
    private val _events = MutableSharedFlow<Event>()
    val events: SharedFlow<Event> = _events.asSharedFlow()
    
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            
            try {
                val data = fetchData()
                _uiState.value = UiState.Success(data)
                _events.emit(Event.DataLoaded)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Error")
                _events.emit(Event.Error(e.message))
            }
        }
    }
}

sealed class UiState {
    object Loading : UiState()
    data class Success(val data: List<Item>) : UiState()
    data class Error(val message: String) : UiState()
}

sealed class Event {
    object DataLoaded : Event()
    data class Error(val message: String?) : Event()
}

// Collecting in Fragment
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        // Collect state
        launch {
            viewModel.uiState.collect { state ->
                handleState(state)
            }
        }
        
        // Collect events
        launch {
            viewModel.events.collect { event ->
                handleEvent(event)
            }
        }
    }
}
```

## Practical Examples

### Parallel API Calls

```kotlin
@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val postRepository: PostRepository,
    private val productRepository: ProductRepository
) : ViewModel() {
    
    private val _dashboardData = MutableStateFlow<DashboardData?>(null)
    val dashboardData: StateFlow<DashboardData?> = _dashboardData.asStateFlow()
    
    fun loadDashboard() {
        viewModelScope.launch {
            try {
                // Execute in parallel
                val users = async { userRepository.getUsers() }
                val posts = async { postRepository.getPosts() }
                val products = async { productRepository.getProducts() }
                
                // Wait for all to complete
                val dashboard = DashboardData(
                    users = users.await(),
                    posts = posts.await(),
                    products = products.await()
                )
                
                _dashboardData.value = dashboard
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}

data class DashboardData(
    val users: List<User>,
    val posts: List<Post>,
    val products: List<Product>
)
```

### Sequential with Progress

```kotlin
@HiltViewModel
class UploadViewModel @Inject constructor(
    private val uploadRepository: UploadRepository
) : ViewModel() {
    
    private val _uploadProgress = MutableStateFlow<Int>(0)
    val uploadProgress: StateFlow<Int> = _uploadProgress.asStateFlow()
    
    private val _uploadStatus = MutableStateFlow<UploadStatus>(UploadStatus.Idle)
    val uploadStatus: StateFlow<UploadStatus> = _uploadStatus.asStateFlow()
    
    fun uploadFiles(files: List<File>) {
        viewModelScope.launch {
            _uploadStatus.value = UploadStatus.Uploading
            
            try {
                files.forEachIndexed { index, file ->
                    uploadRepository.uploadFile(file)
                    
                    // Update progress
                    val progress = ((index + 1) * 100) / files.size
                    _uploadProgress.value = progress
                }
                
                _uploadStatus.value = UploadStatus.Success
            } catch (e: Exception) {
                _uploadStatus.value = UploadStatus.Error(e.message ?: "Upload failed")
            }
        }
    }
}

sealed class UploadStatus {
    object Idle : UploadStatus()
    object Uploading : UploadStatus()
    object Success : UploadStatus()
    data class Error(val message: String) : UploadStatus()
}
```

### Retry Logic

```kotlin
suspend fun <T> retryWithExponentialBackoff(
    times: Int = 3,
    initialDelay: Long = 100,
    maxDelay: Long = 1000,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) { attempt ->
        try {
            return block()
        } catch (e: Exception) {
            println("Attempt ${attempt + 1} failed: ${e.message}")
        }
        delay(currentDelay)
        currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelay)
    }
    return block() // Last attempt
}

// Usage
viewModelScope.launch {
    try {
        val data = retryWithExponentialBackoff {
            apiService.getData()
        }
        updateUI(data)
    } catch (e: Exception) {
        handleError(e)
    }
}
```

### Timeout

```kotlin
viewModelScope.launch {
    try {
        withTimeout(5000) { // 5 seconds
            val data = fetchData()
            updateUI(data)
        }
    } catch (e: TimeoutCancellationException) {
        showError("Request timed out")
    }
}

// With nullable return
val result = withTimeoutOrNull(5000) {
    fetchData()
}

if (result != null) {
    updateUI(result)
} else {
    showError("Request timed out")
}
```

### Debounce Search

```kotlin
class SearchViewModel : ViewModel() {
    
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    val searchResults: StateFlow<List<Item>> = _searchQuery
        .debounce(300) // Wait 300ms after last input
        .filter { it.length >= 3 } // Only search if 3+ characters
        .distinctUntilChanged() // Only if query changed
        .flatMapLatest { query ->
            flow {
                emit(repository.search(query))
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
    
    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }
}

// In Fragment
binding.searchInput.addTextChangedListener { text ->
    viewModel.onSearchQueryChanged(text.toString())
}

viewLifecycleOwner.lifecycleScope.launch {
    viewModel.searchResults.collect { results ->
        adapter.submitList(results)
    }
}
```

### Cache with Refresh

```kotlin
class ProductRepository @Inject constructor(
    private val apiService: ApiService,
    private val productDao: ProductDao
) {
    
    fun getProducts(forceRefresh: Boolean = false): Flow<Resource<List<Product>>> = flow {
        emit(Resource.Loading())
        
        // Emit cached data first (if not forcing refresh)
        if (!forceRefresh) {
            val cached = productDao.getAllProducts()
            if (cached.isNotEmpty()) {
                emit(Resource.Success(cached))
            }
        }
        
        // Fetch from network
        try {
            val products = apiService.getProducts()
            
            // Update cache
            productDao.deleteAll()
            productDao.insertAll(products)
            
            // Emit fresh data
            emit(Resource.Success(products))
        } catch (e: Exception) {
            // If we don't have cached data, emit error
            val cached = productDao.getAllProducts()
            if (cached.isEmpty()) {
                emit(Resource.Error(e.message ?: "Failed to fetch products"))
            }
            // Otherwise, keep showing cached data
        }
    }
}

// Usage in ViewModel
@HiltViewModel
class ProductViewModel @Inject constructor(
    private val repository: ProductRepository
) : ViewModel() {
    
    private val _refreshTrigger = MutableSharedFlow<Boolean>()
    
    val products: StateFlow<Resource<List<Product>>> = _refreshTrigger
        .onStart { emit(false) } // Initial load
        .flatMapLatest { forceRefresh ->
            repository.getProducts(forceRefresh)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = Resource.Loading()
        )
    
    fun refresh() {
        viewModelScope.launch {
            _refreshTrigger.emit(true)
        }
    }
}
```

## Testing Coroutines

```kotlin
@ExperimentalCoroutinesApi
class MyViewModelTest {
    
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    private lateinit var viewModel: MyViewModel
    private lateinit var repository: FakeRepository
    
    @Before
    fun setup() {
        repository = FakeRepository()
        viewModel = MyViewModel(repository)
    }
    
    @Test
    fun `loadData updates state to Success`() = runTest {
        // Given
        val expectedData = listOf(Item(1, "Test"))
        repository.setData(expectedData)
        
        // When
        viewModel.loadData()
        
        // Then
        val state = viewModel.uiState.value
        assertTrue(state is UiState.Success)
        assertEquals(expectedData, (state as UiState.Success).data)
    }
    
    @Test
    fun `loadData updates state to Error on exception`() = runTest {
        // Given
        repository.setShouldThrowError(true)
        
        // When
        viewModel.loadData()
        
        // Then
        val state = viewModel.uiState.value
        assertTrue(state is UiState.Error)
    }
}

// Test dispatcher rule
@ExperimentalCoroutinesApi
class MainDispatcherRule(
    private val testDispatcher: TestDispatcher = UnconfinedTestDispatcher()
) : TestWatcher() {
    
    override fun starting(description: Description) {
        Dispatchers.setMain(testDispatcher)
    }
    
    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
```

## Key Takeaways

✅ Coroutines simplify asynchronous programming  
✅ Use `suspend` functions for non-blocking operations  
✅ `viewModelScope` and `lifecycleScope` handle lifecycle automatically  
✅ Dispatchers control which thread code runs on  
✅ Flow provides reactive data streams  
✅ StateFlow for state, SharedFlow for events  
✅ Exception handling with try-catch or handlers  
✅ Structured concurrency prevents memory leaks  

## Best Practices

1. **Use viewModelScope in ViewModels**
2. **Use lifecycleScope in Activities/Fragments**
3. **Switch dispatchers with withContext**
4. **Handle exceptions explicitly**
5. **Use Flow for reactive data**
6. **Avoid GlobalScope** (use structured scopes)
7. **Cancel jobs when no longer needed**
8. **Test coroutines** with runTest

## Practice Exercise

Create a news app with coroutines:
1. Parallel API calls for multiple categories
2. Flow-based search with debounce
3. Cache-first data loading
4. Retry logic for failed requests
5. Progress indicators for long operations
6. Proper error handling
7. Unit tests for ViewModel

## Next Steps

Next, we'll explore testing strategies for Android apps!

---

**Resources:**
- [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [Android Coroutines Best Practices](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
- [Flow Documentation](https://kotlinlang.org/docs/flow.html)