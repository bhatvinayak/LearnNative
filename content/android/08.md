---
title: Null Safety & Advanced Kotlin Features
description: Master null safety, collections, lambdas, and advanced Kotlin features for robust Android development
platform: android
order: 8
---

# Null Safety & Advanced Kotlin Features

Kotlin's null safety system eliminates the billion-dollar mistake (NullPointerException). Let's master it along with other advanced features that make Kotlin powerful.

## Deep Dive into Null Safety

### The Problem Kotlin Solves

```kotlin
// In Java/JavaScript - this can crash:
String name = user.getName();  // NullPointerException if user is null
int length = name.length();     // NullPointerException if name is null

// Kotlin forces you to handle nulls at compile time
val name: String = user.name    // ✅ Cannot be null
val name: String? = user.name   // ✅ Might be null, handled safely
```

### Nullable Types

```kotlin
// Non-nullable (default)
var name: String = "Alice"
// name = null  ❌ Compilation error

// Nullable (add ?)
var nullableName: String? = "Bob"
nullableName = null  // ✅ OK

// Function with nullable return
fun findUser(id: Int): User? {
    return if (id > 0) User("User $id") else null
}

val user = findUser(1)   // user is User?
// val length = user.name.length  ❌ Won't compile - user might be null
```

### Safe Call Operator (?.)

```kotlin
val name: String? = "Alice"

// Safe call - returns null if name is null
val length: Int? = name?.length
val upper: String? = name?.uppercase()

// Chain safe calls
val country: String? = user?.address?.city?.country

// With methods
val result: String? = user?.getName()?.uppercase()?.substring(0, 3)
```

:::compare-react-native
JavaScript optional chaining:
```javascript
const name = "Alice";

// Optional chaining (ES2020+)
const length = name?.length;
const upper = name?.toUpperCase();

// Chain
const country = user?.address?.city?.country;

// With methods
const result = user?.getName()?.toUpperCase()?.substring(0, 3);

// Before ES2020, you had to do:
const length = name && name.length;
const country = user && user.address && user.address.city && user.address.city.country;
```
Kotlin and modern JavaScript have similar optional chaining syntax, but Kotlin enforces it at compile time.
:::

### Elvis Operator (?:)

Provide default values for null cases:

```kotlin
// Without Elvis operator
val length: Int = if (name != null) name.length else 0

// With Elvis operator
val length: Int = name?.length ?: 0

// More examples
val displayName: String = username ?: "Guest"
val email: String = user?.email ?: "no-email@example.com"

// Early return
fun processUser(user: User?) {
    val validUser = user ?: return  // Return if user is null
    // Continue processing validUser (now smart-cast to non-null)
    println(validUser.name)
}

// Throw exception
fun getUser(id: Int): User {
    return findUser(id) ?: throw IllegalArgumentException("User not found")
}
```

### Not-Null Assertion (!!)

Force unwrap a nullable - use sparingly!

```kotlin
val name: String? = "Alice"

// Not-null assertion - throws NullPointerException if null
val length: Int = name!!.length

// Only use when you're 100% sure it's not null
fun processInput(input: String?) {
    // Bad practice - might crash
    println(input!!.length)
    
    // Better - handle null case
    input?.let { println(it.length) }
    
    // Or use Elvis
    println(input?.length ?: 0)
}
```

**When to use `!!`:**
- ✅ After null checks when compiler can't infer
- ✅ When interfacing with legacy Java code
- ❌ Avoid in production code when possible

### Safe Casts (as?)

```kotlin
val obj: Any = "Hello"

// Unsafe cast - throws ClassCastException if wrong type
val str: String = obj as String  // ✅ OK

val num: Int = obj as Int  // ❌ Crashes!

// Safe cast - returns null if wrong type
val str: String? = obj as? String  // ✅ "Hello"
val num: Int? = obj as? Int        // ✅ null (no crash)

// Practical usage
fun processValue(value: Any) {
    when (val str = value as? String) {
        null -> println("Not a string")
        else -> println("String: ${str.uppercase()}")
    }
}
```

### Let Function for Null Safety

