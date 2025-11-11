---
title: Object-Oriented Programming in Kotlin
description: Master classes, objects, inheritance, interfaces, and OOP principles in Kotlin
platform: android
order: 7
---

# Object-Oriented Programming in Kotlin

Object-Oriented Programming (OOP) helps you structure code into reusable, maintainable components. Kotlin makes OOP more concise and powerful than traditional languages.

## Classes and Objects

### Basic Class

```kotlin
// Simple class
class User {
    var name: String = ""
    var age: Int = 0
    var email: String = ""
}

// Creating object (instance)
val user = User()
user.name = "Alice"
user.age = 25
user.email = "alice@example.com"

println("${user.name} is ${user.age} years old")
```

### Primary Constructor

```kotlin
// Class with primary constructor
class User(val name: String, val age: Int, var email: String) {
    // Properties are automatically created
    
    // init block runs when object is created
    init {
        println("User $name created")
        require(age >= 0) { "Age cannot be negative" }
    }
}

// Usage
val user = User("Alice", 25, "alice@example.com")
println(user.name)  // Alice
user.email = "newemail@example.com"  // var can be modified
// user.name = "Bob"  ❌ val cannot be reassigned
```

### Secondary Constructors

```kotlin
class User(val name: String, val age: Int) {
    var email: String = ""
    var phone: String = ""
    
    // Secondary constructor
    constructor(name: String, age: Int, email: String) : this(name, age) {
        this.email = email
    }
    
    // Another secondary constructor
    constructor(name: String, age: Int, email: String, phone: String) 
        : this(name, age, email) {
        this.phone = phone
    }
}

// Usage
val user1 = User("Alice", 25)
val user2 = User("Bob", 30, "bob@example.com")
val user3 = User("Charlie", 28, "charlie@example.com", "123-456-7890")
```

:::compare-react-native
JavaScript/TypeScript classes:
```javascript
// ES6 class
class User {
    constructor(name, age, email = "") {
        this.name = name;
        this.age = age;
        this.email = email;
        
        console.log(`User ${name} created`);
        if (age < 0) {
            throw new Error("Age cannot be negative");
        }
    }
}

// TypeScript with types
class User {
    constructor(
        public readonly name: string,
        public readonly age: number,
        public email: string
    ) {
        console.log(`User ${name} created`);
        if (age < 0) throw new Error("Age cannot be negative");
    }
}

// Usage
const user = new User("Alice", 25, "alice@example.com");
console.log(user.name);
```
Kotlin's primary constructor is more concise than JavaScript's constructor, and properties are defined inline.
:::

### Properties with Getters and Setters

```kotlin
class User(val firstName: String, val lastName: String) {
    var age: Int = 0
        set(value) {
            if (value < 0) {
                throw IllegalArgumentException("Age cannot be negative")
            }
            field = value  // 'field' is the backing field
        }
    
    // Computed property (no backing field)
    val fullName: String
        get() = "$firstName $lastName"
    
    // Property with custom getter
    val isAdult: Boolean
        get() = age >= 18
    
    // Private setter
    var accountBalance: Double = 0.0
        private set
    
    fun deposit(amount: Double) {
        if (amount > 0) {
            accountBalance += amount
        }
    }
}

// Usage
val user = User("Alice", "Smith")
user.age = 25
println(user.fullName)    // Alice Smith
println(user.isAdult)     // true
user.deposit(100.0)
// user.accountBalance = 500.0  ❌ private setter
```

### Methods

```kotlin
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
    
    fun subtract(a: Int, b: Int): Int = a - b
    
    fun multiply(a: Int, b: Int): Int {
        println("Multiplying $a and $b")
        return a * b
    }
    
    // Method with default parameters
    fun power(base: Double, exponent: Int = 2): Double {
        return Math.pow(base, exponent.toDouble())
    }
}

val calc = Calculator()
println(calc.add(5, 3))           // 8
println(calc.power(2.0))          // 4.0 (2^2)
println(calc.power(2.0, 3))       // 8.0 (2^3)
```

## Data Classes

Data classes are perfect for holding data with automatic implementations:

