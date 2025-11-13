---
title: Retrofit & API Integration
description: Master network calls with Retrofit for seamless API integration in Android apps
platform: android
order: 17
---

# Retrofit & API Integration

Retrofit is a type-safe HTTP client for Android that makes API calls simple, clean, and maintainable.

## Why Retrofit?

**Benefits:**
- Type-safe API calls
- Automatic JSON parsing
- Easy integration with Coroutines
- Request/Response interceptors
- Error handling
- Mock responses for testing

:::compare-react-native
React Native uses Fetch API or Axios:
```javascript
// Fetch API
const getUsers = async () => {
    try {
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

// Axios (similar to Retrofit)
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
});

const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};
```
Retrofit provides more type safety and better integration with Android/Kotlin features.
:::

## Setup Retrofit

### Dependencies

```kotlin
// build.gradle (Module: app)
dependencies {
    // Retrofit
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    
    // OkHttp (for interceptors)
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Gson
    implementation 'com.google.code.gson:gson:2.10.1'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}
```

### Internet Permission

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Basic Retrofit Setup

### 1. Define Data Models

```kotlin
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val username: String,
    val phone: String?,
    val website: String?,
    val address: Address?
)

data class Address(
    val street: String,
    val city: String,
    val zipcode: String
)

data class Post(
    val id: Int,
    val userId: Int,
    val title: String,
    val body: String
)

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val message: String?
)
```

### 2. Create API Service Interface

```kotlin
interface ApiService {
    
    // GET request
    @GET("users")
    suspend fun getUsers(): List<User>
    
    // GET with path parameter
    @GET("users/{id}")
    suspend fun getUserById(@Path("id") userId: Int): User
    
    // GET with query parameters
    @GET("posts")
    suspend fun getPosts(
        @Query("userId") userId: Int? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): List<Post>
    
    // POST request
    @POST("users")
    suspend fun createUser(@Body user: User): User
    
    // PUT request
    @PUT("users/{id}")
    suspend fun updateUser(
        @Path("id") userId: Int,
        @Body user: User
    ): User
    
    // PATCH request
    @PATCH("users/{id}")
    suspend fun partialUpdateUser(
        @Path("id") userId: Int,
        @Body updates: Map<String, Any>
    ): User
    
    // DELETE request
    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: Int): Response<Unit>
    
    // Form URL encoded
    @FormUrlEncoded
    @POST("login")
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): ApiResponse<User>
    
    // Multipart (file upload)
    @Multipart
    @POST("upload")
    suspend fun uploadImage(
        @Part file: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): ApiResponse<String>
    
    // Custom headers
    @Headers("Cache-Control: max-age=3600")
    @GET("posts")
    suspend fun getCachedPosts(): List<Post>
    
    // Dynamic header
    @GET("users")
    suspend fun getAuthenticatedUsers(
        @Header("Authorization") token: String
    ): List<User>
}
```

### 3. Create Retrofit Instance

```kotlin
object RetrofitClient {
    
    private const val BASE_URL = "https://jsonplaceholder.typicode.com/"
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(loggingInterceptor)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

## Advanced Retrofit Features

### Custom Interceptors

```kotlin
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        val originalRequest = chain.request()
        
        // Add authentication token
        val newRequest = originalRequest.newBuilder()
            .addHeader("Authorization", "Bearer ${tokenManager.getToken()}")
            .addHeader("Accept", "application/json")
            .build()
        
        return chain.proceed(newRequest)
    }
}

class ErrorInterceptor : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        val request = chain.request()
        val response = chain.proceed(request)
        
        // Handle specific HTTP codes
        when (response.code) {
            401 -> {
                // Unauthorized - refresh token or logout
                throw UnauthorizedException("Session expired")
            }
            403 -> {
                throw ForbiddenException("Access denied")
            }
            404 -> {
                throw NotFoundException("Resource not found")
            }
            500, 502, 503 -> {
                throw ServerException("Server error")
            }
        }
        
        return response
    }
}