```kotlin
val name: String? = "Alice"

// Execute block only if not null
name?.let {
    println("Name: $it")
    println("Length: ${it.length}")
    println("Uppercase: ${it.uppercase()}")
}

// let with result
val length: Int? = name?.let { it.length }

// Multiple let calls (chaining)
val result = user?.email?.let { email ->
    if (email.contains("@")) {
        email.substringBefore("@")
    } else {
        null
    }
}?.let { username ->
    username.uppercase()
}

// Android example
binding.emailEditText.text?.toString()?.let { email ->
    if (isValidEmail(email)) {
        sendEmail(email)
    }
}
```

### Practical Null Safety Example

```kotlin
data class Address(
    val street: String,
    val city: String,
    val country: String,
    val zipCode: String?
)

data class User(
    val id: Int,
    val name: String,
    val email: String?,
    val phone: String?,
    val address: Address?
)

class UserProfileManager {
    fun displayUserInfo(user: User?): String {
        // Handle null user
        val validUser = user ?: return "No user data"
        
        // Build profile string
        val profile = buildString {
            append("Name: ${validUser.name}\n")
            
            // Handle null email
            append("Email: ${validUser.email ?: "Not provided"}\n")
            
            // Handle null phone
            append("Phone: ${validUser.phone ?: "Not provided"}\n")
            
            // Handle null address with safe calls
            validUser.address?.let { addr ->
                append("Address:\n")
                append("  ${addr.street}\n")
                append("  ${addr.city}, ${addr.country}\n")
                // Handle null zipCode
                addr.zipCode?.let { zip ->
                    append("  $zip\n")
                }
            } ?: append("Address: Not provided\n")
        }
        
        return profile
    }
    
    fun getDisplayName(user: User?): String {
        return user?.name?.takeIf { it.isNotBlank() } ?: "Anonymous"
    }
    
    fun sendEmail(user: User?, message: String): Boolean {
        // Multiple null checks with Elvis
        val email = user?.email?.takeIf { it.contains("@") }
            ?: return false
        
        println("Sending to $email: $message")
        return true
    }
}
```

## Collections

Kotlin has rich collection APIs with functional operations:

### Lists

```kotlin
// Immutable list (read-only)
val fruits = listOf("Apple", "Banana", "Cherry")
// fruits.add("Date")  ❌ Cannot modify

// Mutable list
val mutableFruits = mutableListOf("Apple", "Banana")
mutableFruits.add("Cherry")
mutableFruits.remove("Banana")
mutableFruits[0] = "Apricot"

// List operations
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }              // [2, 4, 6, 8, 10]
val evens = numbers.filter { it % 2 == 0 }        // [2, 4]
val sum = numbers.reduce { acc, num -> acc + num } // 15
val sum2 = numbers.sum()                          // 15

// Find operations
val first = numbers.first()                        // 1
val last = numbers.last()                          // 5
val firstEven = numbers.firstOrNull { it % 2 == 0 } // 2

// Check operations
val hasEven = numbers.any { it % 2 == 0 }         // true
val allPositive = numbers.all { it > 0 }          // true
val noneNegative = numbers.none { it < 0 }        // true

// Take and drop
val firstThree = numbers.take(3)                  // [1, 2, 3]
val withoutFirstTwo = numbers.drop(2)             // [3, 4, 5]

// Sort
val sorted = listOf(3, 1, 4, 1, 5).sorted()      // [1, 1, 3, 4, 5]
val descending = numbers.sortedDescending()       // [5, 4, 3, 2, 1]
```

:::compare-react-native
JavaScript array methods:
```javascript
const fruits = ["Apple", "Banana", "Cherry"];
// fruits is mutable by default

const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, num) => acc + num, 0);

// Find operations
const first = numbers[0];
const last = numbers[numbers.length - 1];
const firstEven = numbers.find(n => n % 2 === 0);

// Check operations
const hasEven = numbers.some(n => n % 2 === 0);
const allPositive = numbers.every(n => n > 0);

// Slice (similar to take/drop)
const firstThree = numbers.slice(0, 3);
const withoutFirstTwo = numbers.slice(2);

// Sort
const sorted = [...numbers].sort((a, b) => a - b);
const descending = [...numbers].sort((a, b) => b - a);
```
Kotlin and JavaScript have very similar functional collection operations.
:::

### Sets

