---
title: Data Storage - SharedPreferences & Room
description: Store and manage local data with SharedPreferences for simple key-value pairs and Room for structured data
platform: android
order: 13
---

# Data Storage - SharedPreferences & Room

Android provides several options for persisting data locally. We'll cover two essential approaches: SharedPreferences for simple key-value data and Room for structured database storage.

## SharedPreferences

SharedPreferences is perfect for storing small amounts of primitive data (settings, preferences, flags).

### Basic Usage

```kotlin
class SettingsManager(context: Context) {
    private val prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    
    // Save data
    fun saveUserName(name: String) {
        prefs.edit().putString("user_name", name).apply()
    }
    
    fun saveAge(age: Int) {
        prefs.edit().putInt("age", age).apply()
    }
    
    fun saveIsLoggedIn(isLoggedIn: Boolean) {
        prefs.edit().putBoolean("is_logged_in", isLoggedIn).apply()
    }
    
    // Retrieve data
    fun getUserName(): String? {
        return prefs.getString("user_name", null)
    }
    
    fun getAge(): Int {
        return prefs.getInt("age", 0)
    }
    
    fun isLoggedIn(): Boolean {
        return prefs.getBoolean("is_logged_in", false)
    }
    
    // Remove data
    fun clearUserData() {
        prefs.edit().remove("user_name").remove("age").apply()
    }
    
    // Clear all
    fun clearAll() {
        prefs.edit().clear().apply()
    }
}

// Usage in Activity
class MainActivity : AppCompatActivity() {
    private lateinit var settingsManager: SettingsManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        settingsManager = SettingsManager(this)
        
        // Save
        settingsManager.saveUserName("Alice")
        settingsManager.saveAge(25)
        settingsManager.saveIsLoggedIn(true)
        
        // Retrieve
        val userName = settingsManager.getUserName()
        val age = settingsManager.getAge()
        val isLoggedIn = settingsManager.isLoggedIn()
    }
}
```

:::compare-react-native
React Native uses AsyncStorage:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
const saveUserName = async (name) => {
    try {
        await AsyncStorage.setItem('user_name', name);
    } catch (error) {
        console.error('Error saving:', error);
    }
};

// Retrieve data
const getUserName = async () => {
    try {
        const name = await AsyncStorage.getItem('user_name');
        return name;
    } catch (error) {
        console.error('Error retrieving:', error);
    }
};

// Remove data
const clearUserData = async () => {
    try {
        await AsyncStorage.multiRemove(['user_name', 'age']);
    } catch (error) {
        console.error('Error removing:', error);
    }
};

// Clear all
const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing:', error);
    }
};
```
SharedPreferences is synchronous while AsyncStorage is asynchronous. Both serve the same purpose of simple key-value storage.
:::

### Type-Safe Preferences with Delegates

```kotlin
class AppPreferences(context: Context) {
    private val prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    
    var userName: String?
        get() = prefs.getString("user_name", null)
        set(value) = prefs.edit().putString("user_name", value).apply()
    
    var age: Int
        get() = prefs.getInt("age", 0)
        set(value) = prefs.edit().putInt("age", value).apply()
    
    var isLoggedIn: Boolean
        get() = prefs.getBoolean("is_logged_in", false)
        set(value) = prefs.edit().putBoolean("is_logged_in", value).apply()
    
    var isDarkMode: Boolean
        get() = prefs.getBoolean("dark_mode", false)
        set(value) = prefs.edit().putBoolean("dark_mode", value).apply()
    
    var notificationsEnabled: Boolean
        get() = prefs.getBoolean("notifications", true)
        set(value) = prefs.edit().putBoolean("notifications", value).apply()
}

// Usage
class MainActivity : AppCompatActivity() {
    private lateinit var preferences: AppPreferences
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        preferences = AppPreferences(this)
        
        // Clean, property-like access
        preferences.userName = "Alice"
        preferences.isDarkMode = true
        
        val userName = preferences.userName
        val isDarkMode = preferences.isDarkMode
    }
}
```

### Observing Preference Changes

```kotlin
class AppPreferences(context: Context) {
    private val prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    
    private val listeners = mutableListOf<SharedPreferences.OnSharedPreferenceChangeListener>()
    