// Add to OkHttpClient
private val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenManager))
    .addInterceptor(ErrorInterceptor())
    .addInterceptor(loggingInterceptor)
    .build()
```

### Network Status Interceptor

```kotlin
class NetworkConnectionInterceptor(
    private val context: Context
) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        if (!isNetworkAvailable()) {
            throw NoInternetException("No internet connection")
        }
        
        return chain.proceed(chain.request())
    }
    
    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) 
            as ConnectivityManager
        
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}

// Custom exceptions
class NoInternetException(message: String) : IOException(message)
class UnauthorizedException(message: String) : IOException(message)
class ForbiddenException(message: String) : IOException(message)
class NotFoundException(message: String) : IOException(message)
class ServerException(message: String) : IOException(message)
```

### Response Wrapper

```kotlin
sealed class Resource<T> {
    data class Success<T>(val data: T) : Resource<T>()
    data class Error<T>(val message: String, val data: T? = null) : Resource<T>()
    class Loading<T> : Resource<T>()
}

// Extension function for safe API calls
suspend fun <T> safeApiCall(
    apiCall: suspend () -> T
): Resource<T> {
    return try {
        Resource.Success(apiCall())
    } catch (e: Exception) {
        when (e) {
            is NoInternetException -> {
                Resource.Error("No internet connection")
            }
            is UnauthorizedException -> {
                Resource.Error("Please login again")
            }
            is HttpException -> {
                Resource.Error("Server error: ${e.code()}")
            }
            else -> {
                Resource.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

## Repository Pattern with Retrofit

```kotlin
class UserRepository @Inject constructor(
    private val apiService: ApiService,
    private val userDao: UserDao,
    private val ioDispatcher: CoroutineDispatcher
) {
    
    // Get users from cache or network
    fun getUsers(): Flow<Resource<List<User>>> = flow {
        emit(Resource.Loading())
        
        // Emit cached data first
        val cachedUsers = userDao.getAllUsers()
        if (cachedUsers.isNotEmpty()) {
            emit(Resource.Success(cachedUsers))
        }
        
        // Fetch from network
        try {
            val users = apiService.getUsers()
            
            // Update cache
            userDao.deleteAll()
            userDao.insertAll(users)
            
            // Emit fresh data
            emit(Resource.Success(users))
        } catch (e: Exception) {
            if (cachedUsers.isEmpty()) {
                emit(Resource.Error(e.message ?: "Failed to fetch users"))
            }
            // If we have cached data, keep showing it
        }
    }.flowOn(ioDispatcher)
    
    // Get user by ID
    suspend fun getUserById(userId: Int): Resource<User> {
        return withContext(ioDispatcher) {
            safeApiCall {
                // Try cache first
                userDao.getUserById(userId) ?: run {
                    // Fetch from network
                    val user = apiService.getUserById(userId)
                    userDao.insert(user)
                    user
                }
            }
        }
    }
    
    // Create user
    suspend fun createUser(user: User): Resource<User> {
        return withContext(ioDispatcher) {
            safeApiCall {
                val createdUser = apiService.createUser(user)
                userDao.insert(createdUser)
                createdUser
            }
        }
    }
    
    // Update user
    suspend fun updateUser(userId: Int, user: User): Resource<User> {
        return withContext(ioDispatcher) {
            safeApiCall {
                val updatedUser = apiService.updateUser(userId, user)
                userDao.update(updatedUser)
                updatedUser
            }
        }
    }
    
    // Delete user
    suspend fun deleteUser(userId: Int): Resource<Unit> {
        return withContext(ioDispatcher) {
            safeApiCall {
                apiService.deleteUser(userId)
                userDao.deleteById(userId)
            }
        }
    }
}
```

## ViewModel with API Calls

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    
    private val _users = MutableStateFlow<Resource<List<User>>>(Resource.Loading())
    val users: StateFlow<Resource<List<User>>> = _users.asStateFlow()
    
    private val _selectedUser = MutableStateFlow<Resource<User>?>(null)
    val selectedUser: StateFlow<Resource<User>?> = _selectedUser.asStateFlow()
    
    init {
        loadUsers()
    }
    
    fun loadUsers() {
        viewModelScope.launch {
            repository.getUsers().collect { resource ->
                _users.value = resource
            }
        }
    }
    
    fun getUserById(userId: Int) {
        viewModelScope.launch {
            _selectedUser.value = Resource.Loading()
            _selectedUser.value = repository.getUserById(userId)
        }
    }
    
    fun createUser(user: User) {
        viewModelScope.launch {
            when (val result = repository.createUser(user)) {
                is Resource.Success -> {
                    loadUsers() // Refresh list
                }
                is Resource.Error -> {
                    // Handle error
                }
                is Resource.Loading -> {}
            }
        }
    }
    
    fun updateUser(userId: Int, user: User) {
        viewModelScope.launch {
            when (val result = repository.updateUser(userId, user)) {
                is Resource.Success -> {
                    loadUsers()
                }
                is Resource.Error -> {
                    // Handle error
                }
                is Resource.Loading -> {}
            }
        }
    }
    
    fun deleteUser(userId: Int) {
        viewModelScope.launch {
            when (val result = repository.deleteUser(userId)) {
                is Resource.Success -> {
                    loadUsers()
                }
                is Resource.Error -> {
                    // Handle error
                }
                is Resource.Loading -> {}
            }
        }
    }
}
```

## Fragment with API Integration

```kotlin
@AndroidEntryPoint
class UserListFragment : Fragment() {
    
    private var _binding: FragmentUserListBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: UserViewModel by viewModels()
    private lateinit var adapter: UserAdapter
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeUsers()
        setupSwipeRefresh()
    }
    
    private fun setupRecyclerView() {
        adapter = UserAdapter { user ->
            navigateToDetails(user.id)
        }
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@UserListFragment.adapter
        }
    }
    
    private fun observeUsers() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.users.collect { resource ->
                    when (resource) {
                        is Resource.Loading -> {
                            showLoading()
                        }
                        is Resource.Success -> {
                            hideLoading()
                            adapter.submitList(resource.data)
                        }
                        is Resource.Error -> {
                            hideLoading()
                            showError(resource.message)
                        }
                    }
                }
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadUsers()
        }
    }
    
    private fun showLoading() {
        binding.progressBar.visibility = View.VISIBLE
        binding.swipeRefresh.isRefreshing = false
    }
    
    private fun hideLoading() {
        binding.progressBar.visibility = View.GONE
        binding.swipeRefresh.isRefreshing = false
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("RETRY") {
                viewModel.loadUsers()
            }
            .show()
    }
}
```

## File Upload

```kotlin
// API Service
interface ApiService {
    @Multipart
    @POST("upload")
    suspend fun uploadImage(
        @Part image: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): ApiResponse<UploadResponse>
}

