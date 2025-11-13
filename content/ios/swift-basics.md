---
title: Swift Basics - Variables & Data Types
description: Master Swift variables, data types, type inference, and basic operations
platform: ios
order: 5
---

# Swift Basics - Variables & Data Types

Swift is a powerful, modern language that makes iOS development safe and expressive. Let's master the fundamentals!

## Variables and Constants

Swift has two ways to declare values: `let` (immutable) and `var` (mutable).

### Constants with `let`

```swift
// let = constant (immutable, cannot be reassigned)
let name = "John Doe"
let age = 25
let isStudent = true

// This will cause an error:
// name = "Jane Doe"  ❌ Cannot assign to value: 'name' is a 'let' constant
```

**Use `let` by default** - it makes your code safer and more predictable.

### Variables with `var`

```swift
// var = variable (mutable, can be reassigned)
var score = 0
score = 10        // ✅ OK
score = score + 5  // ✅ OK
score += 5         // ✅ OK

var userName = "Alice"
userName = "Bob"   // ✅ OK
```

:::compare-react-native
JavaScript/TypeScript equivalents:
```javascript
// const is like let (immutable binding)
const name = "John Doe";
const age = 25;

// let is like var (mutable)
let score = 0;
score = 10;
score++;

// var in JS has function scope (avoid using it)
var oldStyle = "not recommended";
```
:::compare-android
Kotlin equivalents:
```kotlin
// val is like let (immutable)
val name = "John Doe"
val age = 25

// var is like var (mutable)
var score = 0
score = 10
score++
```
Swift's `let`/`var` is nearly identical to Kotlin's `val`/`var`.
:::

## Type Inference and Explicit Types

```swift
// Type inferred
let message = "Hello"           // String
let count = 42                  // Int
let price = 19.99               // Double
let isActive = true             // Bool

// Explicit type declaration
let message: String = "Hello"
let count: Int = 42
let price: Double = 19.99
let isActive: Bool = true

// Type is required when not initialized immediately
let result: String
if someCondition {
    result = "Success"
} else {
    result = "Failure"
}
```

## Basic Data Types

### Numbers

```swift
// Integers
let byte: Int8 = 127                    // 8-bit: -128 to 127
let short: Int16 = 32767                // 16-bit: -32,768 to 32,767
let int: Int = 2147483647               // 32 or 64-bit (platform dependent)
let long: Int64 = 9223372036854775807   // 64-bit

// Unsigned integers
let unsignedByte: UInt8 = 255           // 0 to 255
let unsignedInt: UInt = 4294967295      // Always positive

// Floating-point
let float: Float = 3.14                 // 32-bit, 6 decimal digits precision
let double: Double = 3.14159            // 64-bit (default for decimals)

// Underscores for readability
let million = 1_000_000
let creditCard = 1234_5678_9012_3456
let hexBytes = 0xFF_EC_DE_5E
let binary = 0b1101_0010_0110_1001
```

### Number Operations

```swift
let a = 10
let b = 3

let sum = a + b           // 13
let difference = a - b    // 7
let product = a * b       // 30
let quotient = a / b      // 3 (integer division)
let remainder = a % b     // 1 (modulo)

// Floating-point division
let result = 10.0 / 3.0   // 3.333...

// Type conversion (explicit)
let intValue: Int = 42
let doubleValue = Double(intValue)
let stringValue = String(intValue)

// Math operations
import Foundation
let power = pow(2.0, 3.0)           // 8.0
let squareRoot = sqrt(16.0)         // 4.0
let rounded = round(3.7)             // 4.0
let ceiling = ceil(3.1)              // 4.0
let floor = floor(3.9)               // 3.0
```

:::compare-android
Kotlin number handling:
```kotlin
val a = 10
val b = 3

val sum = a + b
val quotient = a / b      // 3 (integer division)
val result = 10.0 / 3.0   // 3.333...

// Type conversion
val intValue: Int = 42
val doubleValue = intValue.toDouble()
val stringValue = intValue.toString()
```
Very similar, but Swift uses initializers while Kotlin uses `to*()` methods.
:::

### Strings