```kotlin
// Regular class (lots of boilerplate)
class PersonRegular(val name: String, val age: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is PersonRegular) return false
        return name == other.name && age == other.age
    }
    
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age
        return result
    }
    
    override fun toString(): String = "PersonRegular(name=$name, age=$age)"
}

// Data class (automatic implementations!)
data class Person(val name: String, val age: Int)

// Usage
val person1 = Person("Alice", 25)
val person2 = Person("Alice", 25)
val person3 = person1.copy(age = 26)  // Create copy with modifications

println(person1)                    // Person(name=Alice, age=25)
println(person1 == person2)         // true (structural equality)
println(person1 === person2)        // false (referential equality)

// Destructuring
val (name, age) = person1
println("$name is $age years old")
```

**Data class automatically provides:**
- `equals()` and `hashCode()`
- `toString()`
- `copy()` function
- `componentN()` functions for destructuring

:::compare-react-native
JavaScript doesn't have data classes, but you can use patterns:
```javascript
// Plain object
const person1 = { name: "Alice", age: 25 };
const person2 = { name: "Alice", age: 25 };

console.log(person1 === person2);  // false (different references)
console.log(JSON.stringify(person1) === JSON.stringify(person2));  // true

// Destructuring
const { name, age } = person1;

// Copy with modifications
const person3 = { ...person1, age: 26 };

// TypeScript interface
interface Person {
    name: string;
    age: number;
}

// Or use a class
class Person {
    constructor(public name: string, public age: number) {}
    
    toString() {
        return `Person(name=${this.name}, age=${this.age})`;
    }
}
```
Kotlin's data classes provide more built-in functionality than JavaScript objects.
:::

### Real-World Data Class Example

```kotlin
// User profile model
data class UserProfile(
    val id: Int,
    val username: String,
    val email: String,
    val age: Int,
    val isPremium: Boolean = false,
    val registeredAt: Long = System.currentTimeMillis()
)

// Product model
data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    val inStock: Boolean = true,
    val rating: Double = 0.0
)

// Order model
data class Order(
    val orderId: String,
    val userId: Int,
    val products: List<Product>,
    val totalAmount: Double,
    val status: OrderStatus
)

enum class OrderStatus {
    PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

// Usage in Android
class ProductActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProductBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProductBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        val product = Product(
            id = 1,
            name = "Wireless Headphones",
            price = 79.99,
            category = "Electronics",
            rating = 4.5
        )
        
        displayProduct(product)
    }
    
    private fun displayProduct(product: Product) {
        binding.apply {
            productName.text = product.name
            productPrice.text = "$${product.price}"
            productRating.text = "★ ${product.rating}"
            stockStatus.text = if (product.inStock) "In Stock" else "Out of Stock"
        }
    }
}
```

## Inheritance

```kotlin
// Base class (open to allow inheritance)
open class Animal(val name: String) {
    open fun makeSound() {
        println("$name makes a sound")
    }
    
    fun eat() {
        println("$name is eating")
    }
}

// Derived class
class Dog(name: String, val breed: String) : Animal(name) {
    override fun makeSound() {
        println("$name barks: Woof! Woof!")
    }
    
    fun fetch() {
        println("$name is fetching the ball")
    }
}

class Cat(name: String, val color: String) : Animal(name) {
    override fun makeSound() {
        println("$name meows: Meow!")
    }
    
    fun scratch() {
        println("$name is scratching")
    }
}

// Usage
val dog = Dog("Buddy", "Golden Retriever")
val cat = Cat("Whiskers", "Orange")

dog.makeSound()  // Buddy barks: Woof! Woof!
dog.eat()        // Buddy is eating
dog.fetch()      // Buddy is fetching the ball

cat.makeSound()  // Whiskers meows: Meow!
cat.scratch()    // Whiskers is scratching
```

**Key points:**
- Classes are `final` by default - use `open` to allow inheritance
- Methods are `final` by default - use `open` to allow override
- Use `override` keyword explicitly when overriding

