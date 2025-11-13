---
title: Control Flow & Functions
description: Master if statements, switch cases, loops, and functions in Swift
platform: ios
order: 6
---

# Control Flow & Functions

Control flow and functions are the building blocks of program logic. Swift makes these concepts powerful and expressive.

## If Statements and Ternary Operator

### Basic If

```swift
let age = 18

if age >= 18 {
    print("Adult")
} else {
    print("Minor")
}

// If-else if-else
let score = 85

if score >= 90 {
    print("A")
} else if score >= 80 {
    print("B")
} else if score >= 70 {
    print("C")
} else if score >= 60 {
    print("D")
} else {
    print("F")
}
```

### Ternary Operator

```swift
let age = 20
let status = age >= 18 ? "Adult" : "Minor"

let max = a > b ? a : b

// Nested ternary (use sparingly)
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" : "F"
```

:::compare-react-native
JavaScript conditionals:
```javascript
const age = 18;

if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}

// Ternary
const status = age >= 18 ? "Adult" : "Minor";
```
:::compare-android
Kotlin conditionals:
```kotlin
val age = 18

if (age >= 18) {
    println("Adult")
} else {
    println("Minor")
}

// If as expression
val status = if (age >= 18) "Adult" else "Minor"
```
Swift's if is a statement, while Kotlin's if is an expression that returns a value.
:::

## Switch Statements

Swift's switch is powerful and exhaustive:

```swift
// Basic switch
let day = 3
switch day {
case 1:
    print("Monday")
case 2:
    print("Tuesday")
case 3:
    print("Wednesday")
case 4:
    print("Thursday")
case 5:
    print("Friday")
case 6, 7:  // Multiple values
    print("Weekend")
default:
    print("Invalid day")
}

// No fall-through (unlike C/Java)
// Each case must have a body or use fallthrough keyword

// Switch with ranges
let temperature = 25
switch temperature {
case ..<0:
    print("Freezing")
case 0..<10:
    print("Cold")
case 10..<20:
    print("Cool")
case 20..<30:
    print("Warm")
case 30...:
    print("Hot")
default:
    break
}

// Switch with tuples
let point = (0, 0)
switch point {
case (0, 0):
    print("Origin")
case (_, 0):
    print("On X-axis")
case (0, _):
    print("On Y-axis")
case (-2...2, -2...2):
    print("Inside the box")
default:
    print("Outside")
}

// Switch with where clause
let number = 5
switch number {
case let x where x % 2 == 0:
    print("\(x) is even")
case let x where x % 2 != 0:
    print("\(x) is odd")
default:
    break
}
```

### Pattern Matching

```swift
// Enum switching
enum TrafficLight {
    case red, yellow, green
}

let light = TrafficLight.red
switch light {
case .red:
    print("Stop")
case .yellow:
    print("Caution")
case .green:
    print("Go")
}
// No default needed - all cases covered!

// Optional switching
let optionalName: String? = "Alice"
switch optionalName {
case .some(let name):
    print("Name is \(name)")
case .none:
    print("No name")
}

// Type casting in switch
let item: Any = 42
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
```

:::compare-android
Kotlin when expression:
```kotlin
val day = 3
val dayName = when (day) {
    1 -> "Monday"
    2 -> "Tuesday"
    3 -> "Wednesday"
    in 6..7 -> "Weekend"
    else -> "Invalid"
}
```
Swift's switch and Kotlin's when are very similar, both more powerful than C-style switch.
:::

## Loops

### For-In Loop

```swift
// Range loops
for i in 1...5 {
    print(i)  // 1, 2, 3, 4, 5
}

for i in 1..<5 {
    print(i)  // 1, 2, 3, 4
}

// Reverse
for i in (1...5).reversed() {
    print(i)  // 5, 4, 3, 2, 1
}

// Step
for i in stride(from: 0, to: 10, by: 2) {
    print(i)  // 0, 2, 4, 6, 8
}

// Array iteration
let fruits = ["Apple", "Banana", "Cherry"]
for fruit in fruits {
    print(fruit)
}

// With index
for (index, fruit) in fruits.enumerated() {
    print("\(index): \(fruit)")
}

// Dictionary iteration
let ages = ["Alice": 25, "Bob": 30, "Charlie": 28]
for (name, age) in ages {
    print("\(name) is \(age) years old")
}

// Ignore value
for _ in 1...3 {
    print("Hello")
}
```

### While Loop

```swift
var count = 0
while count < 5 {
    print("Count: \(count)")
    count += 1
}

// Repeat-while (do-while)
var number = 0
repeat {
    print(number)
    number += 1
} while number < 5
```

### Loop Control

```swift
// Break - exit loop
for i in 1...10 {
    if i == 5 {
        break
    }
    print(i)  // 1, 2, 3, 4
}

// Continue - skip to next iteration
for i in 1...10 {
    if i % 2 == 0 {
        continue
    }
    print(i)  // 1, 3, 5, 7, 9
}

// Labeled statements
outerLoop: for i in 1...3 {
    for j in 1...3 {
        if i == 2 && j == 2 {
            break outerLoop
        }
        print("\(i), \(j)")
    }
}
```

