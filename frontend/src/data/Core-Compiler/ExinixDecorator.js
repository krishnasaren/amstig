const exinixDecorator = {
    id: 'exinixDecorator',
    title: 'Decorator of Exinix',
    content: `
    
# 🧩 Syntax Overview (Clean & Unique)
Instead of \`@\`, you use:
\`\`\`exinix
use ModifierName
use ModifierName(args...)
\`\`\`

### Why?

Reads like English
No symbol noise
Clear intent

## 1️⃣ Method Modifier (NO PARAMETERS)
### Usage
\`\`\`exinix
class User {

    use log
    fn login(name: string) -> void {
        print("User logged in: " + name)
    }

}

Definition
modifier log(method fn) -> fn {
    return fn(args...) {
        print("[LOG] calling " + method.name)
        return method(args...)
    }
}
\`\`\`

### What compiler does (conceptually)

\`User.login = log(User.login)\`

### Output at runtime
\`\`\`exinix
[LOG] calling login
User logged in: Krish
\`\`\`

## 2️⃣ Method Modifier (WITH PARAMETERS)
### Usage
\`\`\`exinix
class User {

    use requireRole("admin")
    fn deleteUser(id: int) -> void {
        print("Deleted user " + id)
    }

}

Definition
modifier requireRole(role: string) -> modifier {
    return modifier(method fn) -> fn {
        return fn(args...) {
            if currentUser.role != role {
                panic("Access denied")
            }
            return method(args...)
        }
    }
}
\`\`\`

### Why this is simple

- First layer → receives modifier parameters
- Second layer → receives method
- Compiler enforces correct return types

## 3️⃣ Class Modifier (NO PARAMETERS)
### Usage
\`\`\`exinix
use entity
class User {
    let id: int
    let name: string
}

Definition
modifier entity(cls class) -> class {
    cls.meta["entity"] = true
    return cls
}
\`\`\`

### Result

- No behavior change
- Metadata attached
- Used by ORM / compiler / runtime

## 4️⃣ Class Modifier (WITH PARAMETERS)
### Usage
\`\`\`exinix
use entity(table = "users")
class User {
    let id: int
    let name: string
}

Definition
modifier entity(table: string) -> modifier {
    return modifier(cls class) -> class {
        cls.meta["table"] = table
        return cls
    }
}
\`\`\`

## 5️⃣ Method Modifier That REPLACES Logic (Advanced but Safe)
### Usage
\`\`\`exinix
class Math {

    use timed
    fn add(a: int, b: int) -> int {
        return a + b
    }

}

Definition
modifier timed(method fn) -> fn {
    return fn(args...) {
        let start = clock.now()
        let result = method(args...)
        let end = clock.now()
        print("Time:", end - start)
        return result
    }
}
\`\`\`

## 6️⃣ Compiler Errors (VERY IMPORTANT)
❌ Illegal: No return
\`\`\`exinix
modifier bad(method fn) {
    print("oops")
}
\`\`\`

### Compile error:

- Modifier must return fn, but returned nothing

### ❌ Illegal: Wrong return type
\`\`\`exinix
modifier wrong(method fn) -> class {
    return SomeClass
}

\`\`\`
### Compile error:

- Modifier for method must return fn, not class

## 7️⃣ Why This Design is GOOD

- ✔ No confusion like Python
- ✔ No runtime surprises
- ✔ No implicit behavior
- ✔ No decorator stacking chaos
- ✔ Easy to parse
- ✔ Easy to reason about
- ✔ Strong static typing
- ✔ Looks clean and modern

## 🧠 Mental Model (One Line – Perfect)

A modifier is a typed transformation applied at definition time.
It must return what it transforms.

## 🧬 Comparison (Why yours is better)
|Feature|Python|Java|Your Language|
|Return enforced|❌|❌|✅|
|Type safety|❌|⚠️|✅|
|Runtime magic|✅|❌|❌|
|Readability|⚠️|⚠️|✅|
|Power|✅|⚠️|✅|



 `,
    codeExample: `



`,
    codeExampleLang:'exinix'
};

export default exinixDecorator;