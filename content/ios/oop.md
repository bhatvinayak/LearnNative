---
title: Object-Oriented Programming in Swift
description: Master classes, structs, protocols, and OOP principles in Swift
platform: ios
order: 7
---

# Object-Oriented Programming in Swift

Swift supports both object-oriented and protocol-oriented programming. Let's explore how to structure code into reusable, maintainable components.

## Structs vs Classes

Swift has both structs and classes. Understanding when to use each is crucial.

### Structs (Value Types)

```swift
struct User {
    var name: String
    var age: Int
    var email: String
    
    // Computed property
    var isAdult: Bool {
        return age >= 18
    }
    
    // Methods
    func displayInfo() {
        print("\(name), \(age) years old")
    }
    
    // Mutating methods (modify struct)
    mutating func haveBirthday() {
        age += 1
    }
}

// Usage
var user1 = User(name: "Alice", age: 25, email: "alice@example.com")
var user2 = user1  // Copies the value

user2.name = "Bob"
print(user1.name)  // "Alice" (unchanged)
print(user2.name)  // "Bob"
```

### Classes (Reference Types)

```swift
class Person {
    var name: String
    var age: Int
    
    // Initializer
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    
    // Methods
    func introduce() {
        print("Hi, I'm \(name)")
    }
    
    // Deinitializer (cleanup)
    deinit {
        print("\(name) is being deinitialized")
    }
}

// Usage
let person1 = Person(name: "Alice", age: 25)
let person2 = person1  // Shares the same reference

person2.name = "Bob"
print(person1.name)  // "Bob" (changed!)
print(person2.name)  // "Bob"
```

### When to Use Each

**Use Struct When:**
- Data is simple and small
- You want value semantics (copy behavior)
- No need for inheritance
- Thread safety is important

**Use Class When:**
- You need reference semantics
- You need inheritance
- You need deinitializers
- Working with Objective-C APIs

:::compare-android
Kotlin data classes vs classes:
```kotlin
// Data class (similar to struct)
data class User(val name: String, val age: Int)

// Regular class
class Person(var name: String, var age: Int) {
    fun introduce() {
        println("Hi, I'm $name")
    }
}
```
Kotlin's data classes are similar to Swift structs but are reference types.
:::

## Properties

### Stored Properties

```swift
struct Rectangle {
    var width: Double
    var height: Double
    
    // Property with default value
    var color: String = "blue"
}

class Circle {
    var radius: Double
    let pi = 3.14159  // Constant property
    
    init(radius: Double) {
        self.radius = radius
    }
}
```

### Computed Properties

```swift
struct Rectangle {
    var width: Double
    var height: Double
    
    // Read-only computed property
    var area: Double {
        return width * height
    }
    
    // Read-write computed property
    var perimeter: Double {
        get {
            return 2 * (width + height)
        }
        set {
            // newValue is the implicit parameter
            let side = newValue / 4
            width = side
            height = side
        }
    }
}

let rect = Rectangle(width: 10, height: 5)
print(rect.area)      // 50
print(rect.perimeter) // 30
```

### Property Observers

```swift
class StepCounter {
    var totalSteps: Int = 0 {
        willSet {
            print("About to set totalSteps to \(newValue)")
        }
        didSet {
            print("Added \(totalSteps - oldValue) steps")
        }
    }
}

let counter = StepCounter()
counter.totalSteps = 100
// Prints: About to set totalSteps to 100
// Prints: Added 100 steps
```

### Lazy Properties

```swift
class DataManager {
    // Expensive to create, only initialize when first accessed
    lazy var dataLoader: DataLoader = {
        print("Creating data loader")
        return DataLoader()
    }()
    
    func loadData() {
        dataLoader.load()  // dataLoader created here
    }
}

class DataLoader {
    func load() {
        print("Loading data...")
    }
}
```

## Methods

### Instance Methods

```swift
struct Counter {
    var count = 0
    
    mutating func increment() {
        count += 1
    }
    
    mutating func increment(by amount: Int) {
        count += amount
    }
    
    func display() {
        print("Count: \(count)")
    }
}

var counter = Counter()
counter.increment()
counter.increment(by: 5)
counter.display()  // Count: 6
```

### Type Methods (Static)

```swift
struct Math {
    static func add(_ a: Int, _ b: Int) -> Int {
        return a + b
    }
    
    static let pi = 3.14159
}

// Usage (no instance needed)
let sum = Math.add(5, 3)
print(Math.pi)

class Config {
    static var apiURL = "https://api.example.com"
    
    static func updateURL(_ newURL: String) {
        apiURL = newURL
    }
}

Config.updateURL("https://api.newexample.com")
```

## Initialization

### Designated Initializers

```swift
struct User {
    var name: String
    var age: Int
    var email: String
    
    // Memberwise initializer (automatic for structs)
    // init(name: String, age: Int, email: String)
    
    // Custom initializer
    init(name: String, age: Int) {
        self.name = name
        self.age = age
        self.email = "\(name.lowercased())@example.com"
    }
}

class Person {
    var name: String
    var age: Int
    
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    
    // Convenience initializer
    convenience init(name: String) {
        self.init(name: name, age: 0)
    }
}
```

