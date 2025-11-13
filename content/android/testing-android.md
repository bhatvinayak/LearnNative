---
title: Testing in Android
description: Master unit testing, instrumented testing, and UI testing for robust Android applications
platform: android
order: 19
---

# Testing in Android

Testing ensures your app works correctly and helps catch bugs early. Android supports multiple testing levels: unit tests, integration tests, and UI tests.

## Types of Tests

```
┌─────────────────────────────────────────┐
│         UI Tests (Espresso)             │  Slowest, Most Realistic
│   - Test complete user flows            │
│   - Run on device/emulator              │
├─────────────────────────────────────────┤
│     Integration Tests                    │  Medium Speed
│   - Test interactions between           │
│     components                           │
├─────────────────────────────────────────┤
│     Unit Tests (JUnit)                   │  Fastest
│   - Test individual functions/classes   │
│   - Run on development machine          │
└─────────────────────────────────────────┘
```

:::compare-react-native
React Native testing stack:
```javascript
// Unit tests with Jest
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

// Component tests with React Testing Library
import { render, fireEvent } from '@testing-library/react-native';

test('button click updates counter', () => {
    const { getByText } = render(<Counter />);
    const button = getByText('Increment');
    
    fireEvent.press(button);
    
    expect(getByText('Count: 1')).toBeTruthy();
});

// E2E tests with Detox
describe('Login Flow', () => {
    it('should login successfully', async () => {
        await element(by.id('email')).typeText('test@example.com');
        await element(by.id('password')).typeText('password');
        await element(by.id('loginButton')).tap();
        await expect(element(by.text('Welcome'))).toBeVisible();
    });
});
```
Android and React Native have similar testing philosophies with different tools.
:::

## Setup Testing Dependencies

```kotlin
// build.gradle (Module: app)
dependencies {
    // Unit Testing
    testImplementation 'junit:junit:4.13.2'
    testImplementation 'org.mockito:mockito-core:5.3.1'
    testImplementation 'org.mockito.kotlin:mockito-kotlin:5.0.0'
    testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3'
    testImplementation 'androidx.arch.core:core-testing:2.2.0'
    testImplementation 'com.google.truth:truth:1.1.4'
    
    // Instrumented Testing
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
    androidTestImplementation 'androidx.test:runner:1.5.2'
    androidTestImplementation 'androidx.test:rules:1.5.0'
    androidTestImplementation 'com.google.dagger:hilt-android-testing:2.48'
    kaptAndroidTest 'com.google.dagger:hilt-compiler:2.48'
}
```

## Unit Testing

### Basic Unit Test

```kotlin
// src/test/java/com/example/app/CalculatorTest.kt
class Calculator {
    fun add(a: Int, b: Int) = a + b
    fun subtract(a: Int, b: Int) = a - b
    fun multiply(a: Int, b: Int) = a * b
    fun divide(a: Int, b: Int): Int {
        require(b != 0) { "Cannot divide by zero" }
        return a / b
    }
}

class CalculatorTest {
    
    private lateinit var calculator: Calculator
    
    @Before
    fun setup() {
        calculator = Calculator()
    }
    
    @Test
    fun `add returns correct sum`() {
        val result = calculator.add(2, 3)
        assertEquals(5, result)
    }
    
    @Test
    fun `subtract returns correct difference`() {
        val result = calculator.subtract(5, 3)
        assertEquals(2, result)
    }
    
    @Test
    fun `divide by zero throws exception`() {
        assertThrows(IllegalArgumentException::class.java) {
            calculator.divide(10, 0)
        }
    }
    
    @Test
    fun `multiply negative numbers`() {
        val result = calculator.multiply(-2, 3)
        assertEquals(-6, result)
    }
}
```

### Testing with Truth (Fluent Assertions)

```kotlin
import com.google.common.truth.Truth.assertThat

class UserValidatorTest {
    
    private lateinit var validator: UserValidator
    
    @Before
    fun setup() {
        validator = UserValidator()
    }
    
    @Test
    fun `valid email returns true`() {
        val result = validator.isValidEmail("test@example.com")
        assertThat(result).isTrue()
    }
    
    @Test
    fun `invalid email returns false`() {
        val result = validator.isValidEmail("invalid-email")
        assertThat(result).isFalse()
    }
    
    @Test
    fun `password validation checks length`() {
        val shortPassword = "abc"
        val validPassword = "password123"
        
        assertThat(validator.isValidPassword(shortPassword)).isFalse()
        assertThat(validator.isValidPassword(validPassword)).isTrue()
    }
    
    @Test
    fun `user age must be positive`() {
        assertThat(validator.isValidAge(-1)).isFalse()
        assertThat(validator.isValidAge(0)).isFalse()
        assertThat(validator.isValidAge(25)).isTrue()
    }
}
```

