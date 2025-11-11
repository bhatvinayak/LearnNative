---
title: Control Flow & Functions
description: Master if expressions, when statements, loops, and functions in Kotlin
platform: android
order: 6
---

# Control Flow & Functions

Control flow and functions are the building blocks of program logic. Kotlin makes these concepts more powerful and expressive than traditional languages.

## If as an Expression

In Kotlin, `if` is an expression (returns a value), not just a statement:

```kotlin
// Traditional if statement
val max: Int
if (a > b) {
    max = a
} else {
    max = b
}

// If as expression (preferred)
val max = if (a > b) a else b

// With blocks
val result = if (score >= 60) {
    println("Passed!")
    "Pass"
} else {
    println("Failed!")
    "Fail"
}

// Nested if expressions
val grade = if (score >= 90) {
    "A"
} else if (score >= 80) {
    "B"
} else if (score >= 70) {
    "C"
} else if (score >= 60) {
    "D"
} else {
    "F"
}
```

:::compare-react-native
JavaScript/TypeScript conditionals:
```javascript
// Ternary operator (similar to Kotlin's if expression)
const max = a > b ? a : b;

// Traditional if statement
let result;
if (score >= 60) {
    console.log("Passed!");
    result = "Pass";
} else {
    console.log("Failed!");
    result = "Fail";
}

// Nested ternary (can get messy)
const grade = score >= 90 ? "A" :
              score >= 80 ? "B" :
              score >= 70 ? "C" :
              score >= 60 ? "D" : "F";
```
Kotlin's if expressions are cleaner and more readable than JavaScript's ternary operators for complex conditions.
:::

## When Expression (Like Switch, but Better)

The `when` expression is Kotlin's powerful alternative to switch statements:

```kotlin
// Basic when
val day = 3
val dayName = when (day) {
    1 -> "Monday"
    2 -> "Tuesday"
    3 -> "Wednesday"
    4 -> "Thursday"
    5 -> "Friday"
    6 -> "Saturday"
    7 -> "Sunday"
    else -> "Invalid day"
}

// Multiple conditions
val response = when (statusCode) {
    200, 201, 204 -> "Success"
    400, 404 -> "Client Error"
    500, 502, 503 -> "Server Error"
    else -> "Unknown Status"
}

// Ranges
val temperature = 25
val weather = when (temperature) {
    in 0..10 -> "Cold"
    in 11..20 -> "Cool"
    in 21..30 -> "Warm"
    in 31..40 -> "Hot"
    else -> "Extreme"
}

// Type checking
fun describe(obj: Any): String = when (obj) {
    1 -> "One"
    "Hello" -> "Greeting"
    is Long -> "Long number"
    is String -> "String of length ${obj.length}"
    is IntArray -> "Array of ${obj.size} integers"
    else -> "Unknown"
}

// Without argument (replaces if-else chains)
val score = 85
val grade = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    score >= 60 -> "D"
    else -> "F"
}
```

:::compare-react-native
JavaScript switch statement:
```javascript
const day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    // ... more cases
    default:
        dayName = "Invalid day";
}

// Or using an object map
const dayNames = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    // ...
};
const dayName = dayNames[day] || "Invalid day";

// Modern JavaScript - no direct equivalent to Kotlin's when
// Must use if-else or ternary operators
```
Kotlin's when is more powerful than JavaScript's switch, supporting ranges, type checks, and expressions without fall-through.
:::

## Loops

### For Loop

```kotlin
// Iterate over range
for (i in 1..5) {
    println(i)  // 1, 2, 3, 4, 5
}

// Until (exclusive end)
for (i in 1 until 5) {
    println(i)  // 1, 2, 3, 4
}

// Step
for (i in 1..10 step 2) {
    println(i)  // 1, 3, 5, 7, 9
}

// Reverse
for (i in 10 downTo 1) {
    println(i)  // 10, 9, 8, ..., 1
}

// Iterate over array/list
val fruits = listOf("Apple", "Banana", "Cherry")
for (fruit in fruits) {
    println(fruit)
}

// With index
for ((index, fruit) in fruits.withIndex()) {
    println("$index: $fruit")
}

// Iterate over map
val scores = mapOf("Alice" to 95, "Bob" to 87, "Charlie" to 92)
for ((name, score) in scores) {
    println("$name scored $score")
}
```