    fun observeChanges(listener: (String, Any?) -> Unit) {
        val changeListener = SharedPreferences.OnSharedPreferenceChangeListener { _, key ->
            val value = prefs.all[key]
            listener(key, value)
        }
        
        prefs.registerOnSharedPreferenceChangeListener(changeListener)
        listeners.add(changeListener)
    }
    
    fun clearObservers() {
        listeners.forEach { prefs.unregisterOnSharedPreferenceChangeListener(it) }
        listeners.clear()
    }
    
    var isDarkMode: Boolean
        get() = prefs.getBoolean("dark_mode", false)
        set(value) = prefs.edit().putBoolean("dark_mode", value).apply()
}

// Usage
class SettingsActivity : AppCompatActivity() {
    private lateinit var preferences: AppPreferences
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        preferences = AppPreferences(this)
        
        preferences.observeChanges { key, value ->
            when (key) {
                "dark_mode" -> {
                    val isDark = value as? Boolean ?: false
                    updateTheme(isDark)
                }
            }
        }
        
        binding.darkModeSwitch.setOnCheckedChangeListener { _, isChecked ->
            preferences.isDarkMode = isChecked
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        preferences.clearObservers()
    }
    
    private fun updateTheme(isDark: Boolean) {
        if (isDark) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        }
    }
}
```

## Room Database

Room is a powerful SQLite abstraction layer for structured data storage.

### Setup

```kotlin
// build.gradle (Module: app)
dependencies {
    implementation 'androidx.room:room-runtime:2.6.0'
    implementation 'androidx.room:room-ktx:2.6.0'
    kapt 'androidx.room:room-compiler:2.6.0'
}

// Enable kapt
plugins {
    id 'kotlin-kapt'
}
```

### 1. Create Entity (Table)

```kotlin
@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    
    @ColumnInfo(name = "user_name")
    val name: String,
    
    @ColumnInfo(name = "email")
    val email: String,
    
    @ColumnInfo(name = "age")
    val age: Int,
    
    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
)

// Entity with relationships
@Entity(tableName = "posts")
data class Post(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    
    @ColumnInfo(name = "user_id")
    val userId: Int,
    
    val title: String,
    val content: String,
    val createdAt: Long = System.currentTimeMillis()
)