### Testing with Mockito

```kotlin
class UserRepository(
    private val apiService: ApiService,
    private val userDao: UserDao
) {
    suspend fun getUser(id: Int): User {
        return userDao.getUserById(id) ?: run {
            val user = apiService.getUser(id)
            userDao.insert(user)
            user
        }
    }
}

class UserRepositoryTest {
    
    @Mock
    private lateinit var apiService: ApiService
    
    @Mock
    private lateinit var userDao: UserDao
    
    private lateinit var repository: UserRepository
    
    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        repository = UserRepository(apiService, userDao)
    }
    
    @Test
    fun `getUser returns cached user if available`() = runTest {
        // Given
        val userId = 1
        val cachedUser = User(1, "John", "john@example.com")
        whenever(userDao.getUserById(userId)).thenReturn(cachedUser)
        
        // When
        val result = repository.getUser(userId)
        
        // Then
        assertThat(result).isEqualTo(cachedUser)
        verify(userDao).getUserById(userId)
        verifyNoInteractions(apiService) // API not called
    }
    
    @Test
    fun `getUser fetches from API if not cached`() = runTest {
        // Given
        val userId = 1
        val apiUser = User(1, "Jane", "jane@example.com")
        whenever(userDao.getUserById(userId)).thenReturn(null)
        whenever(apiService.getUser(userId)).thenReturn(apiUser)
        
        // When
        val result = repository.getUser(userId)
        
        // Then
        assertThat(result).isEqualTo(apiUser)
        verify(userDao).getUserById(userId)
        verify(apiService).getUser(userId)
        verify(userDao).insert(apiUser)
    }
    
    @Test
    fun `getUser throws exception on API failure`() = runTest {
        // Given
        val userId = 1
        whenever(userDao.getUserById(userId)).thenReturn(null)
        whenever(apiService.getUser(userId)).thenThrow(IOException("Network error"))
        
        // When/Then
        assertThrows(IOException::class.java) {
            runBlocking { repository.getUser(userId) }
        }
    }
}
```

### Testing ViewModel

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    
    private val _users = MutableStateFlow<Resource<List<User>>>(Resource.Loading())
    val users: StateFlow<Resource<List<User>>> = _users.asStateFlow()
    
    fun loadUsers() {
        viewModelScope.launch {
            _users.value = Resource.Loading()
            
            try {
                val users = repository.getUsers()
                _users.value = Resource.Success(users)
            } catch (e: Exception) {
                _users.value = Resource.Error(e.message ?: "Unknown error")
            }
        }
    }
}

@ExperimentalCoroutinesApi
class UserViewModelTest {
    
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    @get:Rule
    val instantTaskExecutorRule = InstantTaskExecutorRule()
    
    @Mock
    private lateinit var repository: UserRepository
    
