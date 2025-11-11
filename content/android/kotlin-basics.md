---
title: Kotlin Basics - Variables & Data Types
description: Master Kotlin variables, data types, type inference, and basic operations
platform: android
order: 5
---

# Kotlin Basics - Variables & Data Types

Kotlin is a modern, expressive language that makes Android development more enjoyable and productive. Let's master the fundamentals!

## Variables in Kotlin

Kotlin has two types of variables: `val` (immutable) and `var` (mutable).

### Immutable Variables with `val`

```kotlin
// val = value (read-only, cannot be reassigned)
val name = "John Doe"
val age = 25
val isStudent = true

// This will cause an error:
// name = "Jane Doe"  ❌ Cannot reassign val
```

**Use `val` by default** - it makes your code safer and easier to reason about.

### Mutable Variables with `var`

```kotlin
// var = variable (can be reassigned)
var score = 0
score = 10        // ✅ OK
score = score + 5  // ✅ OK
score++            // ✅ OK

var userName = "Alice"
userName = "Bob"   // ✅ OK
```

:::compare-react-native
JavaScript/TypeScript equivalents:
```javascript
// const is like val (immutable binding)
const name = "John Doe";
const age = 25;

// let is like var (mutable)
let score = 0;
score = 10;
score++;

// var in JS has function scope (avoid using it)
var oldStyle = "not recommended";
```
Kotlin's `val`/`var` distinction is clearer than JS's `const`/`let`, and Kotlin enforces immutability more strictly.
:::

## Type Inference

Kotlin can automatically infer types, but you can also specify them explicitly:

```kotlin
// Type inferred
val message = "Hello"           // String
val count = 42                  // Int
val price = 19.99               // Double
val isActive = true             // Boolean

// Explicit type declaration
val message: String = "Hello"
val count: Int = 42
val price: Double = 19.99
val isActive: Boolean = true

// Type is required when not initialized immediately
val result: String
if (someCondition) {
    result = "Success"
} else {
    result = "Failure"
}
```

**Best Practice**: Use type inference when the type is obvious, explicit types when it improves clarity.

## Basic Data Types

### Numbers

```kotlin
// Integers
val byte: Byte = 127                    // 8-bit: -128 to 127
val short: Short = 32767                // 16-bit: -32,768 to 32,767
val int: Int = 2147483647               // 32-bit (default for integers)
val long: Long = 9223372036854775807L   // 64-bit (note the L suffix)

// Floating-point
val float: Float = 3.14F                // 32-bit (note the F suffix)
val double: Double = 3.14159            // 64-bit (default for decimals)

// Underscores for readability
val million = 1_000_000
val creditCard = 1234_5678_9012_3456L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

### Number Operations

```kotlin
val a = 10
val b = 3

val sum = a + b           // 13
val difference = a - b    // 7
val product = a * b       // 30
val quotient = a / b      // 3 (integer division)
val remainder = a % b     // 1 (modulo)

// Type conversion (explicit)
val intValue: Int = 42
val longValue: Long = intValue.toLong()
val doubleValue: Double = intValue.toDouble()
val stringValue: String = intValue.toString()

// Division with different types
val result = 10 / 3.0     // 3.333... (Double)
val result2 = 10 / 3      // 3 (Int)
```

:::compare-react-native
JavaScript number handling:
```javascript
// JavaScript has only one number type
const a = 10;
const b = 3;

const sum = a + b;           // 13
const quotient = a / b;      // 3.3333... (always float division)
const intDivision = Math.floor(a / b);  // 3
const remainder = a % b;     // 1

// Type conversion
const intValue = 42;
const stringValue = intValue.toString();
const floatValue = parseFloat("3.14");
```
JavaScript has a single number type, while Kotlin has distinct integer and floating-point types with more precision control.
:::

### Characters and Strings

```kotlin
// Characters (single quotes)
val letter: Char = 'A'
val digit: Char = '5'
val symbol: Char = '@'

// Strings (double quotes)
val greeting = "Hello, World!"
val name = "Alice"

// Multi-line strings (triple quotes)
val multiLine = """
    This is a
    multi-line
    string
""".trimIndent()

val json = """
    {
        "name": "John",
        "age": 30
    }
""".trimIndent()
```

### String Templates

```kotlin
val name = "Alice"
val age = 25

// String interpolation with $
val message = "My name is $name"
val info = "I am $age years old"

// Expressions with ${}
val calculation = "Sum: ${10 + 20}"
val uppercase = "Uppercase: ${name.uppercase()}"
val conditional = "Status: ${if (age >= 18) "Adult" else "Minor"}"

// String properties and methods
val length = name.length              // 5
val upper = name.uppercase()          // "ALICE"
val lower = name.lowercase()          // "alice"
val contains = name.contains("lic")   // true
val startsWith = name.startsWith("Al") // true
val replace = name.replace("A", "E")  // "Elice"
```

:::compare-react-native
JavaScript template literals:
```javascript
const name = "Alice";
const age = 25;

// Template literals with backticks
const message = `My name is ${name}`;
const info = `I am ${age} years old`;