// Relationship class
data class UserWithPosts(
    @Embedded val user: User,
    @Relation(
        parentColumn = "id",
        entityColumn = "user_id"
    )
    val posts: List<Post>
)
```

### 2. Create DAO (Data Access Object)

```kotlin
@Dao
interface UserDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: User): Long
    
    @Insert
    suspend fun insertAll(users: List<User>)
    
    @Update
    suspend fun update(user: User)
    
    @Delete
    suspend fun delete(user: User)
    
    @Query("SELECT * FROM users")
    suspend fun getAllUsers(): List<User>
    
    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUserById(userId: Int): User?
    
    @Query("SELECT * FROM users WHERE email = :email")
    suspend fun getUserByEmail(email: String): User?
    
    @Query("SELECT * FROM users WHERE age >= :minAge")
    suspend fun getUsersOlderThan(minAge: Int): List<User>
    
    @Query("SELECT * FROM users ORDER BY created_at DESC")
    fun getAllUsersFlow(): Flow<List<User>>
    
    @Query("DELETE FROM users WHERE id = :userId")
    suspend fun deleteById(userId: Int)
    
    @Query("DELETE FROM users")
    suspend fun deleteAll()
    
    @Transaction
    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUserWithPosts(userId: Int): UserWithPosts?
}
```

### 3. Create Database

```kotlin
@Database(
    entities = [User::class, Post::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun postDao(): PostDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

### 4. Create Repository

```kotlin
class UserRepository(private val userDao: UserDao) {
    
    val allUsers: Flow<List<User>> = userDao.getAllUsersFlow()
    
    suspend fun insert(user: User): Long {
        return userDao.insert(user)
    }
    
    suspend fun update(user: User) {
        userDao.update(user)
    }
    
    suspend fun delete(user: User) {
        userDao.delete(user)
    }
    
    suspend fun getUserById(id: Int): User? {
        return userDao.getUserById(id)
    }
    
    suspend fun getUserByEmail(email: String): User? {
        return userDao.getUserByEmail(email)
    }
    
    suspend fun getAllUsers(): List<User> {
        return userDao.getAllUsers()
    }
    
    suspend fun deleteAll() {
        userDao.deleteAll()
    }
}
```

### 5. Usage in ViewModel

```kotlin
class UserViewModel(application: Application) : AndroidViewModel(application) {
    
    private val repository: UserRepository
    val allUsers: LiveData<List<User>>
    
    init {
        val userDao = AppDatabase.getDatabase(application).userDao()
        repository = UserRepository(userDao)
        allUsers = repository.allUsers.asLiveData()
    }
    
    fun insert(user: User) = viewModelScope.launch {
        repository.insert(user)
    }
    
    fun update(user: User) = viewModelScope.launch {
        repository.update(user)
    }
    
    fun delete(user: User) = viewModelScope.launch {
        repository.delete(user)
    }
    
    fun getUserById(id: Int) = viewModelScope.launch {
        val user = repository.getUserById(id)
        // Handle result
    }
}
```

### 6. Usage in Activity/Fragment

```kotlin
class UserListFragment : Fragment() {
    
    private var _binding: FragmentUserListBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: UserViewModel by viewModels()
    private lateinit var adapter: UserAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentUserListBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeUsers()
        setupFab()
    }
    
    private fun setupRecyclerView() {
        adapter = UserAdapter(
            onEditClick = { user -> editUser(user) },
            onDeleteClick = { user -> deleteUser(user) }
        )
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@UserListFragment.adapter
        }
    }
    
    private fun observeUsers() {
        viewModel.allUsers.observe(viewLifecycleOwner) { users ->
            adapter.submitList(users)
            
            if (users.isEmpty()) {
                binding.emptyState.visibility = View.VISIBLE
                binding.recyclerView.visibility = View.GONE
            } else {
                binding.emptyState.visibility = View.GONE
                binding.recyclerView.visibility = View.VISIBLE
            }
        }
    }
    
    private fun setupFab() {
        binding.fab.setOnClickListener {
            showAddUserDialog()
        }
    }
    
    private fun showAddUserDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_user, null)
        val nameInput = dialogView.findViewById<TextInputEditText>(R.id.nameInput)
        val emailInput = dialogView.findViewById<TextInputEditText>(R.id.emailInput)
        val ageInput = dialogView.findViewById<TextInputEditText>(R.id.ageInput)
        
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Add User")
            .setView(dialogView)
            .setPositiveButton("Add") { _, _ ->
                val name = nameInput.text.toString()
                val email = emailInput.text.toString()
                val age = ageInput.text.toString().toIntOrNull() ?: 0
                
                if (name.isNotEmpty() && email.isNotEmpty()) {
                    val user = User(name = name, email = email, age = age)
                    viewModel.insert(user)
                    
                    Snackbar.make(binding.root, "User added", Snackbar.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun editUser(user: User) {
        // Show edit dialog
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_user, null)
        val nameInput = dialogView.findViewById<TextInputEditText>(R.id.nameInput)
        val emailInput = dialogView.findViewById<TextInputEditText>(R.id.emailInput)
        val ageInput = dialogView.findViewById<TextInputEditText>(R.id.ageInput)
        
        // Pre-fill with existing data
        nameInput.setText(user.name)
        emailInput.setText(user.email)
        ageInput.setText(user.age.toString())
        
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Edit User")
            .setView(dialogView)
            .setPositiveButton("Update") { _, _ ->
                val updatedUser = user.copy(
                    name = nameInput.text.toString(),
                    email = emailInput.text.toString(),
                    age = ageInput.text.toString().toIntOrNull() ?: user.age
                )
                
                viewModel.update(updatedUser)
                Snackbar.make(binding.root, "User updated", Snackbar.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun deleteUser(user: User) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Delete User")
            .setMessage("Are you sure you want to delete ${user.name}?")
            .setPositiveButton("Delete") { _, _ ->
                viewModel.delete(user)
                Snackbar.make(binding.root, "User deleted", Snackbar.LENGTH_SHORT)
                    .setAction("UNDO") {
                        viewModel.insert(user)
                    }
                    .show()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Database Migrations

```kotlin
// When you change the database schema
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        // Add new column
        database.execSQL("ALTER TABLE users ADD COLUMN phone TEXT")
    }
}

val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(database: SupportSQLiteDatabase) {
        // Create new table
        database.execSQL("""
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
        """.trimIndent())
    }
}

// Add migrations to database builder
@Database(entities = [User::class, Post::class], version = 3)
abstract class AppDatabase : RoomDatabase() {
    // ...
    
