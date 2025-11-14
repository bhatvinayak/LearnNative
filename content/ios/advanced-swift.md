---
title: Advanced Swift Features
description: Master generics, protocol-oriented programming, error handling, and memory management in Swift
platform: ios
order: 8
---

# Advanced Swift Features

Swift's advanced features enable you to write flexible, reusable, and safe code. Let's explore generics, protocol-oriented programming, error handling, and memory management.

## Generics

Generics let you write flexible, reusable functions and types:

### Generic Functions

```swift
// Non-generic (type-specific)
func swapInts(_ a: inout Int, _ b: inout Int) {
    let temp = a
    a = b
    b = temp
}

// Generic (works with any type)
func swap<T>(_ a: inout T, _ b: inout T) {
    let temp = a
    a = b
    b = temp
}

var x = 5, y = 10
swap(&x, &y)  // Works with Int

var name1 = "Alice", name2 = "Bob"
swap(&name1, &name2)  // Works with String

// Generic function with constraint
func findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}

let index = findIndex(of: "Bob", in: ["Alice", "Bob", "Charlie"])
```

### Generic Types

```swift
struct Stack<Element> {
    private var items: [Element] = []
    
    mutating func push(_ item: Element) {
        items.append(item)
    }
    
    mutating func pop() -> Element? {
        return items.isEmpty ? nil : items.removeLast()
    }
    
    func peek() -> Element? {
        return items.last
    }
    
    var count: Int {
        return items.count
    }
    
    var isEmpty: Bool {
        return items.isEmpty
    }
}

// Usage with Int
var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
print(intStack.pop())  // Optional(2)

// Usage with String
var stringStack = Stack<String>()
stringStack.push("Hello")
stringStack.push("World")
```

### Generic Constraints

```swift
// Constraint: T must conform to Comparable
func findLargest<T: Comparable>(_ array: [T]) -> T? {
    guard !array.isEmpty else { return nil }
    
    var largest = array[0]
    for item in array {
        if item > largest {
            largest = item
        }
    }
    return largest
}

print(findLargest([3, 7, 2, 9, 1]))  // Optional(9)
print(findLargest(["apple", "zebra", "banana"]))  // Optional("zebra")

// Multiple constraints
func processItems<T, U>(_ items: [T], transformer: (T) -> U) -> [U] 
    where T: CustomStringConvertible, U: Numeric {
    return items.map { transformer($0) }
}
```

:::compare-android
Kotlin generics:
```kotlin
class Stack<T> {
    private val items = mutableListOf<T>()
    
    fun push(item: T) {
        items.add(item)
    }
    
    fun pop(): T? {
        return if (items.isEmpty()) null else items.removeLast()
    }
}

// Generic function with constraint
fun <T : Comparable<T>> findLargest(array: List<T>): T? {
    return array.maxOrNull()
}
```
Swift and Kotlin have very similar generic systems.
:::

## Associated Types in Protocols

```swift
protocol Container {
    associatedtype Item
    
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}

struct IntStack: Container {
    // Define the associated type
    typealias Item = Int
    
    private var items: [Int] = []
    
    mutating func append(_ item: Int) {
        items.append(item)
    }
    
    var count: Int {
        return items.count
    }
    
    subscript(i: Int) -> Int {
        return items[i]
    }
}

// Generic type conforming to protocol
struct GenericStack<Element>: Container {
    private var items: [Element] = []
    
    mutating func append(_ item: Element) {
        items.append(item)
    }
    
    var count: Int {
        return items.count
    }
    
    subscript(i: Int) -> Element {
        return items[i]
    }
}
```

## Protocol-Oriented Programming

Swift favors protocols over inheritance:

```swift
// Protocol with requirements
protocol Drawable {
    func draw()
}

protocol Moveable {
    var position: CGPoint { get set }
    mutating func move(to point: CGPoint)
}

// Protocol composition
typealias GameObject = Drawable & Moveable

// Implementation
struct Player: GameObject {
    var position: CGPoint
    var name: String
    
    func draw() {
        print("Drawing player at \(position)")
    }
    
    mutating func move(to point: CGPoint) {
        position = point
    }
}

// Protocol extension with default implementation
extension Moveable {
    mutating func moveBy(dx: CGFloat, dy: CGFloat) {
        let newX = position.x + dx
        let newY = position.y + dy
        move(to: CGPoint(x: newX, y: newY))
    }
}

var player = Player(position: .zero, name: "Hero")
player.moveBy(dx: 10, dy: 20)  // Uses default implementation
```

### Protocol Extensions with Constraints

```swift
extension Collection where Element: Numeric {
    func sum() -> Element {
        return reduce(0, +)
    }
    
    func average() -> Double {
        guard !isEmpty else { return 0 }
        let total = Double(truncating: sum() as! NSNumber)
        return total / Double(count)
    }
}

let numbers = [1, 2, 3, 4, 5]
print(numbers.sum())      // 15
print(numbers.average())  // 3.0

// Only available for Numeric collections
let strings = ["a", "b", "c"]
// strings.sum()  // Error: not Numeric
```

## Error Handling

Swift uses a comprehensive error handling system:

### Defining Errors

```swift
enum NetworkError: Error {
    case invalidURL
    case noConnection
    case timeout
    case serverError(statusCode: Int)
    case decodingError(String)
}

enum ValidationError: Error {
    case emptyField(fieldName: String)
    case invalidFormat(fieldName: String, expected: String)
    case outOfRange(fieldName: String, min: Int, max: Int)
}
```

### Throwing Functions

```swift
func fetchUser(id: Int) throws -> User {
    guard id > 0 else {
        throw ValidationError.outOfRange(fieldName: "id", min: 1, max: Int.max)
    }
    
    // Simulate network call
    guard isConnected else {
        throw NetworkError.noConnection
    }
    
    // Return user
    return User(id: id, name: "User \(id)")
}

// Calling throwing functions
do {
    let user = try fetchUser(id: 123)
    print("Fetched: \(user.name)")
} catch NetworkError.noConnection {
    print("No internet connection")
} catch NetworkError.serverError(let code) {
    print("Server error: \(code)")
} catch ValidationError.outOfRange(let field, let min, let max) {
    print("\(field) must be between \(min) and \(max)")
} catch {
    print("Unknown error: \(error)")
}
```

### Try Variants

```swift
// try - requires do-catch
do {
    let user = try fetchUser(id: 123)
    print(user)
} catch {
    print(error)
}

// try? - converts to optional
let user = try? fetchUser(id: 123)  // Optional<User>
if let user = user {
    print("Success: \(user)")
} else {
    print("Failed")
}

// try! - force unwrap (crashes on error)
let user = try! fetchUser(id: 123)  // Use only when certain it won't throw
```

### Rethrowing Functions

```swift
func processItems<T>(_ items: [T], processor: (T) throws -> Void) rethrows {
    for item in items {
        try processor(item)
    }
}

// Usage
let numbers = [1, 2, 3, 4, 5]

// This doesn't throw
processItems(numbers) { number in
    print(number)
}

// This might throw
try processItems(numbers) { number in
    if number > 3 {
        throw ValidationError.outOfRange(fieldName: "number", min: 0, max: 3)
    }
    print(number)
}
```

### Result Type

```swift
func loadUser(id: Int) -> Result<User, Error> {
    guard id > 0 else {
        return .failure(ValidationError.outOfRange(
            fieldName: "id",
            min: 1,
            max: Int.max
        ))
    }
    
    let user = User(id: id, name: "User \(id)")
    return .success(user)
}

// Usage
let result = loadUser(id: 123)

switch result {
case .success(let user):
    print("Loaded: \(user.name)")
case .failure(let error):
    print("Error: \(error)")
}

// Or use get()
do {
    let user = try result.get()
    print(user)
} catch {
    print(error)
}
```

## Memory Management (ARC)

Swift uses Automatic Reference Counting:

### Strong References

```swift
class Person {
    let name: String
    var apartment: Apartment?
    
    init(name: String) {
        self.name = name
    }
    
    deinit {
        print("\(name) is being deinitialized")
    }
}

class Apartment {
    let unit: String
    var tenant: Person?
    
    init(unit: String) {
        self.unit = unit
    }
    
    deinit {
        print("Apartment \(unit) is being deinitialized")
    }
}

var john: Person? = Person(name: "John")
var unit4A: Apartment? = Apartment(unit: "4A")

john?.apartment = unit4A
unit4A?.tenant = john

// Strong reference cycle - neither will be deallocated
john = nil
unit4A = nil
// Nothing prints - memory leak!
```

### Weak References

```swift
class Person {
    let name: String
    var apartment: Apartment?
    
    init(name: String) {
        self.name = name
    }
    
    deinit {
        print("\(name) is being deinitialized")
    }
}

class Apartment {
    let unit: String
    weak var tenant: Person?  // weak to break the cycle
    
    init(unit: String) {
        self.unit = unit
    }
    
    deinit {
        print("Apartment \(unit) is being deinitialized")
    }
}

var john: Person? = Person(name: "John")
var unit4A: Apartment? = Apartment(unit: "4A")

john?.apartment = unit4A
unit4A?.tenant = john

john = nil
// Prints: John is being deinitialized

unit4A = nil
// Prints: Apartment 4A is being deinitialized
```

### Unowned References

```swift
class Customer {
    let name: String
    var card: CreditCard?
    
    init(name: String) {
        self.name = name
    }
    
    deinit {
        print("\(name) is being deinitialized")
    }
}

class CreditCard {
    let number: UInt64
    unowned let customer: Customer  // unowned - customer always exists
    
    init(number: UInt64, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    
    deinit {
        print("Card #\(number) is being deinitialized")
    }
}

var john: Customer? = Customer(name: "John")
john?.card = CreditCard(number: 1234_5678_9012_3456, customer: john!)

john = nil
// Prints both deinit messages
```

### Closure Capture Lists

```swift
class ViewController {
    var name = "ViewController"
    var closure: (() -> Void)?
    
    func setupClosure() {
        // Strong reference cycle
        closure = {
            print(self.name)  // Captures self strongly
        }
        
        // Fix with capture list
        closure = { [weak self] in
            guard let self = self else { return }
            print(self.name)
        }
        
        // Or with unowned
        closure = { [unowned self] in
            print(self.name)
        }
    }
    
    deinit {
        print("ViewController deinitialized")
    }
}
```