```swift
// String literals
let greeting = "Hello, World!"
let name = "Alice"

// Multi-line strings
let multiLine = """
    This is a
    multi-line
    string
    """

let json = """
    {
        "name": "John",
        "age": 30
    }
    """

// String interpolation
let age = 25
let message = "My name is \(name)"
let info = "I am \(age) years old"
let calculation = "Sum: \(10 + 20)"
let conditional = "Status: \(age >= 18 ? "Adult" : "Minor")"

// String properties and methods
let length = name.count              // 5
let upper = name.uppercased()        // "ALICE"
let lower = name.lowercased()        // "alice"
let contains = name.contains("lic")  // true
let startsWith = name.hasPrefix("Al") // true
let endsWith = name.hasSuffix("ce")  // true
let replaced = name.replacingOccurrences(of: "A", with: "E") // "Elice"

// String indexing
let firstChar = name.first           // Optional("A")
let lastChar = name.last             // Optional("e")
```

### String Manipulation

```swift
// Concatenation
let firstName = "John"
let lastName = "Doe"
let fullName = firstName + " " + lastName

// Appending
var greeting = "Hello"
greeting += ", World!"

// Splitting
let sentence = "Swift is awesome"
let words = sentence.split(separator: " ")  // ["Swift", "is", "awesome"]

// Trimming
let text = "  Hello  "
let trimmed = text.trimmingCharacters(in: .whitespaces)  // "Hello"

// Checking empty
let empty = ""
if empty.isEmpty {
    print("String is empty")
}

// Character iteration
for char in "Swift" {
    print(char)  // S, w, i, f, t
}
```

:::compare-react-native
JavaScript string operations:
```javascript
const name = "Alice";
const age = 25;

// Template literals
const message = `My name is ${name}`;
const info = `I am ${age} years old`;

// String methods
const length = name.length;
const upper = name.toUpperCase();
const contains = name.includes("lic");
const split = sentence.split(" ");
```
Swift's string interpolation `\()` is cleaner than JavaScript's `${}`.
:::

### Booleans

```swift
let isActive = true
let isComplete = false

// Logical operators
let result1 = true && false   // AND: false
let result2 = true || false   // OR: true
let result3 = !true           // NOT: false

// Comparison operators
let a = 10
let b = 20

let equal = a == b            // false
let notEqual = a != b         // true
let greater = a > b           // false
let less = a < b              // true
let greaterOrEqual = a >= b   // false
let lessOrEqual = a <= b      // true
```

## Optionals - Swift's Killer Feature

Optionals represent values that might be absent (nil).

```swift
// Non-optional (cannot be nil)
var name: String = "Alice"
// name = nil  ❌ Error: nil cannot be assigned to type 'String'

// Optional (can be nil)
var optionalName: String? = "Bob"
optionalName = nil  // ✅ OK

// Declaring optionals
var age: Int? = 25
var email: String? = nil
```

### Unwrapping Optionals

```swift
var userName: String? = "Alice"

// 1. Force unwrapping (unsafe - use sparingly!)
let name = userName!  // Crashes if userName is nil

// 2. Optional binding (safe)
if let name = userName {
    print("Name is \(name)")
} else {
    print("No name")
}

// 3. Guard statement (early exit)
func greet(name: String?) {
    guard let name = name else {
        print("No name provided")
        return
    }
    print("Hello, \(name)")
}

// 4. Nil coalescing operator
let displayName = userName ?? "Guest"  // Use "Guest" if nil

// 5. Optional chaining
let length = userName?.count  // Returns nil if userName is nil
let upper = userName?.uppercased()

// 6. Multiple optional binding
if let name = userName, let email = userEmail {
    print("\(name): \(email)")
}
```

:::compare-android
Kotlin's null safety:
```kotlin
// Non-nullable
var name: String = "Alice"
// name = null  ❌ Error

// Nullable
var optionalName: String? = "Bob"
optionalName = null  // ✅ OK

// Safe call
val length = optionalName?.length

// Elvis operator
val displayName = optionalName ?: "Guest"

// Not-null assertion (unsafe)
val name = optionalName!!  // Throws if null
```
Swift and Kotlin have nearly identical null safety features.
:::