:::compare-react-native
JavaScript inheritance:
```javascript
// Base class
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    makeSound() {
        console.log(`${this.name} makes a sound`);
    }
    
    eat() {
        console.log(`${this.name} is eating`);
    }
}

// Derived class
class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    makeSound() {
        console.log(`${this.name} barks: Woof! Woof!`);
    }
    
    fetch() {
        console.log(`${this.name} is fetching the ball`);
    }
}

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
dog.makeSound();
dog.eat();
dog.fetch();
```
JavaScript allows inheritance by default, while Kotlin requires explicit `open` keyword for better design control.
:::

### Abstract Classes

```kotlin
// Abstract class (cannot be instantiated)
abstract class Shape {
    abstract val name: String
    abstract fun area(): Double
    abstract fun perimeter(): Double
    
    // Concrete method
    fun describe() {
        println("$name - Area: ${area()}, Perimeter: ${perimeter()}")
    }
}

class Circle(val radius: Double) : Shape() {
    override val name = "Circle"
    
    override fun area(): Double = Math.PI * radius * radius
    
    override fun perimeter(): Double = 2 * Math.PI * radius
}

class Rectangle(val width: Double, val height: Double) : Shape() {
    override val name = "Rectangle"
    
    override fun area(): Double = width * height
    
    override fun perimeter(): Double = 2 * (width + height)
}

// Usage
val shapes: List<Shape> = listOf(
    Circle(5.0),
    Rectangle(4.0, 6.0)
)

for (shape in shapes) {
    shape.describe()
}
```

## Interfaces

```kotlin
// Interface
interface Clickable {
    fun click()  // Abstract method
    
    fun showInfo() {  // Default implementation
        println("This is clickable")
    }
}

interface Draggable {
    fun drag()
    fun drop()
}

// Implement single interface
class Button : Clickable {
    override fun click() {
        println("Button clicked!")
    }
}

// Implement multiple interfaces
class ImageView : Clickable, Draggable {
    override fun click() {
        println("Image clicked")
    }
    
    override fun drag() {
        println("Image is being dragged")
    }
    
    override fun drop() {
        println("Image dropped")
    }
}

// Usage
val button = Button()
button.click()
button.showInfo()

val imageView = ImageView()
imageView.click()
imageView.drag()
imageView.drop()
```

### Interface Properties

```kotlin
interface User {
    val name: String  // Abstract property
    val email: String
    
    val displayName: String  // Property with default implementation
        get() = name.uppercase()
}

class RegularUser(
    override val name: String,
    override val email: String
) : User

class AdminUser(
    override val name: String,
    override val email: String
) : User {
    override val displayName: String
        get() = "ADMIN: ${name.uppercase()}"
}

// Usage
val user1 = RegularUser("Alice", "alice@example.com")
val user2 = AdminUser("Bob", "bob@example.com")

println(user1.displayName)  // ALICE
println(user2.displayName)  // ADMIN: BOB
```

## Sealed Classes

Sealed classes restrict inheritance hierarchy - perfect for representing states:

```kotlin
// Sealed class
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val message: String, val code: Int) : Result()
    object Loading : Result()
}

// Function using sealed class
fun handleResult(result: Result) {
    when (result) {
        is Result.Success -> {
            println("Success: ${result.data}")
        }
        is Result.Error -> {
            println("Error ${result.code}: ${result.message}")
        }
        Result.Loading -> {
            println("Loading...")
        }
        // No else needed - compiler knows all cases!
    }
}

// Usage
val result1: Result = Result.Success("User data loaded")
val result2: Result = Result.Error("Network error", 404)
val result3: Result = Result.Loading

handleResult(result1)
handleResult(result2)
handleResult(result3)
```

### Real-World Example: UI State