### Failable Initializers

```swift
struct Temperature {
    var celsius: Double
    
    init?(fahrenheit: Double) {
        guard fahrenheit >= -459.67 else {
            return nil  // Absolute zero
        }
        celsius = (fahrenheit - 32) / 1.8
    }
}

if let temp = Temperature(fahrenheit: 100) {
    print("Valid temperature: \(temp.celsius)°C")
} else {
    print("Invalid temperature")
}
```

## Inheritance

```swift
// Base class
class Vehicle {
    var speed: Double
    var numberOfWheels: Int
    
    init(speed: Double, numberOfWheels: Int) {
        self.speed = speed
        self.numberOfWheels = numberOfWheels
    }
    
    func describe() {
        print("Vehicle with \(numberOfWheels) wheels, speed: \(speed)")
    }
}

// Derived class
class Car: Vehicle {
    var brand: String
    
    init(brand: String, speed: Double) {
        self.brand = brand
        super.init(speed: speed, numberOfWheels: 4)
    }
    
    // Override method
    override func describe() {
        print("\(brand) car, speed: \(speed)")
    }
    
    // New method
    func honk() {
        print("Beep beep!")
    }
}

// Another derived class
class Motorcycle: Vehicle {
    var hasHelmet: Bool
    
    init(speed: Double, hasHelmet: Bool) {
        self.hasHelmet = hasHelmet
        super.init(speed: speed, numberOfWheels: 2)
    }
}

let car = Car(brand: "Tesla", speed: 150)
car.describe()
car.honk()

let bike = Motorcycle(speed: 80, hasHelmet: true)
bike.describe()
```

### Final Classes

```swift
// Cannot be subclassed
final class DatabaseManager {
    static let shared = DatabaseManager()
    private init() {}
    
    func save() {
        print("Saving to database")
    }
}

// Error: Cannot inherit from final class
// class MyDatabase: DatabaseManager { }
```

## Protocols

Protocols define a blueprint of methods and properties:

```swift
protocol Drawable {
    func draw()
}

protocol Nameable {
    var name: String { get set }
}

// Struct conforming to protocol
struct Circle: Drawable {
    var radius: Double
    
    func draw() {
        print("Drawing circle with radius \(radius)")
    }
}

// Class conforming to multiple protocols
class Rectangle: Drawable, Nameable {
    var name: String
    var width: Double
    var height: Double
    
    init(name: String, width: Double, height: Double) {
        self.name = name
        self.width = width
        self.height = height
    }
    
    func draw() {
        print("Drawing \(name) rectangle")
    }
}

// Using protocols as types
let shapes: [Drawable] = [
    Circle(radius: 5),
    Rectangle(name: "Box", width: 10, height: 5)
]

for shape in shapes {
    shape.draw()
}
```

### Protocol Extensions

```swift
protocol Identifiable {
    var id: String { get }
}

extension Identifiable {
    // Default implementation
    func displayID() {
        print("ID: \(id)")
    }
}

struct User: Identifiable {
    let id: String
    let name: String
}

let user = User(id: "123", name: "Alice")
user.displayID()  // Uses default implementation
```

### Protocol Inheritance

```swift
protocol Vehicle {
    var speed: Double { get }
    func move()
}

protocol ElectricVehicle: Vehicle {
    var batteryLevel: Double { get }
    func charge()
}

struct Tesla: ElectricVehicle {
    var speed: Double
    var batteryLevel: Double
    
    func move() {
        print("Moving at \(speed) km/h")
    }
    
    func charge() {
        print("Charging battery")
    }
}
```

:::compare-android
Kotlin interfaces:
```kotlin
interface Drawable {
    fun draw()
}

class Circle : Drawable {
    override fun draw() {
        println("Drawing circle")
    }
}

// Interface with default implementation
interface Identifiable {
    val id: String
    fun displayID() {
        println("ID: $id")
    }
}
```
Swift protocols and Kotlin interfaces are very similar.
:::

## Extensions

Add functionality to existing types:

```swift
// Extend built-in types
extension String {
    var isEmail: Bool {
        return self.contains("@") && self.contains(".")
    }
    
    func reversed() -> String {
        return String(self.reversed())
    }
}

"hello@example.com".isEmail  // true
"hello".reversed()            // "olleh"

// Extend your own types
struct User {
    var name: String
    var age: Int
}

extension User {
    var isAdult: Bool {
        return age >= 18
    }
    
    func greet() {
        print("Hello, I'm \(name)")
    }
}

let user = User(name: "Alice", age: 25)
print(user.isAdult)
user.greet()

// Add protocol conformance via extension
extension User: CustomStringConvertible {
    var description: String {
        return "\(name), \(age) years old"
    }
}

print(user)  // Alice, 25 years old
```

## Enums

Powerful data types in Swift:

