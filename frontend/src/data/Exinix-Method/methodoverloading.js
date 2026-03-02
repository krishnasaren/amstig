const methodoverloading = {
    id : 'methodoverloading',
    title: 'Method Overloading',
    content : `
# Overloading

Method Overloading gives you the extra functionality to reuse the same function name with different methods parameter's type.

## Syntax
\`\`\`

fn method(a:int, b:int): str{
}

fn method(a:int, b:int): str{
    //cause error same method can't be
}

fn method(a:str, b:int): str{
//cause error same method can't be//allowed
}




\`\`\`

### Rules
- Method name can be same
- Method overloading depends on method name and paratemer count and types 
- Method overloading not depends on method return type

### Accepted 

- Method name can be same
- Eiter method parameters count or parameter types should be different.

### Not accepted
- Method name and same parameter types with same no(count) of parameter will not allowed
        `,
    codeExample : `// Python concepts demonstrated in JavaScript:

// Variable assignment (Python-style)
let name = "Alice";
let age = 30;
let height = 5.6;
let isStudent = true;

// Lists (arrays in JavaScript)
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];

// Dictionaries (objects in JavaScript)  
let person = {
  name: "Alice",
  age: 30,
  city: "New York",
  skills: ["Python", "JavaScript", "SQL"]
};

// String operations
let firstName = "John";
let lastName = "Doe"; 
let fullName = firstName + " " + lastName;
let greeting = \`Hello, \${fullName}!\`;

console.log("Name:", name);
console.log("Full name:", fullName);
console.log("Greeting:", greeting);
console.log("Person:", person);
console.log("Fruits:", fruits);
console.log("Numbers:", numbers);

// Type checking (JavaScript style)
console.log("\\nType checking:");
console.log("typeof name:", typeof name);
console.log("typeof age:", typeof age);
console.log("Array.isArray(fruits):", Array.isArray(fruits));`,
    codeExampleLang:'python'
};

export default methodoverloading;