```kotlin
sealed class UiState {
    object Idle : UiState()
    object Loading : UiState()
    data class Success(val data: List<Product>) : UiState()
    data class Error(val message: String) : UiState()
}

class ProductViewModel {
    private var state: UiState = UiState.Idle
    
    fun loadProducts() {
        state = UiState.Loading
        
        // Simulate API call
        try {
            val products = fetchProductsFromApi()
            state = UiState.Success(products)
        } catch (e: Exception) {
            state = UiState.Error(e.message ?: "Unknown error")
        }
    }
    
    private fun fetchProductsFromApi(): List<Product> {
        // Simulated API call
        return listOf(
            Product(1, "Phone", 699.99, "Electronics"),
            Product(2, "Laptop", 1299.99, "Electronics")
        )
    }
}

// In Activity
class ProductListActivity : AppCompatActivity() {
    private lateinit var viewModel: ProductViewModel
    
    fun updateUI(state: UiState) {
        when (state) {
            UiState.Idle -> {
                // Show initial state
            }
            UiState.Loading -> {
                binding.progressBar.visibility = View.VISIBLE
                binding.recyclerView.visibility = View.GONE
            }
            is UiState.Success -> {
                binding.progressBar.visibility = View.GONE
                binding.recyclerView.visibility = View.VISIBLE
                displayProducts(state.data)
            }
            is UiState.Error -> {
                binding.progressBar.visibility = View.GONE
                showError(state.message)
            }
        }
    }
}
```

:::compare-react-native
React handles state differently:
```javascript
// Using discriminated unions in TypeScript
type UiState = 
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'success', data: Product[] }
    | { type: 'error', message: string };

function ProductList() {
    const [state, setState] = useState<UiState>({ type: 'idle' });
    
    const loadProducts = async () => {
        setState({ type: 'loading' });
        
        try {
            const products = await fetchProducts();
            setState({ type: 'success', data: products });
        } catch (error) {
            setState({ type: 'error', message: error.message });
        }
    };
    
    // Render based on state
    switch (state.type) {
        case 'idle':
            return <Text>Start</Text>;
        case 'loading':
            return <ActivityIndicator />;
        case 'success':
            return <FlatList data={state.data} />;
        case 'error':
            return <Text>Error: {state.message}</Text>;
    }
}
```
Kotlin's sealed classes provide compile-time exhaustiveness checking, while TypeScript uses discriminated unions.
:::

## Object Declarations

Singleton pattern built into the language:

```kotlin
// Singleton object
object DatabaseManager {
    private val connections = mutableListOf<String>()
    
    fun connect(dbName: String) {
        connections.add(dbName)
        println("Connected to $dbName")
    }
    
    fun getConnectionCount(): Int = connections.size
}

// Usage (no instantiation needed)
DatabaseManager.connect("users_db")
DatabaseManager.connect("products_db")
println("Total connections: ${DatabaseManager.getConnectionCount()}")
```

### Companion Objects

Static-like members in classes:

```kotlin
class User private constructor(val name: String, val email: String) {
    companion object {
        private var idCounter = 1000
        
        // Factory method
        fun create(name: String, email: String): User {
            return User(name, email)
        }
        
        // Another factory method
        fun createGuest(): User {
            return User("Guest${idCounter++}", "guest@example.com")
        }
        
        // Constants
        const val MIN_AGE = 13
        const val MAX_NAME_LENGTH = 50
    }
}

// Usage
val user1 = User.create("Alice", "alice@example.com")
val user2 = User.createGuest()
println("Min age: ${User.MIN_AGE}")
```

:::compare-react-native
JavaScript static members:
```javascript
class User {
    static idCounter = 1000;
    static MIN_AGE = 13;
    static MAX_NAME_LENGTH = 50;
    
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    static create(name, email) {
        return new User(name, email);
    }
    
    static createGuest() {
        return new User(`Guest${this.idCounter++}`, "guest@example.com");
    }
}

// Usage
const user1 = User.create("Alice", "alice@example.com");
const user2 = User.createGuest();
console.log("Min age:", User.MIN_AGE);
```
Both support static members, but Kotlin uses companion objects which can implement interfaces and extend classes.
:::

## Practical Example: E-Commerce System