```swift
// Basic enum
enum Direction {
    case north
    case south
    case east
    case west
}

let direction = Direction.north

// Switch with enums (exhaustive)
switch direction {
case .north: print("Going north")
case .south: print("Going south")
case .east: print("Going east")
case .west: print("Going west")
}

// Enum with raw values
enum StatusCode: Int {
    case success = 200
    case notFound = 404
    case serverError = 500
}

let status = StatusCode(rawValue: 404)  // Optional

// Enum with associated values
enum Result {
    case success(data: String)
    case failure(error: String)
}

func processResult(_ result: Result) {
    switch result {
    case .success(let data):
        print("Success: \(data)")
    case .failure(let error):
        print("Error: \(error)")
    }
}

processResult(.success(data: "User loaded"))
processResult(.failure(error: "Network error"))

// Complex example
enum NetworkResponse {
    case success(data: Data, statusCode: Int)
    case failure(error: Error)
    case loading
    
    var isLoading: Bool {
        if case .loading = self {
            return true
        }
        return false
    }
}
```

## Practical Example: E-Commerce System

```swift
// Product protocol
protocol Product {
    var id: String { get }
    var name: String { get }
    var price: Double { get }
    var description: String? { get }
}

// Product types
struct PhysicalProduct: Product {
    let id: String
    let name: String
    let price: Double
    let description: String?
    let weight: Double
    let shippingCost: Double
    
    var totalCost: Double {
        return price + shippingCost
    }
}

struct DigitalProduct: Product {
    let id: String
    let name: String
    let price: Double
    let description: String?
    let downloadURL: String
    let fileSize: Int  // in MB
}

// Shopping cart
class ShoppingCart {
    private(set) var items: [CartItem] = []
    
    struct CartItem {
        let product: Product
        var quantity: Int
    }
    
    func addProduct(_ product: Product, quantity: Int = 1) {
        if let index = items.firstIndex(where: { $0.product.id == product.id }) {
            items[index].quantity += quantity
        } else {
            items.append(CartItem(product: product, quantity: quantity))
        }
    }
    
    func removeProduct(id: String) {
        items.removeAll { $0.product.id == id }
    }
    
    func updateQuantity(id: String, quantity: Int) {
        if let index = items.firstIndex(where: { $0.product.id == id }) {
            if quantity <= 0 {
                items.remove(at: index)
            } else {
                items[index].quantity = quantity
            }
        }
    }
    
    var subtotal: Double {
        return items.reduce(0) { $0 + ($1.product.price * Double($1.quantity)) }
    }
    
    var shippingCost: Double {
        return items.reduce(0) { total, item in
            if let physical = item.product as? PhysicalProduct {
                return total + physical.shippingCost
            }
            return total
        }
    }
    
    var total: Double {
        return subtotal + shippingCost
    }
    
    func clear() {
        items.removeAll()
    }
}

// Usage
let cart = ShoppingCart()

let laptop = PhysicalProduct(
    id: "1",
    name: "MacBook Pro",
    price: 1999.99,
    description: "Powerful laptop",
    weight: 2.0,
    shippingCost: 15.0
)

let app = DigitalProduct(
    id: "2",
    name: "Photo Editor",
    price: 29.99,
    description: "Professional photo editing",
    downloadURL: "https://example.com/download",
    fileSize: 150
)

cart.addProduct(laptop, quantity: 1)
cart.addProduct(app, quantity: 2)

print("Subtotal: $\(cart.subtotal)")
print("Shipping: $\(cart.shippingCost)")
print("Total: $\(cart.total)")
```

## Access Control

```swift
// public: Accessible from anywhere
public class PublicClass {
    public var publicProperty = "Public"
    public func publicMethod() {}
}

// internal: Accessible within the same module (default)
class InternalClass {
    var internalProperty = "Internal"
    func internalMethod() {}
}

// fileprivate: Accessible within the same file
fileprivate class FilePrivateClass {
    fileprivate var property = "File Private"
}

// private: Accessible only within the enclosing declaration
class MyClass {
    private var secret = "Private"
    
    func revealSecret() -> String {
        return secret  // OK, within same class
    }
}

let obj = MyClass()
// obj.secret  // Error: 'secret' is inaccessible
```

## Key Takeaways

✅ **Structs** for value types, **Classes** for reference types  
✅ **Protocols** define contracts for functionality  
✅ **Extensions** add functionality to existing types  
✅ **Enums** with associated values are powerful  
✅ **Properties** can be stored, computed, or lazy  
✅ **Inheritance** creates class hierarchies  
✅ **Access control** protects implementation details  

## Practice Exercise

Create a library management system with:
1. Protocol for `Borrowable` items
2. Struct for `Book` and `Magazine`
3. Class for `Library` with inventory
4. Enum for `ItemStatus` (available, borrowed, reserved)
5. Extensions for formatting and utilities
6. Proper access control

## Next Steps

Next, we'll explore advanced Swift features including generics, protocol-oriented programming, and error handling!

---

**Resources:**
- [Swift Classes and Structures](https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html)
- [Swift Protocols](https://docs.swift.org/swift-book/LanguageGuide/Protocols.html)
- [Swift Enumerations](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html)