### Implicitly Unwrapped Optionals

```swift
// Use when you're sure it will have a value after initialization
var viewController: UIViewController!

// It's still optional, but you don't need to unwrap it explicitly
// Use carefully - crashes if accessed while nil
```

## Collections

### Arrays

```swift
// Array literal
var fruits = ["Apple", "Banana", "Cherry"]
var numbers = [1, 2, 3, 4, 5]

// Explicit type
var names: [String] = ["Alice", "Bob"]
var scores: [Int] = [90, 85, 92]

// Empty array
var emptyArray: [Int] = []
var anotherEmpty = [String]()

// Array operations
fruits.append("Date")              // Add to end
fruits.insert("Apricot", at: 0)   // Insert at index
fruits.remove(at: 1)               // Remove at index
fruits.removeLast()                // Remove last
fruits.removeAll()                 // Clear all

// Accessing elements
let first = fruits[0]              // "Apple"
let last = fruits.last             // Optional("Cherry")
let count = fruits.count           // Number of elements
let isEmpty = fruits.isEmpty       // Check if empty

// Iteration
for fruit in fruits {
    print(fruit)
}

for (index, fruit) in fruits.enumerated() {
    print("\(index): \(fruit)")
}

// Array methods
let doubled = numbers.map { $0 * 2 }              // [2, 4, 6, 8, 10]
let evens = numbers.filter { $0 % 2 == 0 }        // [2, 4]
let sum = numbers.reduce(0, +)                    // 15
let sorted = numbers.sorted()                     // Ascending order
let reversed = numbers.reversed()                 // Reverse order
```

### Dictionaries

```swift
// Dictionary literal
var ages = ["Alice": 25, "Bob": 30, "Charlie": 28]

// Explicit type
var scores: [String: Int] = ["Math": 95, "English": 87]

// Empty dictionary
var emptyDict: [String: Int] = [:]
var anotherEmpty = [String: String]()

// Dictionary operations
ages["David"] = 35               // Add/update
ages["Alice"] = 26              // Update
ages.removeValue(forKey: "Bob") // Remove

// Accessing values (returns optional)
let aliceAge = ages["Alice"]     // Optional(26)
let eveAge = ages["Eve"]         // nil

// Safe access
if let age = ages["Alice"] {
    print("Alice is \(age)")
}

// Default value
let age = ages["Eve"] ?? 0

// Iteration
for (name, age) in ages {
    print("\(name) is \(age) years old")
}

// Keys and values
let names = Array(ages.keys)     // ["Alice", "Charlie", "David"]
let ageValues = Array(ages.values) // [26, 28, 35]
```

### Sets

```swift
// Set literal
var uniqueNumbers: Set<Int> = [1, 2, 3, 2, 1]  // Only keeps [1, 2, 3]

// Set operations
var fruits: Set = ["Apple", "Banana", "Cherry"]
fruits.insert("Date")           // Add
fruits.remove("Banana")         // Remove
let contains = fruits.contains("Apple")  // Check membership

// Set mathematics
let set1: Set = [1, 2, 3, 4]
let set2: Set = [3, 4, 5, 6]

let union = set1.union(set2)                // [1, 2, 3, 4, 5, 6]
let intersection = set1.intersection(set2)   // [3, 4]
let difference = set1.subtracting(set2)      // [1, 2]
let symmetric = set1.symmetricDifference(set2) // [1, 2, 5, 6]
```

## Tuples

Group multiple values together:

```swift
// Basic tuple
let person = ("Alice", 25)
print(person.0)  // "Alice"
print(person.1)  // 25

// Named tuple
let user = (name: "Bob", age: 30, city: "NYC")
print(user.name)   // "Bob"
print(user.age)    // 30

// Decomposition
let (name, age) = person
print("Name: \(name), Age: \(age)")

// Ignoring values
let (userName, _) = person  // Only extract name

// Function returning tuple
func getCoordinates() -> (x: Int, y: Int) {
    return (10, 20)
}

let coords = getCoordinates()
print("X: \(coords.x), Y: \(coords.y)")
```

## Type Aliases

