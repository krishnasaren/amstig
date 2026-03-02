const decorator = {
    id: 'decorator',
    title: 'Decorator in Exinix',
    content: `
    
    
# 🔥 PYTHON DECORATORS
## 0️⃣ ONE RULE THAT EXPLAINS EVERYTHING

A decorator is just a function call that happens at definition time.
Whatever the decorator RETURNS replaces the original name.

Python literally does this:

\`\`\`exinix
@decorator
def f(): ...
\`\`\`


⬇️ becomes ⬇️

\`\`\`exinix
f = decorator(f)
\`\`\`


That’s it.
No extra rules. No hidden behavior.

## 1️⃣ SIMPLE FUNCTION DECORATOR (NO PARAMS)
\`\`\`exinix
def deco(func):
    print("decorator executed")
    return func

@deco
def hello():
    print("hello")

hello()
\`\`\`

### Execution order

- \`deco(hello)\` runs once (definition time)

- \`hello()\` runs later (call time)

### Output
\`\`\`
decorator executed
hello
\`\`\`

### Rules learned

- Decorator runs once
- Function runs only when called
- Returning func keeps it unchanged

## 2️⃣ FUNCTION DECORATOR THAT MODIFIES BEHAVIOR (WRAPPER)
\`\`\`exinix
def deco(func):
    def wrapper():
        print("before")
        func()
        print("after")
    return wrapper

@deco
def hi():
    print("hi")

hi()
\`\`\`

### Output
\`\`\`
before
hi
after
\`\`\`

### Rules

- \`hi\` is replaced by \`wrapper\`

- Original function exists only if wrapper calls it

- If wrapper doesn’t call \`func()\`, original is dead

## 3️⃣ DECORATOR THAT DOES NOT RETURN FUNCTION 
\`\`\`exinix
def deco(func):
    print("registered")
    # no return

@deco
def test():
    print("test")

print(test)
\`\`\`

### Output

\`\`\`exinix
registered
None
\`\`\`

### Rule

-  If decorator returns nothing → function name becomes None act like variable funcname = None

## 4️⃣ FUNCTION DECORATOR WITH PARAMETERS
### Structure
\`\`\`exinix
def deco(param):
    def real_decorator(func):
        def wrapper(*args, **kwargs):
            ...
        return wrapper
    return real_decorator
\`\`\`

Example
\`\`\`exinix
def repeat(n):
    def decorator(func):
        def wrapper():
            for _ in range(n):
                func()
        return wrapper
    return decorator

@repeat(3)
def hello():
    print("hello")

hello()
\`\`\`

### Output
\`\`\`exinix
hello
hello
hello
\`\`\`

### Rule

- Extra layer exists only to receive arguments

- Still: return value replaces function

## 5️⃣ DECORATOR WITH ARGUMENTS + FUNCTION ARGUMENTS
\`\`\`exinix
def check_positive(msg):
    def decorator(func):
        def wrapper(x):
            if x > 0:
                return func(x)
            return msg
        return wrapper
    return decorator

@check_positive("negative")
def show(x):
    return f"value {x}"

print(show(10))
print(show(-5))
\`\`\`

### Output
\`\`\`exinix
value 10
negative
\`\`\`

## 6️⃣ CLASS DECORATOR (YES, CLASSES TOO)
\`\`\`exinix
def deco(cls):
    cls.tag = "decorated"
    return cls

@deco
class A:
    pass

print(A.tag)
\`\`\`

### Output
\`\`\`exinix
decorated
\`\`\`

### Rule

- Class decorators work exactly like function decorators

- \`A = deco(A)\`

## 7️⃣ CLASS DECORATOR THAT REPLACES CLASS
\`\`\`exinix
def deco(cls):
    class New:
        def run(self):
            print("new class")
    return New

@deco
class A:
    def run(self):
        print("old class")

A().run()
\`\`\`

### Output
\`\`\`exinix
new class
\`\`\`

### Rule

- Returning a new class completely destroys the old one

## 8️⃣ DECORATOR USING A CLASS \` (__call__)\`
\`\`\`exinix
class Deco:
    def __init__(self, func):
        self.func = func

    def __call__(self):
        print("before")
        self.func()
        print("after")

@Deco
def hello():
    print("hello")

hello()
\`\`\`

### Output
\`\`\`exinix
before
hello
after
\`\`\`

### Rule

- Class decorators work because \`__call__\` exists

- \`hello = Deco(hello)\`

## 9️⃣ CLASS DECORATOR WITH PARAMETERS
\`\`\`exinix
class Repeat:
    def __init__(self, n):
        self.n = n

    def __call__(self, func):
        def wrapper():
            for _ in range(self.n):
                func()
        return wrapper

@Repeat(2)
def hi():
    print("hi")

hi()
\`\`\`

### Output
\`\`\`exinix
hi
hi
\`\`\`

## 🔟 FLASK STYLE DECORATOR (REGISTER ONLY)
\`\`\`exinix
routes = {}

def route(path):
    def decorator(func):
        routes[path] = func
        return func
    return decorator

@route("/")
def home():
    return "HOME"

print(home())
print(routes["/"]())
\`\`\`

### Output
\`\`\`exinix
HOME
HOME
\`\`\`

### Rule

- Function is registered, not wrapped
- Execution happens later (inversion of control)

### 1️⃣1️⃣ WHAT DECORATORS CAN DO (SUMMARY)
|Capability|Allowed|
|Modify behavior|✅|
|Register callbacks|✅|
|Replace function|✅|
|Destroy function|✅ (bad)|
|Add metadata|✅|
|Enforce access control|✅|
|Break code|✅ (if careless)|

### 1️⃣2️⃣ GOLDEN RULES (MEMORIZE THESE)

- Only the return value replaces the function
- Side effects do NOT replace the function
- If original function is not called, it never runs
- Decorator runs once, function runs many times
- Decorator arguments require extra layer

### 1️⃣3️⃣ WHY DECORATORS EXIST (REAL REASON)

#### Decorators exist to support:

- logging
- auth
- caching
- routing
- validation
- instrumentation
- inversion of control
- Without touching original logic.

### 1️⃣4️⃣ FINAL TRUTH (NO CONFUSION LEFT)

- A decorator is NOT magic
- A decorator is NOT syntax sugar only
- A decorator is a controlled function replacement mechanism

## Some Other Concept  
### 1️⃣ \`functools.wraps\` (metadata preservation) ⭐ IMPORTANT

- Problem
    - Wrapper destroys metadata:

\`\`\`exinix
def deco(func):
    def wrapper():
        pass
    return wrapper

@deco
def f():
    pass

print(f.__name__)
\`\`\`

### Output
\`\`\`exinix
wrapper
\`\`\`

Original identity is lost.

### Solution
\`\`\`exinix
from functools import wraps

def deco(func):
    @wraps(func)
    def wrapper():
        pass
    return wrapper

\`\`\`

### Why it matters

- debugging
- Flask routing
- introspection
- decorators stacking

### 2️⃣ Multiple decorators (ORDER MATTERS)
\`\`\`exinix
def A(func):
    def w():
        print("A")
        func()
    return w

def B(func):
    def w():
        print("B")
        func()
    return w

@A
@B
def f():
    print("F")

f()
\`\`\`

### Output
\`\`\`exinix
A
B
F
\`\`\`

### Rule

- Decorators apply bottom-up, execute top-down.

Equivalent to:

\`f = A(B(f))\`

### 3️⃣ Decorators on methods (instance methods)
\`\`\`exinix
def deco(func):
    def wrapper(self):
        print("before")
        func(self)
    return wrapper

class A:
    @deco
    def run(self):
        print("run")

A().run()
\`\`\`

### Output
\`\`\`exinix
before
run
\`\`\`

### Key point

- self is just a normal parameter
- decorators don’t care about classes

### 4️⃣ Staticmethod & classmethod decorators
#### Order matters
\`\`\`exinix
class A:
    @staticmethod
    @deco
    def f():
        ...


≠

class A:
    @deco
    @staticmethod
    def f():
        ...

\`\`\`

- ⚠️ This causes real bugs if misunderstood.

### 5️⃣ Decorator stacking with arguments (brain-melter)
\`\`\`exinix
@A(1)
@B(2)
@C(3)
def f(): ...

\`\`\`

Equivalent to:

\`f = A(1)(B(2)(C(3)(f)))\`

If you can read that, you fully master decorators.

### 6️⃣ Decorators vs inheritance (you touched this, but final clarity)
|Feature|Decorator|Inheritance|
|Runtime|✅|❌|
|Dynamic|✅|❌|
|Replace behavior|✅|⚠️|
|Structural change|❌|✅|
|Multiple stacking|✅|❌|

Decorators = behavior injection
Inheritance = type extension

### 7️⃣ Decorators for type checking / contracts

Example:
\`\`\`exinix
def typesafe(func):
    def wrapper(x: int):
        if not isinstance(x, int):
            raise TypeError
        return func(x)
    return wrapper

\`\`\`
This is how you’d build compiler-like guarantees in Python.

### 8️⃣ When NOT to use decorators (very important)

#### ❌ Avoid decorators when:

- logic is complex
- readability suffers
- debugging becomes hard
- order matters too much

#### Use them for:

- cross-cutting concerns
- registration
- validation
- caching
- auth
- logging

## 9️⃣ Python built-in decorators you should know
|Decorator|Purpose|
|\`@property\`|computed attributes|
|\`@staticmethod\`|no instance|
|\`@classmethod\`|class-level|
|\`@dataclass\`|auto codegen|
|\`@lru_cache\`|caching|
|\`@singledispatch\`|function overloading|


 `,
    codeExample: `



`,
    codeExampleLang:'exinix'
};

export default decorator;