:::compare-android
Kotlin memory management:
```kotlin
// Kotlin uses garbage collection, not ARC
class Person(val name: String) {
    var apartment: Apartment? = null
    
    protected fun finalize() {
        println("$name is being collected")
    }
}

// No need for weak/unowned references
// GC handles cycles automatically (but less predictably)
```
Swift's ARC is more predictable than garbage collection but requires understanding reference cycles.
:::

## Opaque Types

```swift
protocol Shape {
    func draw() -> String
}

struct Circle: Shape {
    func draw() -> String {
        return "○"
    }
}

struct Square: Shape {
    func draw() -> String {
        return "□"
    }
}

// Opaque return type
func makeShape() -> some Shape {
    return Circle()  // Specific type hidden
}

let shape = makeShape()
print(shape.draw())

// Generic return
func makeContainer<T: Shape>() -> T {
    // Must specify exact type
    return Circle() as! T
}
```

## Property Wrappers

```swift
@propertyWrapper
struct Clamped<Value: Comparable> {
    private var value: Value
    private let range: ClosedRange<Value>
    
    var wrappedValue: Value {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }
    
    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct Game {
    @Clamped(0...100) var health = 100
    @Clamped(0...10) var level = 1
}

var game = Game()
game.health = 150  // Clamped to 100
game.health = -10  // Clamped to 0
print(game.health)  // 0

// Built-in property wrappers in SwiftUI
struct ContentView: View {
    @State private var counter = 0
    @Binding var isOn: Bool
    @ObservedObject var viewModel: ViewModel
}
```

## Practical Example: Network Layer

```swift
// Error types
enum NetworkError: Error, LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(statusCode: Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        case .decodingError(let error):
            return "Decoding failed: \(error.localizedDescription)"
        case .serverError(let code):
            return "Server error: \(code)"
        }
    }
}

// Generic network service
class NetworkService {
    static let shared = NetworkService()
    private init() {}
    
    func fetch<T: Decodable>(
        from urlString: String,
        completion: @escaping (Result<T, NetworkError>) -> Void
    ) {
        guard let url = URL(string: urlString) else {
            completion(.failure(.invalidURL))
            return
        }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self else { return }
            
            if let error = error {
                completion(.failure(.serverError(statusCode: -1)))
                return
            }
            
            guard let data = data else {
                completion(.failure(.noData))
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse,
               !(200...299).contains(httpResponse.statusCode) {
                completion(.failure(.serverError(statusCode: httpResponse.statusCode)))
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(T.self, from: data)
                completion(.success(decoded))
            } catch {
                completion(.failure(.decodingError(error)))
            }
        }.resume()
    }
    
    // Async/await version
    func fetch<T: Decodable>(from urlString: String) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw NetworkError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.serverError(
                statusCode: (response as? HTTPURLResponse)?.statusCode ?? -1
            )
        }
        
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw NetworkError.decodingError(error)
        }
    }
}

// Usage
struct User: Codable {
    let id: Int
    let name: String
    let email: String
}

// Callback version
NetworkService.shared.fetch(from: "https://api.example.com/users/1") { 
    (result: Result<User, NetworkError>) in
    switch result {
    case .success(let user):
        print("User: \(user.name)")
    case .failure(let error):
        print("Error: \(error.localizedDescription)")
    }
}

// Async/await version
Task {
    do {
        let user: User = try await NetworkService.shared.fetch(
            from: "https://api.example.com/users/1"
        )
        print("User: \(user.name)")
    } catch {
        print("Error: \(error.localizedDescription)")
    }
}
```

## Key Takeaways

✅ **Generics** enable reusable, type-safe code  
✅ **Protocol-oriented programming** favors composition over inheritance  
✅ **Error handling** with do-try-catch is comprehensive  
✅ **Result type** provides functional error handling  
✅ **ARC** manages memory automatically with reference counting  
✅ **Weak/unowned** references prevent memory leaks  
✅ **Property wrappers** reduce boilerplate code  
✅ **Associated types** make protocols more flexible  

## Best Practices

1. **Use generics** for reusable algorithms
2. **Prefer protocols** over class inheritance
3. **Always handle errors** explicitly
4. **Use weak self** in closures capturing self
5. **Leverage property wrappers** for common patterns
6. **Test memory leaks** with Instruments
7. **Use Result type** for asynchronous error handling

## Practice Exercise

Create a generic data repository with:
1. Generic CRUD operations
2. Error handling for all operations
3. Protocol-based architecture
4. Proper memory management
5. Result type for async operations
6. Property wrappers for validation

## Next Steps

With Swift fundamentals mastered, we're ready to build user interfaces with SwiftUI!

---

**Resources:**
- [Swift Generics](https://docs.swift.org/swift-book/LanguageGuide/Generics.html)
- [Protocol-Oriented Programming](https://developer.apple.com/videos/play/wwdc2015/408/)
- [Automatic Reference Counting](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html)