```swift
// Create custom type names
typealias Coordinate = (x: Double, y: Double)
typealias UserID = Int
typealias CompletionHandler = (Bool) -> Void

// Usage
let point: Coordinate = (x: 10.5, y: 20.3)
let userId: UserID = 12345
```

## Type Checking and Casting

```swift
// Type checking
let value: Any = "Hello"

if value is String {
    print("It's a String")
}

if value is Int {
    print("It's an Int")
}

// Type casting
let str = value as? String  // Optional cast (safe)
let num = value as? Int     // Returns nil

// Force cast (use carefully)
let forcedStr = value as! String  // Crashes if wrong type

// Working with Any
let items: [Any] = [1, "Hello", true, 3.14]

for item in items {
    switch item {
    case let int as Int:
        print("Int: \(int)")
    case let string as String:
        print("String: \(string)")
    case let bool as Bool:
        print("Bool: \(bool)")
    default:
        print("Unknown type")
    }
}
```

## Practical Example: User Profile

```swift
struct UserProfile {
    // Properties
    let userId: Int
    var username: String
    var email: String?
    var age: Int
    var isPremium: Bool
    var balance: Double
    var tags: [String]
    
    // Computed property
    var displayName: String {
        return username.capitalized
    }
    
    var isAdult: Bool {
        return age >= 18
    }
    
    // Methods
    func getInfo() -> String {
        let emailText = email ?? "Not provided"
        let premiumText = isPremium ? "Yes" : "No"
        
        return """
        User ID: \(userId)
        Username: \(username)
        Email: \(emailText)
        Age: \(age)
        Premium: \(premiumText)
        Balance: $\(String(format: "%.2f", balance))
        Tags: \(tags.joined(separator: ", "))
        """
    }
    
    mutating func addTag(_ tag: String) {
        if !tags.contains(tag) {
            tags.append(tag)
        }
    }
    
    mutating func addFunds(_ amount: Double) {
        guard amount > 0 else { return }
        balance += amount
        print("Added $\(String(format: "%.2f", amount)). New balance: $\(String(format: "%.2f", balance))")
    }
}

// Usage
var user = UserProfile(
    userId: 1001,
    username: "alice2024",
    email: "alice@example.com",
    age: 28,
    isPremium: true,
    balance: 0.0,
    tags: ["Developer", "iOS"]
)

user.addTag("Swift")
user.addFunds(50.0)
print(user.getInfo())
print("Display name: \(user.displayName)")
```

## Common Mistakes and Best Practices

### Mistake 1: Using var when let is sufficient

```swift
// ❌ Bad
var name = "Alice"
// ... name is never reassigned

// ✅ Good
let name = "Alice"
```

### Mistake 2: Force unwrapping optionals

```swift
// ❌ Bad - crashes if nil
let length = optionalString!.count

// ✅ Good - safe handling
if let string = optionalString {
    let length = string.count
}

// ✅ Also good
let length = optionalString?.count ?? 0
```

### Mistake 3: String concatenation in loops

```swift
// ❌ Bad - inefficient
var result = ""
for i in 1...1000 {
    result += "\(i)"
}

// ✅ Good - use array join
let result = (1...1000).map { "\($0)" }.joined()
```

## Key Takeaways

✅ Use `let` by default, `var` only when you need mutability  
✅ Swift has powerful type inference - use it!  
✅ Optionals prevent nil-related crashes  
✅ String interpolation with `\()` is clean and powerful  
✅ Collections (Array, Dictionary, Set) have rich APIs  
✅ Type safety prevents many common bugs  
✅ Guard statements provide early exits  

## Practice Exercise

Create a `Product` struct with:
- Properties: id, name, price, description (optional), inStock
- Computed property for discounted price
- Method to format product info as String
- Handle optional description gracefully
- Use proper types and optionals

## Next Steps

Now that you understand variables and data types, let's explore control flow and functions to add logic to your applications!

---

**Resources:**
- [Swift Language Guide](https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html)
- [Swift Standard Library](https://developer.apple.com/documentation/swift/swift-standard-library)
- [Swift API Guidelines](https://www.swift.org/documentation/api-design-guidelines/)