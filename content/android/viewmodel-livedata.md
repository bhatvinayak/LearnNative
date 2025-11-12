---
title: ViewModel & LiveData
description: Master ViewModel lifecycle, LiveData patterns, and reactive UI development
platform: android
order: 15
---

# ViewModel & LiveData

ViewModel and LiveData are essential Android Architecture Components that enable lifecycle-aware, reactive UI development.

## ViewModel Deep Dive

### ViewModel Lifecycle

```
Activity/Fragment Lifecycle:
─────────────────────────────────────
onCreate()
  │
  └── ViewModel Created ◄─────────────┐
onStart()                             │
onResume()                            │
  │                                   │
  │  User interacts                   │ViewModel survives
  │                                   │ configuration changes
onPause()                             │
onStop()                              │
onDestroy() ◄── Config Change         │
onCreate()  ─── New Instance ─────────┘
  │
  └── Same ViewModel instance!
  
onDestroy() ◄── Final destroy
  │
  └── ViewModel.onCleared() ◄── ViewModel destroyed
```

### Basic ViewModel

```kotlin
class CounterViewModel : ViewModel() {
    
    private val _count = MutableLiveData<Int>(0)
    val count: LiveData<Int> = _count
    
    fun increment() {
        _count.value = (_count.value ?: 0) + 1
    }
    
    fun decrement() {
        _count.value = (_count.value ?: 0) - 1
    }
    
    fun reset() {
        _count.value = 0
    }
    
    override fun onCleared() {
        super.onCleared()
        // Cleanup: cancel jobs, close resources
        Log.d("CounterViewModel", "ViewModel destroyed")
    }
}

// Usage in Fragment
class CounterFragment : Fragment() {
    
    private val viewModel: CounterViewModel by viewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Observe count
        viewModel.count.observe(viewLifecycleOwner) { count ->
            binding.countText.text = count.toString()
        }
        
        // Button clicks
        binding.incrementButton.setOnClickListener {
            viewModel.increment()
        }
        
        binding.decrementButton.setOnClickListener {
            viewModel.decrement()
        }
    }
}
```

:::compare-react-native
React hooks for state management:
```javascript
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

function CounterScreen() {
    const [count, setCount] = useState(0);
    
    // State survives component re-renders but NOT
    // navigation or app background/foreground
    
    return (
        <View>
            <Text>{count}</Text>
            <Button title="+" onPress={() => setCount(count + 1)} />
            <Button title="-" onPress={() => setCount(count - 1)} />
        </View>
    );
}

// For persistence across navigation, use Context or Redux
import { createContext, useContext } from 'react';

const CounterContext = createContext();

function App() {
    const [count, setCount] = useState(0);
    
    return (
        <CounterContext.Provider value={{ count, setCount }}>
            <Navigation />
        </CounterContext.Provider>
    );
}
```
ViewModel automatically survives configuration changes, while React requires additional state management for persistence.
:::

### ViewModel with Constructor Parameters

```kotlin
class UserViewModel(
    private val userId: Int,
    private val repository: UserRepository
) : ViewModel() {
    
    private val _user = MutableLiveData<User>()
    val user: LiveData<User> = _user
    
    init {
        loadUser()
    }
    
    private fun loadUser() {
        viewModelScope.launch {
            _user.value = repository.getUserById(userId)
        }
    }
}

// Factory
class UserViewModelFactory(
    private val userId: Int,
    private val repository: UserRepository
) : ViewModelProvider.Factory {
    
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(UserViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return UserViewModel(userId, repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

// Usage
class UserFragment : Fragment() {
    
    private val viewModel: UserViewModel by viewModels {
        UserViewModelFactory(
            userId = args.userId,
            repository = UserRepository(database.userDao())
        )
    }
}
```

### Shared ViewModel Between Fragments

```kotlin
// Shared ViewModel
class SharedViewModel : ViewModel() {
    
    private val _selectedItem = MutableLiveData<Item>()
    val selectedItem: LiveData<Item> = _selectedItem
    
    fun selectItem(item: Item) {
        _selectedItem.value = item
    }
}

// Fragment A - Select item
class ListFragment : Fragment() {
    
    // activityViewModels() scopes ViewModel to Activity
    private val sharedViewModel: SharedViewModel by activityViewModels()
    
    private fun onItemClick(item: Item) {
        sharedViewModel.selectItem(item)
        findNavController().navigate(R.id.action_list_to_details)
    }
}

// Fragment B - Observe selection
class DetailsFragment : Fragment() {
    
    // Same ViewModel instance
    private val sharedViewModel: SharedViewModel by activityViewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        sharedViewModel.selectedItem.observe(viewLifecycleOwner) { item ->
            displayItem(item)
        }
    }
}
```

