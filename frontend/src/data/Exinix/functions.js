const functions = {
    id : "functions",
    title: "Functions",
    content:`
# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks. They're fundamental building blocks of JavaScript programs.

## Function Declaration

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}
\`\`\`

## Function Expression

\`\`\`javascript
const greet = function(name) {
    return "Hello, " + name + "!";
};
\`\`\`

## Arrow Functions (ES6)

\`\`\`javascript
const greet = (name) => {
    return "Hello, " + name + "!";
};

// Short form for single expressions
const greet = name => "Hello, " + name + "!";
\`\`\`

## Parameters and Arguments

Functions can accept multiple parameters:

\`\`\`javascript
function calculateArea(width, height) {
    return width * height;
}

let area = calculateArea(5, 10); // 50
\`\`\`

## Default Parameters

\`\`\`javascript
function greet(name = "World") {
    return "Hello, " + name + "!";
}

console.log(greet());        // "Hello, World!"
console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

## Return Values

Functions can return values using the \`return\` statement. If no return statement is used, the function returns \`undefined\`.

## Scope

Variables declared inside functions have local scope and can't be accessed from outside.
        `,
    codeExample : `// Function declaration
function add(a, b) {
    return a + b;
}

// Function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function
const divide = (a, b) => a / b;

// Function with default parameters
function greetUser(name = "Anonymous", title = "User") {
    return \`Hello \${title} \${name}!\`;
}

// Testing our functions
console.log("Addition:", add(10, 5));
console.log("Multiplication:", multiply(4, 3));  
console.log("Division:", divide(20, 4));
console.log("Greeting:", greetUser("Alice", "Developer"));
console.log("Default greeting:", greetUser());

// Higher-order function example
function applyOperation(a, b, operation) {
    return operation(a, b);
}

console.log("Using higher-order function:", applyOperation(8, 2, divide));`,
    codeExampleLang:'exinix'
};


export default functions;