:::compare-react-native
JavaScript loops:
```javascript
// For loop
for (let i = 1; i <= 5; i++) {
    console.log(i);
}

// For...of (arrays)
const fruits = ["Apple", "Banana", "Cherry"];
for (const fruit of fruits) {
    console.log(fruit);
}

// With index using entries()
for (const [index, fruit] of fruits.entries()) {
    console.log(`${index}: ${fruit}`);
}

// For...in (objects)
const scores = { Alice: 95, Bob: 87, Charlie: 92 };
for (const name in scores) {
    console.log(`${name} scored ${scores[name]}`);
}

// Modern: forEach
fruits.forEach((fruit, index) => {
    console.log(`${index}: ${fruit}`);
});
```
Both support similar iteration patterns, but Kotlin's range syntax (1..5) is more concise than JavaScript's traditional for loop.
:::

### While and Do-While Loops

```kotlin
// While loop
var count = 0
while (count < 5) {
    println("Count: $count")
    count++
}

// Do-while (executes at least once)
var input: String
do {
    print("Enter 'quit' to exit: ")
    input = readLine() ?: ""
} while (input != "quit")

// Infinite loop with break
var sum = 0
var i = 1
while (true) {
    sum += i
    if (sum > 100) break
    i++
}
```

### Loop Control

```kotlin
// Break - exit loop
for (i in 1..10) {
    if (i == 5) break
    println(i)  // 1, 2, 3, 4
}

// Continue - skip to next iteration
for (i in 1..10) {
    if (i % 2 == 0) continue
    println(i)  // 1, 3, 5, 7, 9
}

// Labels for nested loops
outer@ for (i in 1..3) {
    inner@ for (j in 1..3) {
        if (i == 2 && j == 2) break@outer
        println("$i, $j")
    }
}
```

## Functions

### Basic Functions

```kotlin
// Simple function
fun greet() {
    println("Hello, World!")
}

// Function with parameters
fun greet(name: String) {
    println("Hello, $name!")
}

// Function with return type
fun add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function (return type inferred)
fun multiply(a: Int, b: Int) = a * b

// Multiple parameters
fun calculateTotal(price: Double, quantity: Int, taxRate: Double): Double {
    val subtotal = price * quantity
    val tax = subtotal * taxRate
    return subtotal + tax
}
```

### Default Parameters

```kotlin
fun greet(name: String = "Guest", greeting: String = "Hello") {
    println("$greeting, $name!")
}

// Usage
greet()                          // Hello, Guest!
greet("Alice")                   // Hello, Alice!
greet("Bob", "Hi")              // Hi, Bob!
greet(greeting = "Hey")         // Hey, Guest!

// Real-world example
fun createUser(
    username: String,
    email: String,
    age: Int = 0,
    isPremium: Boolean = false,
    role: String = "user"
) {
    println("Creating user: $username ($email)")
    println("Age: $age, Premium: $isPremium, Role: $role")
}

createUser("alice", "alice@example.com")
createUser("bob", "bob@example.com", age = 25, isPremium = true)
```

:::compare-react-native
JavaScript function parameters:
```javascript
// Default parameters (ES6+)
function greet(name = "Guest", greeting = "Hello") {
    console.log(`${greeting}, ${name}!`);
}

// Usage
greet();                          // Hello, Guest!
greet("Alice");                   // Hello, Alice!
greet("Bob", "Hi");              // Hi, Bob!

// Arrow functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Object destructuring for "named parameters"
function createUser({
    username,
    email,
    age = 0,
    isPremium = false,
    role = "user"
}) {
    console.log(`Creating user: ${username} (${email})`);
}

createUser({ 
    username: "alice", 
    email: "alice@example.com",
    age: 25 
});
```
Kotlin has true named parameters, while JavaScript uses object destructuring to simulate them.
:::

### Named Arguments

```kotlin
fun createProfile(
    name: String,
    age: Int,
    email: String,
    phone: String? = null
) {
    println("Profile: $name, $age, $email, $phone")
}

// Named arguments improve readability
createProfile(
    name = "Alice",
    age = 25,
    email = "alice@example.com"
)

// Mix positional and named (named must come after positional)
createProfile("Bob", age = 30, email = "bob@example.com")

// Skip optional parameters
createProfile(
    name = "Charlie",
    age = 28,
    email = "charlie@example.com",
    phone = "123-456-7890"
)
```

### Variable Number of Arguments (Varargs)