```kotlin
// Immutable set
val uniqueNumbers = setOf(1, 2, 3, 2, 1)  // [1, 2, 3]

// Mutable set
val mutableSet = mutableSetOf<String>()
mutableSet.add("Apple")
mutableSet.add("Banana")
mutableSet.add("Apple")  // Duplicate ignored
println(mutableSet.size)  // 2

// Set operations
val set1 = setOf(1, 2, 3, 4)
val set2 = setOf(3, 4, 5, 6)

val union = set1.union(set2)              // [1, 2, 3, 4, 5, 6]
val intersection = set1.intersect(set2)   // [3, 4]
val difference = set1.subtract(set2)      // [1, 2]
```

### Maps

```kotlin
// Immutable map
val ages = mapOf(
    "Alice" to 25,
    "Bob" to 30,
    "Charlie" to 28
)

// Access values
val aliceAge = ages["Alice"]  // 25 (Int?)
val davidAge = ages["David"]  // null

// With default
val age = ages.getOrDefault("David", 0)

// Mutable map
val mutableAges = mutableMapOf<String, Int>()
mutableAges["Alice"] = 25
mutableAges["Bob"] = 30
mutableAges.remove("Alice")

// Iterate over map
for ((name, age) in ages) {
    println("$name is $age years old")
}

// Map operations
val names = ages.keys        // [Alice, Bob, Charlie]
val ageValues = ages.values  // [25, 30, 28]

val filtered = ages.filter { (_, age) -> age > 25 }
val mapped = ages.mapValues { (_, age) -> age + 1 }
```

### Collection Transformations

```kotlin
data class User(val name: String, val age: Int, val city: String)

val users = listOf(
    User("Alice", 25, "New York"),
    User("Bob", 30, "London"),
    User("Charlie", 28, "New York"),
    User("David", 35, "London")
)

// Group by
val byCity = users.groupBy { it.city }
// {New York=[Alice, Charlie], London=[Bob, David]}

// Associate
val nameToAge = users.associate { it.name to it.age }
// {Alice=25, Bob=30, Charlie=28, David=35}

// Partition
val (adults, minors) = users.partition { it.age >= 30 }

// FlatMap
val names = listOf("Alice Bob", "Charlie David")
val allNames = names.flatMap { it.split(" ") }
// [Alice, Bob, Charlie, David]

// Distinct
val cities = users.map { it.city }.distinct()  // [New York, London]

// Sort by
val sortedByAge = users.sortedBy { it.age }
val sortedByName = users.sortedBy { it.name }
```

## Lambdas and Higher-Order Functions

### Lambda Syntax

```kotlin
// Full syntax
val sum: (Int, Int) -> Int = { a: Int, b: Int -> a + b }

// Type inference
val sum = { a: Int, b: Int -> a + b }

// Single parameter - use 'it'
val double: (Int) -> Int = { it * 2 }

// No parameters
val greeting: () -> String = { "Hello!" }

// Usage
println(sum(5, 3))       // 8
println(double(4))       // 8
println(greeting())      // Hello!
```

### Higher-Order Functions

```kotlin
// Function that takes a function
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

// Usage
val result1 = calculate(5, 3) { x, y -> x + y }    // 8
val result2 = calculate(5, 3) { x, y -> x * y }    // 15

// Function that returns a function
fun makeMultiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

val double = makeMultiplier(2)
val triple = makeMultiplier(3)

println(double(5))  // 10
println(triple(5))  // 15
```

### Inline Functions

```kotlin
// Inline function - reduces overhead of lambda objects
inline fun measureTime(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    val end = System.currentTimeMillis()
    println("Execution took ${end - start}ms")
}

// Usage
measureTime {
    // Some expensive operation
    Thread.sleep(1000)
}
```

## Sequences (Lazy Collections)

```kotlin
// List - eager evaluation (executes immediately)
val result = (1..1000000)
    .map { it * 2 }      // Creates new list
    .filter { it > 100 } // Creates another new list
    .take(10)            // Creates final list

// Sequence - lazy evaluation (executes only when needed)
val result2 = (1..1000000).asSequence()
    .map { it * 2 }      // No execution yet
    .filter { it > 100 } // No execution yet
    .take(10)            // Still no execution
    .toList()            // Now it executes

// Better performance for chained operations
val users = listOf(/* ... */)

// Efficient with sequence
val names = users.asSequence()
    .filter { it.age > 18 }
    .map { it.name }
    .take(5)
    .toList()
```