    private lateinit var viewModel: UserViewModel
    
    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        viewModel = UserViewModel(repository)
    }
    
    @Test
    fun `loadUsers updates state to Success on successful fetch`() = runTest {
        // Given
        val users = listOf(
            User(1, "John", "john@example.com"),
            User(2, "Jane", "jane@example.com")
        )
        whenever(repository.getUsers()).thenReturn(users)
        
        // When
        viewModel.loadUsers()
        
        // Then
        val state = viewModel.users.value
        assertThat(state).isInstanceOf(Resource.Success::class.java)
        assertThat((state as Resource.Success).data).isEqualTo(users)
    }
    
    @Test
    fun `loadUsers updates state to Error on failure`() = runTest {
        // Given
        val errorMessage = "Network error"
        whenever(repository.getUsers()).thenThrow(IOException(errorMessage))
        
        // When
        viewModel.loadUsers()
        
        // Then
        val state = viewModel.users.value
        assertThat(state).isInstanceOf(Resource.Error::class.java)
        assertThat((state as Resource.Error).message).isEqualTo(errorMessage)
    }
    
    @Test
    fun `loadUsers sets Loading state initially`() = runTest {
        // Given
        whenever(repository.getUsers()).thenReturn(emptyList())
        
        // When
        val job = launch {
            viewModel.users.collect { state ->
                if (state is Resource.Loading) {
                    // Then
                    assertThat(state).isInstanceOf(Resource.Loading::class.java)
                    cancel() // Cancel collection after checking
                }
            }
        }
        
        viewModel.loadUsers()
        job.join()
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

### Testing Coroutines

```kotlin
class DataSyncManager(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    suspend fun syncData() {
        val remoteData = apiService.getData()
        database.dataDao().insertAll(remoteData)
    }
    
    suspend fun syncWithRetry(maxRetries: Int = 3): Boolean {
        repeat(maxRetries) { attempt ->
            try {
                syncData()
                return true
            } catch (e: Exception) {
                if (attempt == maxRetries - 1) throw e
                delay(1000 * (attempt + 1))
            }
        }
        return false
    }
}

@ExperimentalCoroutinesApi
class DataSyncManagerTest {
    
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    @Mock
    private lateinit var apiService: ApiService
    
    @Mock
    private lateinit var database: AppDatabase
    
    @Mock
    private lateinit var dataDao: DataDao
    
    private lateinit var syncManager: DataSyncManager
    
    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        whenever(database.dataDao()).thenReturn(dataDao)
        syncManager = DataSyncManager(apiService, database)
    }
    
    @Test
    fun `syncData fetches and saves data`() = runTest {
        // Given
        val remoteData = listOf(Data(1, "Item 1"), Data(2, "Item 2"))
        whenever(apiService.getData()).thenReturn(remoteData)
        
        // When
        syncManager.syncData()
        
        // Then
        verify(apiService).getData()
        verify(dataDao).insertAll(remoteData)
    }
    
    @Test
    fun `syncWithRetry succeeds on first attempt`() = runTest {
        // Given
        whenever(apiService.getData()).thenReturn(emptyList())
        
        // When
        val result = syncManager.syncWithRetry()
        
        // Then
        assertThat(result).isTrue()
        verify(apiService, times(1)).getData()
    }
    
    @Test
    fun `syncWithRetry retries on failure`() = runTest {
        // Given
        whenever(apiService.getData())
            .thenThrow(IOException("Error"))
            .thenThrow(IOException("Error"))
            .thenReturn(emptyList())
        
        // When
        val result = syncManager.syncWithRetry()
        
        // Then
        assertThat(result).isTrue()
        verify(apiService, times(3)).getData()
    }
    
    @Test
    fun `syncWithRetry throws after max retries`() = runTest {
        // Given
        whenever(apiService.getData()).thenThrow(IOException("Error"))
        
        // When/Then
        assertThrows(IOException::class.java) {
            runBlocking { syncManager.syncWithRetry() }
        }
        verify(apiService, times(3)).getData()
    }
}
```

## Instrumented Tests (Android Tests)

### Testing Room Database

```kotlin
// src/androidTest/java/com/example/app/UserDaoTest.kt
@RunWith(AndroidJUnit4::class)
class UserDaoTest {
    
    private lateinit var database: AppDatabase
    private lateinit var userDao: UserDao
    
    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        userDao = database.userDao()
    }
    
    @After
    fun tearDown() {
        database.close()
    }
    
    @Test
    fun insertAndGetUser() = runBlocking {
        // Given
        val user = User(1, "John", "john@example.com")
        
        // When
        userDao.insert(user)
        val retrieved = userDao.getUserById(1)
        
        // Then
        assertThat(retrieved).isEqualTo(user)
    }
    
    @Test
    fun getAllUsersReturnsCorrectList() = runBlocking {
        // Given
        val users = listOf(
            User(1, "John", "john@example.com"),
            User(2, "Jane", "jane@example.com")
        )
        userDao.insertAll(users)
        
        // When
        val allUsers = userDao.getAllUsers()
        
        // Then
        assertThat(allUsers).hasSize(2)
        assertThat(allUsers).containsExactlyElementsIn(users)
    }
    
    @Test
    fun deleteUserRemovesFromDatabase() = runBlocking {
        // Given
        val user = User(1, "John", "john@example.com")
        userDao.insert(user)
        
        // When
        userDao.delete(user)
        val retrieved = userDao.getUserById(1)
        
        // Then
        assertThat(retrieved).isNull()
    }
}
```

## UI Testing with Espresso

### Basic Espresso Test

```kotlin
@RunWith(AndroidJUnit4::class)
class MainActivityTest {
    
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)
    
    @Test
    fun buttonClickUpdatesText() {
        // Perform click
        onView(withId(R.id.button))
            .perform(click())
        
        // Verify text changed
        onView(withId(R.id.textView))
            .check(matches(withText("Button clicked!")))
    }
    
    @Test
    fun editTextInputAndSubmit() {
        // Type text
        onView(withId(R.id.nameInput))
            .perform(typeText("John Doe"), closeSoftKeyboard())
        
        // Click submit
        onView(withId(R.id.submitButton))
            .perform(click())
        
        // Verify result
        onView(withId(R.id.resultText))
            .check(matches(withText("Hello, John Doe!")))
    }
    
    @Test
    fun recyclerViewItemClick() {
        // Click first item in RecyclerView
        onView(withId(R.id.recyclerView))
            .perform(RecyclerViewActions.actionOnItemAtPosition<RecyclerView.ViewHolder>(0, click()))
        
        // Verify navigation
        onView(withId(R.id.detailTitle))
            .check(matches(isDisplayed()))
    }
}
```

### Testing RecyclerView

```kotlin
@RunWith(AndroidJUnit4::class)
class UserListFragmentTest {
    
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @Inject
    lateinit var repository: FakeUserRepository
    
    @Before
    fun setup() {
        hiltRule.inject()
        
        // Set up test data
        repository.setUsers(listOf(
            User(1, "John", "john@example.com"),
            User(2, "Jane", "jane@example.com")
        ))
    }
    
    @Test
    fun userListDisplaysCorrectly() {
        launchFragmentInHiltContainer<UserListFragment>()
        
        // Verify first user
        onView(withId(R.id.recyclerView))
            .perform(RecyclerViewActions.scrollToPosition<RecyclerView.ViewHolder>(0))
        
        onView(withText("John"))
            .check(matches(isDisplayed()))
        
        // Verify second user
        onView(withId(R.id.recyclerView))
            .perform(RecyclerViewActions.scrollToPosition<RecyclerView.ViewHolder>(1))
        
        onView(withText("Jane"))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun clickingUserNavigatesToDetails() {
        launchFragmentInHiltContainer<UserListFragment>()
        
        // Click on first user
        onView(withId(R.id.recyclerView))
            .perform(RecyclerViewActions.actionOnItemAtPosition<RecyclerView.ViewHolder>(0, click()))
        
        // Verify navigation to details
        onView(withId(R.id.userDetailLayout))
            .check(matches(isDisplayed()))
    }
}
```

### Custom Matchers

```kotlin
// Custom matcher for RecyclerView item count
fun withItemCount(expectedCount: Int): Matcher<View> {
    return object : BoundedMatcher<View, RecyclerView>(RecyclerView::class.java) {
        override fun describeTo(description: Description) {
            description.appendText("RecyclerView with $expectedCount items")
        }
        
        override fun matchesSafely(recyclerView: RecyclerView): Boolean {
            return recyclerView.adapter?.itemCount == expectedCount
        }
    }
}

// Usage
onView(withId(R.id.recyclerView))
    .check(matches(withItemCount(10)))
```

## Test Doubles (Fakes)

```kotlin
class FakeUserRepository : UserRepository {
    
    private val users = mutableListOf<User>()
    private var shouldThrowError = false
    
    fun setUsers(userList: List<User>) {
        users.clear()
        users.addAll(userList)
    }
    
    fun setShouldThrowError(shouldThrow: Boolean) {
        shouldThrowError = shouldThrow
    }
    
    override suspend fun getUsers(): List<User> {
        if (shouldThrowError) {
            throw IOException("Test error")
        }
        return users.toList()
    }
    
    override suspend fun getUserById(id: Int): User? {
        return users.find { it.id == id }
    }
    
    override suspend fun insertUser(user: User) {
        users.add(user)
    }
    
    override suspend fun deleteUser(user: User) {
        users.remove(user)
    }
}

// Test module for Hilt
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [RepositoryModule::class]
)
abstract class TestRepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindUserRepository(
        fake: FakeUserRepository
    ): UserRepository
}
```

## Key Takeaways

✅ Unit tests are fast and test individual components  
✅ Use Mockito for mocking dependencies  
✅ Test ViewModels with MainDispatcherRule  
✅ Instrumented tests run on device/emulator  
✅ Espresso tests UI interactions  
✅ Use fakes for integration testing  
✅ Test coroutines with runTest  
✅ Aim for high test coverage  

## Testing Best Practices

1. **Follow AAA pattern** (Arrange, Act, Assert)
2. **Test one thing per test**
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases and error scenarios**
6. **Keep tests independent**
7. **Use test doubles appropriately**
8. **Run tests regularly** (CI/CD)

## Practice Exercise

Create tests for a todo app:
1. Unit tests for ViewModel
2. Unit tests for Repository
3. Database tests with Room
4. UI tests with Espresso
5. Test coroutines properly
6. Mock API service
7. Test error handling

## Next Steps

Finally, we'll learn how to publish your app to the Google Play Store!

---

**Resources:**
- [Android Testing Guide](https://developer.android.com/training/testing)
- [Testing Coroutines](https://developer.android.com/kotlin/coroutines/test)
- [Espresso Documentation](https://developer.android.com/training/testing/espresso)