```kotlin
fun sum(vararg numbers: Int): Int {
    var total = 0
    for (num in numbers) {
        total += num
    }
    return total
}

// Usage
println(sum(1, 2, 3))           // 6
println(sum(1, 2, 3, 4, 5))     // 15

// Spread operator to pass array
val numbers = intArrayOf(1, 2, 3, 4)
println(sum(*numbers))          // 10

// Real-world example
fun log(level: String, vararg messages: String) {
    println("[$level] ${messages.joinToString(" | ")}")
}

log("INFO", "App started", "Version 1.0")
log("ERROR", "Connection failed", "Retrying...")
```

### Extension Functions

Extend existing classes without inheritance:

```kotlin
// Add function to String class
fun String.isPalindrome(): Boolean {
    val cleaned = this.lowercase().replace(" ", "")
    return cleaned == cleaned.reversed()
}

// Usage
println("racecar".isPalindrome())      // true
println("hello".isPalindrome())        // false

// Extension with parameters
fun String.repeat(times: Int): String {
    return this.repeat(times)
}

println("Ha".repeat(3))                // HaHaHa

// Real-world Android example
fun Context.showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

// Usage in Activity
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        showToast("Welcome!")
        showToast("Error occurred", Toast.LENGTH_LONG)
    }
}
```

:::compare-react-native
JavaScript doesn't have true extension functions, but you can extend prototypes:
```javascript
// Extending String prototype (not recommended in production)
String.prototype.isPalindrome = function() {
    const cleaned = this.toLowerCase().replace(/\s/g, '');
    return cleaned === cleaned.split('').reverse().join('');
};

console.log("racecar".isPalindrome());  // true

// Modern approach: utility functions
const isPalindrome = (str) => {
    const cleaned = str.toLowerCase().replace(/\s/g, '');
    return cleaned === cleaned.split('').reverse().join('');
};

console.log(isPalindrome("racecar"));   // true

// Or use classes
class StringUtils {
    static isPalindrome(str) {
        const cleaned = str.toLowerCase().replace(/\s/g, '');
        return cleaned === cleaned.split('').reverse().join('');
    }
}
```
Kotlin's extension functions are safer and more idiomatic than JavaScript's prototype extensions.
:::

### Higher-Order Functions

Functions that take functions as parameters or return functions:

```kotlin
// Function as parameter
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}

// Usage
val sum = calculate(5, 3) { x, y -> x + y }           // 8
val product = calculate(5, 3) { x, y -> x * y }       // 15

// Function type as variable
val add: (Int, Int) -> Int = { a, b -> a + b }
val multiply = { a: Int, b: Int -> a * b }

println(add(5, 3))        // 8
println(multiply(5, 3))   // 15

// Real-world example: list operations
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }              // [2, 4, 6, 8, 10]
val evens = numbers.filter { it % 2 == 0 }        // [2, 4]
val sum = numbers.reduce { acc, num -> acc + num } // 15

// With named function
fun isEven(number: Int): Boolean = number % 2 == 0
val evenNumbers = numbers.filter(::isEven)
```

:::compare-react-native
JavaScript higher-order functions:
```javascript
// Functions are first-class citizens in JS
function calculate(a, b, operation) {
    return operation(a, b);
}

const sum = calculate(5, 3, (x, y) => x + y);      // 8
const product = calculate(5, 3, (x, y) => x * y);  // 15

// Function variables
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Array methods (very similar to Kotlin)
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);           // [2, 4, 6, 8, 10]
const evens = numbers.filter(n => n % 2 === 0);    // [2, 4]
const sum = numbers.reduce((acc, num) => acc + num); // 15
```
Both Kotlin and JavaScript excel at functional programming, with very similar syntax for higher-order functions.
:::

## Scope Functions

Kotlin's scope functions help write concise code:

### let

```kotlin
// Execute code on non-null value
val name: String? = "Alice"
name?.let {
    println("Name length: ${it.length}")
    println("Uppercase: ${it.uppercase()}")
}

// Chain operations
val result = getName()?.let { name ->
    name.trim()
}?.let { trimmed ->
    trimmed.uppercase()
}

// Android example
binding.emailEditText.text?.toString()?.let { email ->
    if (email.contains("@")) {
        sendEmail(email)
    }
}
```

### apply

```kotlin
// Configure object properties
val person = Person().apply {
    name = "Alice"
    age = 25
    email = "alice@example.com"
}

// Android example
val textView = TextView(context).apply {
    text = "Hello"
    textSize = 20f
    setTextColor(Color.BLACK)
    setPadding(16, 16, 16, 16)
}
```

### with

```kotlin
// Multiple operations on same object
val numbers = mutableListOf(1, 2, 3)
with(numbers) {
    add(4)
    add(5)
    remove(1)
    println("Size: $size")
}

// Android example
with(binding) {
    titleText.text = "Welcome"
    subtitleText.text = "Hello, User"
    submitButton.setOnClickListener { /* ... */ }
}
```