## Functions

### Basic Functions

```swift
// Simple function
func greet() {
    print("Hello, World!")
}

// With parameters
func greet(name: String) {
    print("Hello, \(name)!")
}

// With return value
func add(a: Int, b: Int) -> Int {
    return a + b
}

// Single expression (implicit return)
func multiply(a: Int, b: Int) -> Int {
    a * b  // return keyword optional
}

// Multiple parameters
func calculateTotal(price: Double, quantity: Int, taxRate: Double) -> Double {
    let subtotal = price * Double(quantity)
    let tax = subtotal * taxRate
    return subtotal + tax
}

// Calling functions
greet()
greet(name: "Alice")
let sum = add(a: 5, b: 3)
let total = calculateTotal(price: 10.0, quantity: 2, taxRate: 0.08)
```

### Argument Labels

```swift
// External and internal parameter names
func greet(person name: String, from hometown: String) {
    print("Hello \(name) from \(hometown)!")
}

greet(person: "Alice", from: "NYC")

// Omitting external names with _
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

add(5, 3)  // No labels needed

// Default parameters
func greet(name: String = "Guest", greeting: String = "Hello") {
    print("\(greeting), \(name)!")
}

greet()                           // Hello, Guest!
greet(name: "Alice")              // Hello, Alice!
greet(name: "Bob", greeting: "Hi") // Hi, Bob!
greet(greeting: "Hey")            // Hey, Guest!
```

### Variadic Parameters

```swift
func sum(_ numbers: Int...) -> Int {
    var total = 0
    for number in numbers {
        total += number
    }
    return total
}

print(sum(1, 2, 3))           // 6
print(sum(1, 2, 3, 4, 5))     // 15

// Practical example
func average(_ numbers: Double...) -> Double {
    guard !numbers.isEmpty else { return 0 }
    let sum = numbers.reduce(0, +)
    return sum / Double(numbers.count)
}

print(average(85, 90, 92, 88))  // 88.75
```

### In-Out Parameters

```swift
// Modify parameters (pass by reference)
func swap(_ a: inout Int, _ b: inout Int) {
    let temp = a
    a = b
    b = temp
}

var x = 5
var y = 10
swap(&x, &y)
print("x: \(x), y: \(y)")  // x: 10, y: 5

// Practical example
func increment(_ value: inout Int, by amount: Int = 1) {
    value += amount
}

var count = 0
increment(&count)       // count = 1
increment(&count, by: 5) // count = 6
```

### Function Types

```swift
// Functions are first-class types
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

func multiply(_ a: Int, _ b: Int) -> Int {
    return a * b
}

// Assign function to variable
let mathOperation: (Int, Int) -> Int = add
print(mathOperation(5, 3))  // 8

mathOperation = multiply
print(mathOperation(5, 3))  // 15

// Function as parameter
func calculate(a: Int, b: Int, operation: (Int, Int) -> Int) -> Int {
    return operation(a, b)
}

let result1 = calculate(a: 5, b: 3, operation: add)      // 8
let result2 = calculate(a: 5, b: 3, operation: multiply) // 15

// Function returning function
func makeMultiplier(factor: Int) -> (Int) -> Int {
    return { number in
        number * factor
    }
}

let double = makeMultiplier(factor: 2)
let triple = makeMultiplier(factor: 3)

print(double(5))  // 10
print(triple(5))  // 15
```

## Closures

Closures are self-contained blocks of functionality (like lambdas):

```swift
// Closure syntax
let greet = { (name: String) -> String in
    return "Hello, \(name)!"
}

print(greet("Alice"))

// Shorter syntax
let add = { (a: Int, b: Int) in a + b }

// Closures with functions
let numbers = [1, 2, 3, 4, 5]

// Map
let doubled = numbers.map { $0 * 2 }  // [2, 4, 6, 8, 10]

// Filter
let evens = numbers.filter { $0 % 2 == 0 }  // [2, 4]

// Reduce
let sum = numbers.reduce(0) { $0 + $1 }  // 15

// Sorted
let sorted = numbers.sorted { $0 > $1 }  // [5, 4, 3, 2, 1]

// Trailing closure syntax
let result = calculate(a: 5, b: 3) { a, b in
    a * b
}

// Multiple trailing closures
func animate(duration: Double, animations: () -> Void, completion: () -> Void) {
    // Animation code
}

animate(duration: 1.0) {
    print("Animating...")
} completion: {
    print("Animation complete")
}
```

### Capturing Values

```swift
func makeIncrementer(incrementAmount: Int) -> () -> Int {
    var total = 0
    let incrementer = {
        total += incrementAmount
        return total
    }
    return incrementer
}

let incrementByTwo = makeIncrementer(incrementAmount: 2)
print(incrementByTwo())  // 2
print(incrementByTwo())  // 4
print(incrementByTwo())  // 6

let incrementByTen = makeIncrementer(incrementAmount: 10)
print(incrementByTen())  // 10
print(incrementByTen())  // 20
```

