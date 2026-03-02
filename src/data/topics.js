export const topics = [
    {
        id: 'javascript-basics',
        title: 'JavaScript Basics',
        icon: '🚀',
        description: 'Learn the fundamentals of JavaScript programming',
        subtopics: [
            {
                id: 'introduction',
                title: 'Introduction to JavaScript',
                content: `
# Introduction to JavaScript

JavaScript is a versatile, high-level programming language that's essential for modern web development. Originally created to make web pages interactive, JavaScript has evolved into a powerful language used for:

- **Frontend Development**: Creating interactive user interfaces
- **Backend Development**: Server-side applications with Node.js  
- **Mobile Apps**: Cross-platform mobile development
- **Desktop Apps**: Desktop applications with Electron

## Why Learn JavaScript?

JavaScript is one of the most popular programming languages in the world. It's:
- **Easy to learn**: Beginner-friendly syntax
- **Versatile**: Works everywhere - browsers, servers, mobile devices
- **In-demand**: Highly sought after by employers
- **Active community**: Large ecosystem of libraries and frameworks

## Your First JavaScript Program

Let's start with the classic "Hello, World!" program:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

This simple line of code outputs text to the console. Try running it in the code editor!

## Key Concepts We'll Cover

1. **Variables and Data Types**
2. **Functions**
3. **Control Structures** 
4. **Objects and Arrays**
5. **DOM Manipulation**
6. **Asynchronous Programming**

Ready to begin your JavaScript journey? Let's dive in!
        `,
                codeExample: 'console.log("Hello, World!");\nconsole.log("Welcome to JavaScript!");'
            },
            {
                id: 'variables',
                title: 'Variables & Data Types',
                content: `
# Variables & Data Types

Variables are containers that store data values. In JavaScript, you can declare variables using \`var\`, \`let\`, or \`const\`.

## Variable Declarations

\`\`\`javascript
let name = "Alice";          // String
const age = 25;              // Number  
let isStudent = true;        // Boolean
let hobbies = ["reading", "coding"]; // Array
\`\`\`

## Data Types

JavaScript has several built-in data types:

### Primitive Types
- **String**: Text data
- **Number**: Numeric data (integers and floats)
- **Boolean**: true or false
- **Undefined**: Variable declared but not assigned
- **Null**: Intentional absence of value

### Non-Primitive Types  
- **Object**: Complex data structures
- **Array**: Ordered list of items
- **Function**: Reusable code blocks

## Type Checking

Use the \`typeof\` operator to check variable types:

\`\`\`javascript
console.log(typeof "Hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
\`\`\`

## Best Practices

- Use \`const\` for values that won't change
- Use \`let\` for values that will change
- Avoid \`var\` in modern JavaScript
- Use descriptive variable names
        `,
                codeExample: `// Variable declarations
let userName = "JavaScript Learner";
const currentYear = 2024;
let isLearning = true;

// Arrays and objects
let skills = ["HTML", "CSS", "JavaScript"];
let person = {
  name: userName,
  age: 25,
  skills: skills
};

console.log("Name:", userName);
console.log("Year:", currentYear);
console.log("Learning:", isLearning);
console.log("Skills:", skills);
console.log("Person:", person);

// Type checking
console.log("Type of userName:", typeof userName);
console.log("Type of currentYear:", typeof currentYear);
console.log("Type of person:", typeof person);`
            },
            {
                id: 'functions',
                title: 'Functions',
                content: `
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
                codeExample: `// Function declaration
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

console.log("Using higher-order function:", applyOperation(8, 2, divide));`
            }
        ]
    },
    {
        id: 'python-basics',
        title: 'Python Fundamentals',
        icon: '🐍',
        description: 'Master Python programming from basics to advanced',
        subtopics: [
            {
                id: 'intro-python',
                title: 'Introduction to Python',
                content: `
# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. It's perfect for beginners and powerful enough for experts.

## Why Python?

- **Simple syntax**: Easy to read and write
- **Versatile**: Web development, data science, AI, automation
- **Large ecosystem**: Extensive libraries and frameworks
- **Cross-platform**: Runs on Windows, Mac, Linux
- **Great community**: Helpful and welcoming community

## Python Applications

- **Web Development**: Django, Flask
- **Data Science**: NumPy, Pandas, Matplotlib
- **Machine Learning**: TensorFlow, PyTorch, Scikit-learn
- **Automation**: Scripting and task automation
- **Desktop Apps**: Tkinter, PyQt

## Your First Python Program

\`\`\`python
print("Hello, World!")
print("Welcome to Python!")
\`\`\`

*Note: Python code execution is coming soon to this platform. Currently, you can practice with JavaScript in our code editor.*
        `,
                codeExample: `// Python syntax demonstration in JavaScript comments
/*
Python equivalent:
print("Hello, Python World!")
name = "Python Learner"
age = 25
print(f"My name is {name} and I'm {age} years old")
*/

// For now, let's simulate Python concepts in JavaScript:
console.log("Hello, Python World!");
let name = "Python Learner";
let age = 25;
console.log(\`My name is \${name} and I'm \${age} years old\`);

console.log("\\n--- Python Features ---");
console.log("✓ Simple and readable syntax");  
console.log("✓ Dynamic typing");
console.log("✓ Extensive standard library");
console.log("✓ Cross-platform compatibility");`
            },
            {
                id: 'python-variables',
                title: 'Python Variables & Data Types',
                content: `
# Python Variables & Data Types

Python variables are created when you first assign a value to them. No need to declare the type explicitly!

## Variable Assignment

\`\`\`python
name = "Alice"
age = 30
height = 5.6
is_student = True
\`\`\`

## Python Data Types

### Basic Types
- **int**: Integer numbers
- **float**: Decimal numbers  
- **str**: Text strings
- **bool**: True/False values
- **list**: Ordered collections
- **dict**: Key-value pairs
- **tuple**: Immutable sequences

## Dynamic Typing

Python automatically determines variable types:

\`\`\`python
x = 10        # int
x = "Hello"   # now str
x = [1,2,3]   # now list
\`\`\`

## String Operations

\`\`\`python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name

# f-strings (Python 3.6+)
greeting = f"Hello, {full_name}!"
\`\`\`

*Note: Full Python support coming soon!*
        `,
                codeExample: `// Python concepts demonstrated in JavaScript:

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
console.log("Array.isArray(fruits):", Array.isArray(fruits));`
            }
        ]
    },
    {
        id: 'web-development',
        title: 'Web Development',
        icon: '🌐',
        description: 'Build modern web applications',
        subtopics: [
            {
                id: 'html-basics',
                title: 'HTML Fundamentals',
                content: `
# HTML Fundamentals

HTML (HyperText Markup Language) is the foundation of all web pages. It provides structure and content to websites.

## What is HTML?

HTML uses **elements** (tags) to structure content:
- Elements are enclosed in angle brackets: \`<tagname>\`
- Most elements have opening and closing tags: \`<h1>Title</h1>\`
- Some elements are self-closing: \`<img />\`, \`<br />\`

## Basic HTML Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Title</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

## Common HTML Elements

- **Headings**: \`<h1>\` to \`<h6>\`
- **Paragraphs**: \`<p>\`
- **Links**: \`<a href="url">Link text</a>\`
- **Images**: \`<img src="image.jpg" alt="Description">\`
- **Lists**: \`<ul>\`, \`<ol>\`, \`<li>\`
- **Divisions**: \`<div>\`, \`<span>\`

## Semantic HTML

Use semantic elements for better structure:
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`
- \`<article>\`, \`<section>\`, \`<aside>\`

These elements make your HTML more accessible and SEO-friendly!
        `,
                codeExample: `// Let's create HTML structure using JavaScript DOM manipulation:

// Create a virtual HTML document structure
const htmlStructure = {
  doctype: "<!DOCTYPE html>",
  html: {
    lang: "en",
    head: {
      charset: "UTF-8",
      title: "My First Webpage"
    },
    body: {
      header: "Welcome to Web Development!",
      nav: ["Home", "About", "Contact"],
      main: {
        article: "Learning HTML is fun and essential for web development.",
        section: "HTML provides structure to web content"
      },
      footer: "© 2024 Web Learning Platform"
    }
  }
};

// Simulate HTML rendering
console.log("=== HTML Document Structure ===");
console.log(htmlStructure.doctype);
console.log(\`<html lang="\${htmlStructure.html.lang}">\`);
console.log("  <head>");
console.log(\`    <meta charset="\${htmlStructure.html.head.charset}">\`);
console.log(\`    <title>\${htmlStructure.html.head.title}</title>\`);
console.log("  </head>");
console.log("  <body>");
console.log(\`    <header><h1>\${htmlStructure.html.body.header}</h1></header>\`);
console.log("    <nav>");
htmlStructure.html.body.nav.forEach(item => {
  console.log(\`      <a href="#">\${item}</a>\`);
});
console.log("    </nav>");
console.log("    <main>");
console.log(\`      <article><p>\${htmlStructure.html.body.main.article}</p></article>\`);
console.log(\`      <section><p>\${htmlStructure.html.body.main.section}</p></section>\`);
console.log("    </main>");
console.log(\`    <footer><p>\${htmlStructure.html.body.footer}</p></footer>\`);
console.log("  </body>");
console.log("</html>");`
            },
            {
                id: 'css-styling',
                title: 'CSS Styling',
                content: `
# CSS Styling

CSS (Cascading Style Sheets) controls the visual appearance of HTML elements. It's what makes websites beautiful and engaging!

## CSS Syntax

CSS consists of selectors and declarations:

\`\`\`css
selector {
    property: value;
    property: value;
}
\`\`\`

## Adding CSS to HTML

### Inline Styles
\`\`\`html
<h1 style="color: blue; font-size: 24px;">Title</h1>
\`\`\`

### Internal Styles
\`\`\`html
<style>
    h1 { color: blue; font-size: 24px; }
</style>
\`\`\`

### External Styles (Recommended)
\`\`\`html
<link rel="stylesheet" href="styles.css">
\`\`\`

## Common CSS Properties

- **Colors**: \`color\`, \`background-color\`
- **Typography**: \`font-size\`, \`font-family\`, \`font-weight\`
- **Spacing**: \`margin\`, \`padding\`
- **Layout**: \`display\`, \`position\`, \`flex\`
- **Dimensions**: \`width\`, \`height\`

## CSS Selectors

- **Element**: \`h1 { }\`
- **Class**: \`.my-class { }\`
- **ID**: \`#my-id { }\`
- **Descendant**: \`div p { }\`
- **Pseudo-classes**: \`:hover\`, \`:focus\`

## Modern CSS Features

- **Flexbox**: Flexible layouts
- **Grid**: Two-dimensional layouts  
- **CSS Variables**: Reusable values
- **Media Queries**: Responsive design
        `,
                codeExample: `// CSS concepts demonstrated through JavaScript styling:

// Simulate CSS styling with JavaScript objects
const cssStyles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    margin: 0,
    padding: "20px"
  },
  h1: {
    color: "#333",
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "1rem"
  },
  paragraph: {
    color: "#666",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto"
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  "button:hover": {
    backgroundColor: "#0056b3"
  }
};

// Display CSS rules
console.log("=== CSS Styles ===");
Object.entries(cssStyles).forEach(([selector, styles]) => {
  console.log(\`\${selector} {\`);
  if (typeof styles === 'object') {
    Object.entries(styles).forEach(([property, value]) => {
      // Convert camelCase to kebab-case
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      console.log(\`  \${cssProperty}: \${value};\`);
    });
  }
  console.log("}\\n");
});

// Demonstrate CSS concepts
console.log("=== CSS Concepts ===");
console.log("✓ Selectors: target specific elements");
console.log("✓ Properties: define styling attributes");
console.log("✓ Values: specify how properties should appear");
console.log("✓ Cascade: styles inherit and override");
console.log("✓ Responsive: adapt to different screen sizes");

// Box model demonstration
const boxModel = {
  content: "200px × 100px",
  padding: "20px all sides",
  border: "2px solid black", 
  margin: "10px all sides",
  totalWidth: "200 + 40 + 4 + 20 = 264px",
  totalHeight: "100 + 40 + 4 + 20 = 164px"
};

console.log("\\n=== CSS Box Model ===");
Object.entries(boxModel).forEach(([key, value]) => {
  console.log(\`\${key}: \${value}\`);
});`
            }
        ]
    }
];

export default topics;