### also

```kotlin
// Perform additional actions
val numbers = mutableListOf(1, 2, 3)
    .also { println("Original: $it") }
    .also { it.add(4) }
    .also { println("Modified: $it") }

// Debugging
fun processUser(user: User) = user
    .also { println("Processing user: ${it.name}") }
    .also { validateUser(it) }
    .also { println("User validated") }
```

### run

```kotlin
// Execute block and return result
val result = "Hello".run {
    println("Length: $length")
    uppercase()
}

// Android example
val isValid = run {
    val email = binding.emailInput.text.toString()
    val password = binding.passwordInput.text.toString()
    email.isNotEmpty() && password.length >= 6
}
```

## Practical Example: User Validation

```kotlin
class UserValidator {
    
    fun validateUsername(username: String): ValidationResult {
        return when {
            username.isEmpty() -> 
                ValidationResult.Error("Username cannot be empty")
            username.length < 3 -> 
                ValidationResult.Error("Username must be at least 3 characters")
            !username.matches(Regex("^[a-zA-Z0-9_]+$")) -> 
                ValidationResult.Error("Username can only contain letters, numbers, and underscores")
            else -> 
                ValidationResult.Success
        }
    }
    
    fun validateEmail(email: String): ValidationResult {
        return if (email.isEmpty()) {
            ValidationResult.Error("Email cannot be empty")
        } else if (!email.contains("@")) {
            ValidationResult.Error("Invalid email format")
        } else {
            ValidationResult.Success
        }
    }
    
    fun validatePassword(password: String): ValidationResult {
        val errors = mutableListOf<String>()
        
        if (password.length < 8) {
            errors.add("Password must be at least 8 characters")
        }
        if (!password.any { it.isUpperCase() }) {
            errors.add("Password must contain uppercase letter")
        }
        if (!password.any { it.isLowerCase() }) {
            errors.add("Password must contain lowercase letter")
        }
        if (!password.any { it.isDigit() }) {
            errors.add("Password must contain a number")
        }
        
        return if (errors.isEmpty()) {
            ValidationResult.Success
        } else {
            ValidationResult.Error(errors.joinToString(", "))
        }
    }
    
    fun validateAll(
        username: String,
        email: String,
        password: String
    ): ValidationResult {
        val results = listOf(
            validateUsername(username),
            validateEmail(email),
            validatePassword(password)
        )
        
        val errors = results.filterIsInstance<ValidationResult.Error>()
        
        return if (errors.isEmpty()) {
            ValidationResult.Success
        } else {
            ValidationResult.Error(
                errors.joinToString("\n") { it.message }
            )
        }
    }
}

sealed class ValidationResult {
    object Success : ValidationResult()
    data class Error(val message: String) : ValidationResult()
}

// Usage in Activity
class RegisterActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityRegisterBinding
    private val validator = UserValidator()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        binding.registerButton.setOnClickListener {
            handleRegistration()
        }
    }
    
    private fun handleRegistration() {
        val username = binding.usernameInput.text.toString()
        val email = binding.emailInput.text.toString()
        val password = binding.passwordInput.text.toString()
        
        when (val result = validator.validateAll(username, email, password)) {
            is ValidationResult.Success -> {
                showToast("Registration successful!")
                // Proceed with registration
            }
            is ValidationResult.Error -> {
                showToast(result.message)
            }
        }
    }
    
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}
```

## Key Takeaways

✅ Use `if` and `when` as expressions for cleaner code  
✅ `when` is more powerful than traditional switch statements  
✅ Prefer single-expression functions when possible  
✅ Use default and named parameters for flexibility  
✅ Extension functions add functionality without inheritance  
✅ Higher-order functions enable functional programming  
✅ Scope functions (`let`, `apply`, `with`, `also`, `run`) reduce boilerplate  

## Practice Exercise

Create a shopping cart system with:
1. Function to add items with validation
2. Function to calculate total with tax
3. Function to apply discount codes
4. Use when expression for different discount types
5. Extension function for price formatting

## Next Steps

Now let's dive deeper into Object-Oriented Programming in Kotlin to structure larger applications!

---

**Resources:**
- [Kotlin Control Flow](https://kotlinlang.org/docs/control-flow.html)
- [Kotlin Functions](https://kotlinlang.org/docs/functions.html)
- [Scope Functions](https://kotlinlang.org/docs/scope-functions.html)