    companion object {
        fun getDatabase(context: Context): AppDatabase {
            return Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "app_database"
            )
                .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
                .build()
        }
    }
}
```

## Practical Example: Note-Taking App

```kotlin
// Note Entity
@Entity(tableName = "notes")
data class Note(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val title: String,
    val content: String,
    val category: String,
    val color: Int,
    val isPinned: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

// Note DAO
@Dao
interface NoteDao {
    @Insert
    suspend fun insert(note: Note): Long
    
    @Update
    suspend fun update(note: Note)
    
    @Delete
    suspend fun delete(note: Note)
    
    @Query("SELECT * FROM notes ORDER BY isPinned DESC, updatedAt DESC")
    fun getAllNotes(): Flow<List<Note>>
    
    @Query("SELECT * FROM notes WHERE category = :category ORDER BY updatedAt DESC")
    fun getNotesByCategory(category: String): Flow<List<Note>>
    
    @Query("SELECT * FROM notes WHERE title LIKE '%' || :query || '%' OR content LIKE '%' || :query || '%'")
    suspend fun searchNotes(query: String): List<Note>
    
    @Query("UPDATE notes SET isPinned = :isPinned WHERE id = :noteId")
    suspend fun updatePinStatus(noteId: Int, isPinned: Boolean)
}

// Database
@Database(entities = [Note::class], version = 1)
abstract class NotesDatabase : RoomDatabase() {
    abstract fun noteDao(): NoteDao
    
    companion object {
        @Volatile
        private var INSTANCE: NotesDatabase? = null
        
        fun getDatabase(context: Context): NotesDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NotesDatabase::class.java,
                    "notes_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

// Repository
class NoteRepository(private val noteDao: NoteDao) {
    val allNotes: Flow<List<Note>> = noteDao.getAllNotes()
    
    suspend fun insert(note: Note): Long = noteDao.insert(note)
    suspend fun update(note: Note) = noteDao.update(note)
    suspend fun delete(note: Note) = noteDao.delete(note)
    suspend fun searchNotes(query: String) = noteDao.searchNotes(query)
    suspend fun togglePin(noteId: Int, isPinned: Boolean) = 
        noteDao.updatePinStatus(noteId, isPinned)
    
    fun getNotesByCategory(category: String): Flow<List<Note>> = 
        noteDao.getNotesByCategory(category)
}

// ViewModel
class NoteViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: NoteRepository
    val allNotes: LiveData<List<Note>>
    
    private val _searchResults = MutableLiveData<List<Note>>()
    val searchResults: LiveData<List<Note>> = _searchResults
    
    init {
        val noteDao = NotesDatabase.getDatabase(application).noteDao()
        repository = NoteRepository(noteDao)
        allNotes = repository.allNotes.asLiveData()
    }
    
    fun insert(note: Note) = viewModelScope.launch {
        repository.insert(note)
    }
    
    fun update(note: Note) = viewModelScope.launch {
        repository.update(note)
    }
    
    fun delete(note: Note) = viewModelScope.launch {
        repository.delete(note)
    }
    
    fun searchNotes(query: String) = viewModelScope.launch {
        val results = repository.searchNotes(query)
        _searchResults.postValue(results)
    }
    
    fun togglePin(note: Note) = viewModelScope.launch {
        repository.togglePin(note.id, !note.isPinned)
    }
}
```

## Key Takeaways

✅ SharedPreferences for simple key-value storage (settings, flags)  
✅ Room for structured, relational data storage  
✅ Use Flow or LiveData to observe database changes  
✅ Repository pattern separates data logic from UI  
✅ Coroutines with suspend functions for async database operations  
✅ Migrations handle database schema changes  
✅ DAOs provide clean database access APIs  

## Practice Exercise

Create a task management app with:
1. SharedPreferences for user settings (theme, notifications)
2. Room database for tasks with categories
3. CRUD operations (Create, Read, Update, Delete)
4. Search functionality
5. Filter by category
6. Mark tasks as completed

## Next Steps

Next, we'll explore MVVM architecture and how to structure larger applications!

---

**Resources:**
- [SharedPreferences Guide](https://developer.android.com/training/data-storage/shared-preferences)
- [Room Documentation](https://developer.android.com/training/data-storage/room)
- [Room with Flow](https://developer.android.com/kotlin/flow#room)