// Expressions
const calculation = `Sum: ${10 + 20}`;
const uppercase = `Uppercase: ${name.toUpperCase()}`;
const conditional = `Status: ${age >= 18 ? "Adult" : "Minor"}`;

// String methods
const length = name.length;
const upper = name.toUpperCase();
const lower = name.toLowerCase();
const contains = name.includes("lic");
```
Both Kotlin and JavaScript support string interpolation, but Kotlin uses `$` while JavaScript uses `${}` with backticks.
:::

### Booleans

```kotlin
val isActive = true
val isComplete = false

// Logical operators
val result1 = true && false   // AND: false
val result2 = true || false   // OR: true
val result3 = !true           // NOT: false

// Comparison operators
val a = 10
val b = 20

val equal = a == b            // false
val notEqual = a != b         // true
val greater = a > b           // false
val less = a < b              // true
val greaterOrEqual = a >= b   // false
val lessOrEqual = a <= b      // true
```

## Type Checking and Casting

```kotlin
val obj: Any = "Hello"

// Type checking with 'is'
if (obj is String) {
    // Smart cast - obj is automatically treated as String
    println(obj.length)
    println(obj.uppercase())
}

// Inverse check with '!is'
if (obj !is Int) {
    println("Not an integer")
}

// Manual casting (use carefully!)
val str = obj as String       // Throws exception if obj is not String
val str2 = obj as? String     // Returns null if obj is not String (safe cast)
```

:::compare-react-native
JavaScript type checking:
```javascript
const obj = "Hello";

// typeof operator
if (typeof obj === "string") {
    console.log(obj.length);
    console.log(obj.toUpperCase());
}

// instanceof for objects
if (obj instanceof String) {
    // ...
}

// TypeScript adds compile-time type checking
function process(obj: any) {
    if (typeof obj === "string") {
        // TypeScript knows obj is string here
        console.log(obj.toUpperCase());
    }
}
```
Kotlin's smart casting is more powerful than JavaScript's type checking, automatically casting after type checks.
:::

## Nullable Types

One of Kotlin's best features: **built-in null safety**!

```kotlin
// Non-nullable type (cannot be null)
var name: String = "Alice"
// name = null  ❌ Compilation error!

// Nullable type (can be null) - add ?
var nullableName: String? = "Bob"
nullableName = null  // ✅ OK

// Safe call operator ?.
val length = nullableName?.length        // Returns null if nullableName is null
val upper = nullableName?.uppercase()    // Returns null if nullableName is null

// Elvis operator ?: (provide default value)
val displayName = nullableName ?: "Guest"
val nameLength = nullableName?.length ?: 0

// Safe casting
val str: String? = obj as? String

// Not-null assertion !! (use sparingly!)
val name: String? = "Alice"
val length = name!!.length  // Throws NullPointerException if name is null
```

### Null Safety in Practice

```kotlin
fun getUserName(userId: Int): String? {
    // Might return null if user not found
    return if (userId > 0) "User $userId" else null
}

// Safe handling
val userName = getUserName(1)
println(userName?.length ?: 0)

// Let function - only executes if not null
userName?.let {
    println("User name: $it")
    println("Length: ${it.length}")
}

// Safe call chain
val country = user?.address?.city?.country
```

:::compare-react-native
JavaScript/TypeScript null handling:
```javascript
// JavaScript - no built-in null safety
let name = "Alice";
name = null;  // Allowed, can cause errors

// Manual null checks
const length = name ? name.length : 0;

// Optional chaining (ES2020+)
const country = user?.address?.city?.country;

// Nullish coalescing
const displayName = name ?? "Guest";

// TypeScript adds type safety
let name: string = "Alice";
// name = null;  ❌ Error if strictNullChecks is on

let nullableName: string | null = null;  // Explicit nullable
```
Kotlin enforces null safety at compile time, while JavaScript relies on runtime checks or TypeScript's optional type system.
:::

## Constants

```kotlin
// Compile-time constant (must be top-level or object member)
const val MAX_USERS = 100
const val API_KEY = "abc123xyz"
const val PI = 3.14159

// Runtime constant (can be calculated)
val timestamp = System.currentTimeMillis()
val randomNumber = (1..100).random()

// In a class
class Config {
    companion object {
        const val TIMEOUT = 30
        const val BASE_URL = "https://api.example.com"
    }
}

// Usage
if (userCount > MAX_USERS) {
    println("Too many users!")
}
```

## Practical Example: User Profile

Let's put it all together:

```kotlin
class UserProfile {
    // Properties with different types
    val userId: Int = 1001
    var username: String = "johndoe"
    var email: String? = null
    var age: Int = 25
    var isPremium: Boolean = false
    var balance: Double = 0.0
    
    // Computed property
    val displayName: String
        get() = username.replaceFirstChar { it.uppercase() }
    
    // Method with string templates
    fun getInfo(): String {
        return """
            User ID: $userId
            Username: $username
            Email: ${email ?: "Not provided"}
            Age: $age
            Premium: ${if (isPremium) "Yes" else "No"}
            Balance: $${"%.2f".format(balance)}
        """.trimIndent()
    }
    