## LiveData Patterns

### Basic LiveData

```kotlin
class WeatherViewModel : ViewModel() {
    
    // Mutable internally, exposed as immutable
    private val _temperature = MutableLiveData<Double>()
    val temperature: LiveData<Double> = _temperature
    
    private val _condition = MutableLiveData<String>()
    val condition: LiveData<String> = _condition
    
    fun updateWeather(temp: Double, cond: String) {
        _temperature.value = temp
        _condition.value = cond
    }
    
    // Post value from background thread
    fun updateWeatherAsync(temp: Double, cond: String) {
        _temperature.postValue(temp)
        _condition.postValue(cond)
    }
}
```

### LiveData Transformations

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    
    private val _userId = MutableLiveData<Int>()
    
    // Transform: map
    val user: LiveData<User> = _userId.map { id ->
        repository.getUserById(id)
    }
    
    // Transform: switchMap (for suspend functions)
    val userDetails: LiveData<UserDetails> = _userId.switchMap { id ->
        liveData {
            val details = repository.getUserDetails(id)
            emit(details)
        }
    }
    
    // Combine multiple LiveData
    val fullName: LiveData<String> = user.map { user ->
        "${user.firstName} ${user.lastName}"
    }
    
    fun setUserId(id: Int) {
        _userId.value = id
    }
}
```

### MediatorLiveData (Combine Multiple Sources)

```kotlin
class CheckoutViewModel : ViewModel() {
    
    private val _cart = MutableLiveData<List<CartItem>>()
    private val _shippingCost = MutableLiveData<Double>()
    private val _taxRate = MutableLiveData<Double>()
    
    // Combine multiple LiveData sources
    val totalCost = MediatorLiveData<Double>().apply {
        addSource(_cart) { calculateTotal() }
        addSource(_shippingCost) { calculateTotal() }
        addSource(_taxRate) { calculateTotal() }
    }
    
    private fun MediatorLiveData<Double>.calculateTotal() {
        val cartTotal = _cart.value?.sumOf { it.price * it.quantity } ?: 0.0
        val shipping = _shippingCost.value ?: 0.0
        val taxRate = _taxRate.value ?: 0.0
        
        val subtotal = cartTotal + shipping
        val tax = subtotal * taxRate
        value = subtotal + tax
    }
    
    fun updateCart(items: List<CartItem>) {
        _cart.value = items
    }
    
    fun updateShipping(cost: Double) {
        _shippingCost.value = cost
    }
}
```

### LiveData with Coroutines

```kotlin
class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {
    
    // liveData builder
    val products: LiveData<List<Product>> = liveData {
        emit(emptyList()) // Initial value
        
        try {
            val data = repository.getProducts()
            emit(data)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }
    
    // With Flow
    val productsFlow: LiveData<List<Product>> = 
        repository.productsFlow.asLiveData()
    
    // Manual control
    private val _searchResults = MutableLiveData<List<Product>>()
    val searchResults: LiveData<List<Product>> = _searchResults
    
    fun search(query: String) {
        viewModelScope.launch {
            _searchResults.value = repository.search(query)
        }
    }
}
```

## StateFlow vs LiveData

StateFlow is the modern alternative to LiveData:

```kotlin
class ModernViewModel : ViewModel() {
    
    // StateFlow (modern approach)
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    private val _items = MutableStateFlow<List<Item>>(emptyList())
    val items: StateFlow<List<Item>> = _items.asStateFlow()
    
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            
            try {
                val data = fetchData()
                _items.value = data
                _uiState.value = UiState.Success
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

// Observing StateFlow in Fragment
class MyFragment : Fragment() {
    
    private val viewModel: ModernViewModel by viewModels()
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Collect StateFlow
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    handleUiState(state)
                }
            }
        }
        