## Practical Android Example

```kotlin
data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    val rating: Double,
    val inStock: Boolean
)

class ProductRepository {
    private val products = listOf(
        Product(1, "Laptop", 999.99, "Electronics", 4.5, true),
        Product(2, "Phone", 699.99, "Electronics", 4.7, true),
        Product(3, "Desk", 299.99, "Furniture", 4.2, false),
        Product(4, "Chair", 199.99, "Furniture", 4.8, true),
        Product(5, "Monitor", 349.99, "Electronics", 4.6, true)
    )
    
    // Find product by ID (nullable return)
    fun findById(id: Int): Product? {
        return products.firstOrNull { it.id == id }
    }
    
    // Get products by category
    fun getByCategory(category: String): List<Product> {
        return products.filter { it.category == category }
    }
    
    // Get available products sorted by rating
    fun getTopRated(limit: Int): List<Product> {
        return products
            .filter { it.inStock }
            .sortedByDescending { it.rating }
            .take(limit)
    }
    
    // Search products
    fun search(query: String?): List<Product> {
        val searchTerm = query?.lowercase()?.trim() ?: return emptyList()
        
        return products.filter { product ->
            product.name.lowercase().contains(searchTerm) ||
            product.category.lowercase().contains(searchTerm)
        }
    }
    
    // Get price range statistics
    fun getPriceStats(): PriceStats? {
        val prices = products.map { it.price }
        
        return if (prices.isNotEmpty()) {
            PriceStats(
                min = prices.minOrNull() ?: 0.0,
                max = prices.maxOrNull() ?: 0.0,
                average = prices.average()
            )
        } else {
            null
        }
    }
    
    // Group by category with count
    fun getCategorySummary(): Map<String, Int> {
        return products.groupingBy { it.category }.eachCount()
    }
}

data class PriceStats(
    val min: Double,
    val max: Double,
    val average: Double
)

// Usage in Activity
class ProductActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProductBinding
    private val repository = ProductRepository()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProductBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupSearchButton()
        displayTopProducts()
    }
    
    private fun setupSearchButton() {
        binding.searchButton.setOnClickListener {
            val query = binding.searchInput.text?.toString()
            val results = repository.search(query)
            
            displaySearchResults(results)
        }
    }
    
    private fun displayTopProducts() {
        val topProducts = repository.getTopRated(3)
        
        val productNames = topProducts.joinToString("\n") { product ->
            "${product.name} - ★${product.rating}"
        }
        
        binding.topProductsText.text = productNames
    }
    
    private fun displaySearchResults(products: List<Product>) {
        val message = when {
            products.isEmpty() -> "No products found"
            products.size == 1 -> "Found 1 product"
            else -> "Found ${products.size} products"
        }
        
        binding.resultCountText.text = message
        
        // Display products (simplified)
        val productList = products.joinToString("\n") { it.name }
        binding.productListText.text = productList
    }
}
```

## Key Takeaways

✅ Kotlin's null safety prevents NullPointerExceptions at compile time  
✅ Use `?.` for safe calls, `?:` for default values  
✅ Avoid `!!` except when absolutely necessary  
✅ Collections have rich functional APIs (map, filter, reduce)  
✅ Use sequences for better performance with chained operations  
✅ Lambdas make code concise and expressive  
✅ Higher-order functions enable powerful abstractions  

## Practice Exercise

Create a book library system with:
1. Nullable types for optional book properties
2. Collection operations to filter and sort books
3. Higher-order functions for custom search criteria
4. Extension functions for formatting
5. Proper null safety throughout

## Next Steps

With Kotlin fundamentals mastered, we're ready to dive into UI development with Views, Layouts, and Material Design!

---

**Resources:**
- [Kotlin Null Safety](https://kotlinlang.org/docs/null-safety.html)
- [Kotlin Collections](https://kotlinlang.org/docs/collections-overview.html)
- [Lambdas and Higher-Order Functions](https://kotlinlang.org/docs/lambdas.html)