```kotlin
// Product hierarchy
sealed class Product(open val id: Int, open val name: String, open val price: Double) {
    data class Physical(
        override val id: Int,
        override val name: String,
        override val price: Double,
        val weight: Double,
        val shippingCost: Double
    ) : Product(id, name, price)
    
    data class Digital(
        override val id: Int,
        override val name: String,
        override val price: Double,
        val downloadLink: String
    ) : Product(id, name, price)
}

// Shopping cart
class ShoppingCart {
    private val items = mutableListOf<CartItem>()
    
    data class CartItem(val product: Product, var quantity: Int)
    
    fun addProduct(product: Product, quantity: Int = 1) {
        val existingItem = items.find { it.product.id == product.id }
        
        if (existingItem != null) {
            existingItem.quantity += quantity
        } else {
            items.add(CartItem(product, quantity))
        }
    }
    
    fun removeProduct(productId: Int) {
        items.removeIf { it.product.id == productId }
    }
    
    fun calculateTotal(): Double {
        return items.sumOf { item ->
            val productTotal = item.product.price * item.quantity
            
            when (item.product) {
                is Product.Physical -> {
                    productTotal + item.product.shippingCost
                }
                is Product.Digital -> productTotal
            }
        }
    }
    
    fun getItemCount(): Int = items.sumOf { it.quantity }
    
    fun getItems(): List<CartItem> = items.toList()
}

// Order processing
interface OrderProcessor {
    fun processOrder(cart: ShoppingCart): OrderResult
}

class DefaultOrderProcessor : OrderProcessor {
    override fun processOrder(cart: ShoppingCart): OrderResult {
        return if (cart.getItemCount() == 0) {
            OrderResult.Error("Cart is empty")
        } else {
            val orderId = generateOrderId()
            val total = cart.calculateTotal()
            OrderResult.Success(orderId, total)
        }
    }
    
    private fun generateOrderId(): String {
        return "ORD${System.currentTimeMillis()}"
    }
}

sealed class OrderResult {
    data class Success(val orderId: String, val total: Double) : OrderResult()
    data class Error(val message: String) : OrderResult()
}

// Usage in Activity
class CheckoutActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCheckoutBinding
    private val cart = ShoppingCart()
    private val processor = DefaultOrderProcessor()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCheckoutBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupSampleProducts()
        updateCartDisplay()
        
        binding.checkoutButton.setOnClickListener {
            processCheckout()
        }
    }
    
    private fun setupSampleProducts() {
        val phone = Product.Physical(1, "Smartphone", 699.99, 0.5, 10.0)
        val ebook = Product.Digital(2, "Kotlin Guide", 29.99, "https://download.link")
        
        cart.addProduct(phone, 1)
        cart.addProduct(ebook, 2)
    }
    
    private fun updateCartDisplay() {
        val itemCount = cart.getItemCount()
        val total = cart.calculateTotal()
        
        binding.itemCountText.text = "$itemCount items"
        binding.totalText.text = "${'$'}${"%.2f".format(total)}"
    }
    
    private fun processCheckout() {
        when (val result = processor.processOrder(cart)) {
            is OrderResult.Success -> {
                showSuccessMessage(result.orderId, result.total)
            }
            is OrderResult.Error -> {
                showErrorMessage(result.message)
            }
        }
    }
    
    private fun showSuccessMessage(orderId: String, total: Double) {
        val message = "Order $orderId placed! Total: $${"%.2f".format(total)}"
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    private fun showErrorMessage(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}
```

## Key Takeaways

✅ Use data classes for models and DTOs  
✅ Sealed classes are perfect for representing states  
✅ Interfaces over abstract classes when possible  
✅ Companion objects for static-like functionality  
✅ `open` keyword controls inheritance  
✅ Properties can have custom getters/setters  
✅ Object declarations create singletons easily  

## Practice Exercise

Create a task management system with:
1. Abstract Task class with properties and methods
2. Different task types (WorkTask, PersonalTask, UrgentTask)
3. TaskManager singleton for managing tasks
4. Sealed class for TaskStatus
5. Interface for TaskListener

## Next Steps

Next, we'll explore Kotlin's advanced features including null safety patterns, collections, and functional programming!

---

**Resources:**
- [Kotlin Classes and Objects](https://kotlinlang.org/docs/classes.html)
- [Data Classes](https://kotlinlang.org/docs/data-classes.html)
- [Sealed Classes](https://kotlinlang.org/docs/sealed-classes.html)