        // Collect items
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.items.collect { items ->
                    adapter.submitList(items)
                }
            }
        }
    }
}
```

**LiveData vs StateFlow:**

| Feature | LiveData | StateFlow |
|---------|----------|-----------|
| Lifecycle aware | Yes (automatic) | Manual (repeatOnLifecycle) |
| Initial value | Optional | Required |
| Kotlin only | No (Java compatible) | Yes |
| Transformation | map, switchMap | Flow operators |
| Replay | No | Yes (last value) |
| Recommended | Legacy code | New code |

## Practical Example: Todo App

```kotlin
// Data classes
data class Todo(
    val id: Int = 0,
    val title: String,
    val description: String,
    val isCompleted: Boolean = false,
    val priority: Priority,
    val dueDate: Long? = null,
    val createdAt: Long = System.currentTimeMillis()
)

enum class Priority { LOW, MEDIUM, HIGH }

sealed class TodoUiState {
    object Loading : TodoUiState()
    data class Success(val todos: List<Todo>) : TodoUiState()
    data class Error(val message: String) : TodoUiState()
}

// ViewModel
class TodoViewModel(
    private val repository: TodoRepository
) : ViewModel() {
    
    // UI State
    private val _uiState = MutableStateFlow<TodoUiState>(TodoUiState.Loading)
    val uiState: StateFlow<TodoUiState> = _uiState.asStateFlow()
    
    // Filter state
    private val _filter = MutableStateFlow<TodoFilter>(TodoFilter.ALL)
    val filter: StateFlow<TodoFilter> = _filter.asStateFlow()
    
    // All todos from database
    private val allTodos: Flow<List<Todo>> = repository.getAllTodos()
    
    // Filtered todos
    val filteredTodos: StateFlow<List<Todo>> = combine(
        allTodos,
        _filter
    ) { todos, filter ->
        when (filter) {
            TodoFilter.ALL -> todos
            TodoFilter.ACTIVE -> todos.filter { !it.isCompleted }
            TodoFilter.COMPLETED -> todos.filter { it.isCompleted }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )
    
    // Statistics
    val stats: StateFlow<TodoStats> = allTodos.map { todos ->
        TodoStats(
            total = todos.size,
            completed = todos.count { it.isCompleted },
            active = todos.count { !it.isCompleted }
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = TodoStats(0, 0, 0)
    )
    
    init {
        loadTodos()
    }
    
    fun loadTodos() {
        viewModelScope.launch {
            _uiState.value = TodoUiState.Loading
            
            try {
                // Todos are automatically updated via Flow
                _uiState.value = TodoUiState.Success(emptyList())
            } catch (e: Exception) {
                _uiState.value = TodoUiState.Error(e.message ?: "Failed to load todos")
            }
        }
    }
    
    fun addTodo(title: String, description: String, priority: Priority, dueDate: Long?) {
        viewModelScope.launch {
            val todo = Todo(
                title = title,
                description = description,
                priority = priority,
                dueDate = dueDate
            )
            repository.insertTodo(todo)
        }
    }
    
    fun updateTodo(todo: Todo) {
        viewModelScope.launch {
            repository.updateTodo(todo)
        }
    }
    
    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            repository.deleteTodo(todo)
        }
    }
    
    fun toggleComplete(todo: Todo) {
        viewModelScope.launch {
            val updated = todo.copy(isCompleted = !todo.isCompleted)
            repository.updateTodo(updated)
        }
    }
    
    fun setFilter(filter: TodoFilter) {
        _filter.value = filter
    }
    
    fun deleteCompleted() {
        viewModelScope.launch {
            repository.deleteCompleted()
        }
    }
}

enum class TodoFilter { ALL, ACTIVE, COMPLETED }

data class TodoStats(
    val total: Int,
    val completed: Int,
    val active: Int
)

// Fragment
class TodoListFragment : Fragment() {
    
    private var _binding: FragmentTodoListBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: TodoViewModel by viewModels {
        TodoViewModelFactory(repository)
    }
    