data class UploadResponse(
    val url: String,
    val filename: String
)

// Repository
class ImageRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun uploadImage(uri: Uri, description: String, context: Context): Resource<UploadResponse> {
        return withContext(Dispatchers.IO) {
            safeApiCall {
                val file = getFileFromUri(uri, context)
                val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
                val imagePart = MultipartBody.Part.createFormData("image", file.name, requestFile)
                val descriptionBody = description.toRequestBody("text/plain".toMediaTypeOrNull())
                
                val response = apiService.uploadImage(imagePart, descriptionBody)
                response.data ?: throw Exception("Upload failed")
            }
        }
    }
    
    private fun getFileFromUri(uri: Uri, context: Context): File {
        val inputStream = context.contentResolver.openInputStream(uri)
        val file = File(context.cacheDir, "upload_${System.currentTimeMillis()}.jpg")
        
        inputStream?.use { input ->
            file.outputStream().use { output ->
                input.copyTo(output)
            }
        }
        
        return file
    }
}

// ViewModel
@HiltViewModel
class UploadViewModel @Inject constructor(
    private val repository: ImageRepository
) : ViewModel() {
    
    private val _uploadState = MutableStateFlow<Resource<UploadResponse>?>(null)
    val uploadState: StateFlow<Resource<UploadResponse>?> = _uploadState.asStateFlow()
    
    fun uploadImage(uri: Uri, description: String, context: Context) {
        viewModelScope.launch {
            _uploadState.value = Resource.Loading()
            _uploadState.value = repository.uploadImage(uri, description, context)
        }
    }
}
```

## Pagination with Retrofit

```kotlin
// API Service
@GET("posts")
suspend fun getPosts(
    @Query("page") page: Int,
    @Query("limit") limit: Int = 20
): PostsResponse