    // Method with validation
    fun updateEmail(newEmail: String?): Boolean {
        return if (newEmail != null && newEmail.contains("@")) {
            email = newEmail
            true
        } else {
            false
        }
    }
    
    // Method with calculations
    fun addFunds(amount: Double) {
        if (amount > 0) {
            balance += amount
            println("Added $${"%.2f".format(amount)}. New balance: $${"%.2f".format(balance)}")
        }
    }
}

// Usage
fun main() {
    val user = UserProfile()
    
    user.username = "alice2024"
    user.updateEmail("alice@example.com")
    user.age = 28
    user.isPremium = true
    user.addFunds(50.0)
    
    println(user.getInfo())
    println("Display name: ${user.displayName}")
}
```

:::compare-react-native
React Native equivalent with TypeScript:
```typescript
interface UserProfile {
    userId: number;
    username: string;
    email: string | null;
    age: number;
    isPremium: boolean;
    balance: number;
}

class UserProfileManager {
    private profile: UserProfile;
    
    constructor() {
        this.profile = {
            userId: 1001,
            username: "johndoe",
            email: null,
            age: 25,
            isPremium: false,
            balance: 0.0
        };
    }
    
    get displayName(): string {
        return this.profile.username.charAt(0).toUpperCase() + 
               this.profile.username.slice(1);
    }
    
    getInfo(): string {
        return `
            User ID: ${this.profile.userId}
            Username: ${this.profile.username}
            Email: ${this.profile.email ?? "Not provided"}
            Age: ${this.profile.age}
            Premium: ${this.profile.isPremium ? "Yes" : "No"}
            Balance: $${this.profile.balance.toFixed(2)}
        `.trim();
    }
    
    updateEmail(newEmail: string | null): boolean {
        if (newEmail && newEmail.includes("@")) {
            this.profile.email = newEmail;
            return true;
        }
        return false;
    }
    
    addFunds(amount: number): void {
        if (amount > 0) {
            this.profile.balance += amount;
            console.log(`Added $${amount.toFixed(2)}. New balance: $${this.profile.balance.toFixed(2)}`);
        }
    }
}
```
Both achieve similar goals, but Kotlin's syntax is more concise with built-in null safety.
:::

## Android-Specific Example

Using variables in an Android Activity:

```kotlin
class ProfileActivity : AppCompatActivity() {
    
    // Properties
    private lateinit var binding: ActivityProfileBinding
    private var userId: Int = 0
    private var username: String = ""
    private var followers: Int = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Get data from intent
        userId = intent.getIntExtra("USER_ID", 0)
        username = intent.getStringExtra("USERNAME") ?: "Unknown"
        
        // Display user info
        updateUI()
        
        // Button click handling
        binding.followButton.setOnClickListener {
            followers++
            updateFollowerCount()
        }
    }
    
    private fun updateUI() {
        binding.usernameText.text = username
        binding.userIdText.text = "ID: $userId"
        updateFollowerCount()
    }
    
    private fun updateFollowerCount() {
        val followerText = when {
            followers == 0 -> "No followers yet"
            followers == 1 -> "1 follower"
            followers < 1000 -> "$followers followers"
            else -> "${followers / 1000}K followers"
        }
        binding.followerCountText.text = followerText
    }
}
```

## Common Mistakes and How to Avoid Them

### Mistake 1: Using var when val is sufficient

```kotlin
// ❌ Bad
var name = "Alice"
// ... name is never reassigned

// ✅ Good
val name = "Alice"
```

### Mistake 2: Ignoring null safety

```kotlin
// ❌ Bad - might crash
val length = nullableString!!.length

// ✅ Good - safe handling
val length = nullableString?.length ?: 0
```

### Mistake 3: String concatenation instead of templates

```kotlin
// ❌ Bad
val message = "Hello, " + name + "! You are " + age + " years old."

// ✅ Good
val message = "Hello, $name! You are $age years old."
```

### Mistake 4: Unnecessary explicit types

```kotlin
// ❌ Verbose
val name: String = "Alice"
val age: Int = 25

// ✅ Clean (when type is obvious)
val name = "Alice"
val age = 25
```

## Key Takeaways

✅ Use `val` by default, `var` only when you need mutability  
✅ Kotlin has powerful type inference - use it!  
✅ Null safety is built into the type system with `?`  
✅ String templates with `$` make code more readable  
✅ Smart casting reduces boilerplate  
✅ `const val` for compile-time constants  
✅ Safe call `?.` and Elvis `?:` operators handle nulls elegantly  

## Practice Exercise

Create a `Product` class with:
- Properties: id (Int), name (String), price (Double), description (String?), inStock (Boolean)
- A method to calculate discounted price
- A method to format product info as a string
- Handle null description gracefully

## Next Steps

Now that you understand variables and data types, let's explore control flow and functions to add logic to your applications!

---

**Resources:**
- [Kotlin Basic Types](https://kotlinlang.org/docs/basic-types.html)
- [Null Safety in Kotlin](https://kotlinlang.org/docs/null-safety.html)
- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)