    private lateinit var adapter: TodoAdapter
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeViewModel()
        setupFilters()
        setupFab()
    }
    
    private fun setupRecyclerView() {
        adapter = TodoAdapter(
            onTodoClick = { todo ->
                editTodo(todo)
            },
            onCheckChanged = { todo, isChecked ->
                viewModel.toggleComplete(todo)
            },
            onDeleteClick = { todo ->
                confirmDelete(todo)
            }
        )
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@TodoListFragment.adapter
            addItemDecoration(DividerItemDecoration(context, DividerItemDecoration.VERTICAL))
        }
    }
    
    private fun observeViewModel() {
        // Observe filtered todos
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.filteredTodos.collect { todos ->
                    adapter.submitList(todos)
                    updateEmptyState(todos.isEmpty())
                }
            }
        }
        
        // Observe statistics
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.stats.collect { stats ->
                    updateStatsDisplay(stats)
                }
            }
        }
        
        // Observe UI state
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    when (state) {
                        is TodoUiState.Loading -> {
                            binding.progressBar.visibility = View.VISIBLE
                        }
                        is TodoUiState.Success -> {
                            binding.progressBar.visibility = View.GONE
                        }
                        is TodoUiState.Error -> {
                            binding.progressBar.visibility = View.GONE
                            showError(state.message)
                        }
                    }
                }
            }
        }
        
        // Observe filter
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.filter.collect { filter ->
                    updateFilterChips(filter)
                }
            }
        }
    }
    
    private fun setupFilters() {
        binding.chipAll.setOnClickListener {
            viewModel.setFilter(TodoFilter.ALL)
        }
        
        binding.chipActive.setOnClickListener {
            viewModel.setFilter(TodoFilter.ACTIVE)
        }
        
        binding.chipCompleted.setOnClickListener {
            viewModel.setFilter(TodoFilter.COMPLETED)
        }
    }
    
    private fun setupFab() {
        binding.fab.setOnClickListener {
            showAddTodoDialog()
        }
    }
    
    private fun updateStatsDisplay(stats: TodoStats) {
        binding.statsText.text = "${stats.completed}/${stats.total} completed"
    }
    
    private fun updateFilterChips(filter: TodoFilter) {
        binding.chipAll.isChecked = filter == TodoFilter.ALL
        binding.chipActive.isChecked = filter == TodoFilter.ACTIVE
        binding.chipCompleted.isChecked = filter == TodoFilter.COMPLETED
    }
    
    private fun updateEmptyState(isEmpty: Boolean) {
        binding.emptyState.visibility = if (isEmpty) View.VISIBLE else View.GONE
        binding.recyclerView.visibility = if (isEmpty) View.GONE else View.VISIBLE
    }
    
    private fun showAddTodoDialog() {
        // Show dialog to add new todo
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_todo, null)
        // Setup dialog views...
        
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("New Todo")
            .setView(dialogView)
            .setPositiveButton("Add") { _, _ ->
                // Get values and add todo
                viewModel.addTodo(title, description, priority, dueDate)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun editTodo(todo: Todo) {
        // Navigate to edit screen or show dialog
    }
    
    private fun confirmDelete(todo: Todo) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Delete Todo")
            .setMessage("Are you sure you want to delete this todo?")
            .setPositiveButton("Delete") { _, _ ->
                viewModel.deleteTodo(todo)
                showUndoSnackbar(todo)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun showUndoSnackbar(todo: Todo) {
        Snackbar.make(binding.root, "Todo deleted", Snackbar.LENGTH_LONG)
            .setAction("UNDO") {
                viewModel.addTodo(
                    todo.title,
                    todo.description,
                    todo.priority,
                    todo.dueDate
                )
            }
            .show()
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("RETRY") {
                viewModel.loadTodos()
            }
            .show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Key Takeaways

✅ ViewModel survives configuration changes automatically  
✅ LiveData is lifecycle-aware and prevents memory leaks  
✅ StateFlow is the modern alternative to LiveData  
✅ Use `viewLifecycleOwner` in Fragments, not `this`  
✅ Combine multiple data sources with MediatorLiveData or Flow.combine  
✅ Use `repeatOnLifecycle(STARTED)` for StateFlow collection  
✅ ViewModel should expose immutable LiveData/StateFlow  

## Best Practices

1. **Never pass Context to ViewModel** (use AndroidViewModel if needed)
2. **Expose immutable LiveData/StateFlow** from ViewModel
3. **Use viewLifecycleOwner** in Fragments
4. **Collect Flows in repeatOnLifecycle(STARTED)**
5. **Clean up in onCleared()** (cancel jobs, close resources)
6. **Use transformation functions** instead of manually observing multiple LiveData
7. **Prefer StateFlow** for new code

## Practice Exercise

Create a fitness tracker app with:
1. ViewModel managing workout sessions
2. LiveData/StateFlow for workout stats
3. Shared ViewModel between workout list and detail screens
4. MediatorLiveData combining multiple metrics
5. Proper lifecycle handling
6. Configuration change survival

## Next Steps

Next, we'll explore Dependency Injection with Hilt to manage ViewModel dependencies more elegantly!

---

**Resources:**
- [ViewModel Overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [LiveData Overview](https://developer.android.com/topic/libraries/architecture/livedata)
- [StateFlow and SharedFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)