data class PostsResponse(
    val posts: List<Post>,
    val currentPage: Int,
    val totalPages: Int,
    val hasNextPage: Boolean
)

// PagingSource
class PostsPagingSource(
    private val apiService: ApiService
) : PagingSource<Int, Post>() {
    
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, Post> {
        return try {
            val page = params.key ?: 1
            val response = apiService.getPosts(page, params.loadSize)
            
            LoadResult.Page(
                data = response.posts,
                prevKey = if (page == 1) null else page - 1,
                nextKey = if (response.hasNextPage) page + 1 else null
            )
        } catch (e: Exception) {
            LoadResult.Error(e)
        }
    }
    
    override fun getRefreshKey(state: PagingState<Int, Post>): Int? {
        return state.anchorPosition?.let { anchorPosition ->
            state.closestPageToPosition(anchorPosition)?.prevKey?.plus(1)
                ?: state.closestPageToPosition(anchorPosition)?.nextKey?.minus(1)
        }
    }
}

// Repository
class PostRepository @Inject constructor(
    private val apiService: ApiService
) {
    fun getPosts(): Flow<PagingData<Post>> {
        return Pager(
            config = PagingConfig(
                pageSize = 20,
                enablePlaceholders = false
            ),
            pagingSourceFactory = { PostsPagingSource(apiService) }
        ).flow
    }
}
```

## Retrofit with Hilt Module

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideLoggingInterceptor(): HttpLoggingInterceptor {
        return HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }
    }
    
    @Provides
    @Singleton
    fun provideAuthInterceptor(tokenManager: TokenManager): AuthInterceptor {
        return AuthInterceptor(tokenManager)
    }
    
    @Provides
    @Singleton
    fun provideOkHttpClient(
        loggingInterceptor: HttpLoggingInterceptor,
        authInterceptor: AuthInterceptor,
        @ApplicationContext context: Context
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(NetworkConnectionInterceptor(context))
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideGson(): Gson {
        return GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
            .setLenient()
            .create()
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
```

## Key Takeaways

✅ Retrofit simplifies API calls with type safety  
✅ Use suspend functions for coroutine support  
✅ Interceptors handle authentication and logging  
✅ Repository pattern abstracts network logic  
✅ Resource wrapper handles loading/success/error states  
✅ Cache-first strategy improves UX  
✅ Handle network errors gracefully  
✅ Use Hilt for dependency injection  

## Best Practices

1. **Always use suspend functions** with Retrofit
2. **Implement offline-first** with Room caching
3. **Handle all error cases** explicitly
4. **Use interceptors** for common logic
5. **Add timeout configurations** to OkHttpClient
6. **Log network calls** in debug builds only
7. **Use sealed classes** for API states
8. **Implement retry logic** for failed requests

## Practice Exercise

Create a weather app with:
1. Retrofit setup with interceptors
2. API service with weather endpoints
3. Repository with caching strategy
4. ViewModel managing API states
5. Fragment displaying weather data
6. Error handling with retry
7. Pull-to-refresh functionality
8. Offline support with Room

## Next Steps

Next, we'll dive deep into Coroutines for async programming!

---

**Resources:**
- [Retrofit Documentation](https://square.github.io/retrofit/)
- [OkHttp Documentation](https://square.github.io/okhttp/)
- [Gson Documentation](https://github.com/google/gson)