:::compare-android
Kotlin higher-order functions:
```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val doubled = numbers.map { it * 2 }
val evens = numbers.filter { it % 2 == 0 }
val sum = numbers.reduce { acc, num -> acc + num }

// Function type
val add: (Int, Int) -> Int = { a, b -> a + b }
```
Swift and Kotlin have very similar functional programming capabilities.
:::

## Guard Statements

Early exit pattern for cleaner code:

```swift
func greet(person: String?) {
    guard let name = person else {
        print("No name provided")
        return
    }
    
    // name is available here
    print("Hello, \(name)!")
}

// Multiple conditions
func process(name: String?, age: Int?, email: String?) {
    guard let name = name,
          let age = age,
          let email = email,
          age >= 18 else {
        print("Invalid input")
        return
    }
    
    // All values are safely unwrapped
    print("\(name), \(age), \(email)")
}

// Guard with conditions
func withdraw(amount: Double, from balance: Double) -> Double? {
    guard amount > 0,
          amount <= balance else {
        print("Invalid withdrawal")
        return nil
    }
    
    return balance - amount
}
```

## Defer Statement

Execute code when leaving scope:

```swift
func processFile() {
    print("Opening file")
    
    defer {
        print("Closing file")
    }
    
    print("Processing file")
    // "Closing file" will print here when function exits
}

// Multiple defers (execute in reverse order)
func example() {
    defer { print("First") }
    defer { print("Second") }
    defer { print("Third") }
    print("Main")
}
// Output: Main, Third, Second, First
```

## Practical Example: User Validation

```swift
enum ValidationError: Error {
    case emptyField(String)
    case invalidFormat(String)
    case tooShort(String, minimum: Int)
    case tooLong(String, maximum: Int)
}

struct UserValidator {
    
    func validateUsername(_ username: String) throws {
        guard !username.isEmpty else {
            throw ValidationError.emptyField("Username")
        }
        
        guard username.count >= 3 else {
            throw ValidationError.tooShort("Username", minimum: 3)
        }
        
        guard username.count <= 20 else {
            throw ValidationError.tooLong("Username", maximum: 20)
        }
        
        let validCharacters = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: "_"))
        guard username.unicodeScalars.allSatisfy({ validCharacters.contains($0) }) else {
            throw ValidationError.invalidFormat("Username can only contain letters, numbers, and underscores")
        }
    }
    
    func validateEmail(_ email: String) throws {
        guard !email.isEmpty else {
            throw ValidationError.emptyField("Email")
        }
        
        guard email.contains("@"), email.contains(".") else {
            throw ValidationError.invalidFormat("Invalid email format")
        }
    }
    
    func validatePassword(_ password: String) throws {
        guard !password.isEmpty else {
            throw ValidationError.emptyField("Password")
        }
        
        guard password.count >= 8 else {
            throw ValidationError.tooShort("Password", minimum: 8)
        }
        
        guard password.contains(where: { $0.isUppercase }) else {
            throw ValidationError.invalidFormat("Password must contain uppercase letter")
        }
        
        guard password.contains(where: { $0.isLowercase }) else {
            throw ValidationError.invalidFormat("Password must contain lowercase letter")
        }
        
        guard password.contains(where: { $0.isNumber }) else {
            throw ValidationError.invalidFormat("Password must contain a number")
        }
    }
    
    func validateAll(username: String, email: String, password: String) -> [String] {
        var errors: [String] = []
        
        do {
            try validateUsername(username)
        } catch {
            errors.append(error.localizedDescription)
        }
        
        do {
            try validateEmail(email)
        } catch {
            errors.append(error.localizedDescription)
        }
        
        do {
            try validatePassword(password)
        } catch {
            errors.append(error.localizedDescription)
        }
        
        return errors
    }
}

// Usage
let validator = UserValidator()

do {
    try validator.validateUsername("alice_2024")
    try validator.validateEmail("alice@example.com")
    try validator.validatePassword("SecurePass123")
    print("All validations passed!")
} catch ValidationError.emptyField(let field) {
    print("\(field) cannot be empty")
} catch ValidationError.invalidFormat(let message) {
    print(message)
} catch ValidationError.tooShort(let field, let minimum) {
    print("\(field) must be at least \(minimum) characters")
} catch {
    print("Unknown error: \(error)")
}
```

## Key Takeaways

✅ Swift's switch is exhaustive and powerful  
✅ Guard statements provide early exits  
✅ Functions are first-class types  
✅ Closures capture values from their environment  
✅ Argument labels make function calls readable  
✅ Default parameters provide flexibility  
✅ Defer ensures cleanup code runs  
✅ Error handling with do-try-catch  

## Practice Exercise

Create a shopping cart system with:
1. Function to add items with validation
2. Function to calculate total with tax
3. Function to apply discount codes
4. Use closures for custom sorting
5. Error handling for invalid operations
6. Guard statements for input validation

## Next Steps

Now let's dive deeper into Object-Oriented Programming in Swift to structure larger applications!

---

**Resources:**
- [Swift Control Flow](https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html)
- [Swift Functions](https://docs.swift.org/swift-book/LanguageGuide/Functions.html)
- [Swift Closures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html)