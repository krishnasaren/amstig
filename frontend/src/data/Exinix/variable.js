const variable = {
    id :"variable",
    title : "Variable in Exinix",
    content : `
# Variables & Data Types

Variables are containers that store data values. There are certain ways to declare a Variable

- Note : Compiler design in that ways that variable data types are known to its compiler before runtime and variable are by default Mutable

## Variable Declarations

### Inline Assignment of Value 

\`<variableName>\` : \`<dataType(Optional)>\` = \`<value>(mandatory)\`

### Declare Variable (latter value assignments)

\`<variableName>\` : \`<dataType(mandatory)>\`

## \`static\` variable
- Belongs to the classes not object , can be accessible directly from class
\`static\` \`<variableName>\` : \`<dataType(Optional)>\` = \`<value>(mandatory)\`

OR

\`static\` \`<variableName>\` : \`<dataType(mandatory)>\`

## \`const\` variable
- Must be assign the value before its usage
- can't be changed later after its assignment
- In class if you declare it , then it should be assign the value in class constructure, otherwise it will be not allowed
\`const\` \`<variableName>\` : \`<dataType(Optional)>\` = \`<value>(mandatory)\`

OR

\`const\` \`<variableName>\` : \`<dataType(mandatory)>\`


## \`static\` + \`const\` variable
- Belongs to the classes not object , can be accessible directly from class
- Must be assign the value before its usage
- can't be changed later after its assignment
- In class if you declare it , then it should be assign the value in class constructure, otherwise it will be not allowed
\`static\` \`const\` \`<variableName>\` : \`<dataType(Optional)>\` = \`<value>(mandatory)\`

OR

\`static\` \`const\` \`<variableName>\` : \`<dataType(mandatory)>\`




- Note : Exinix is Statically typed Language, check data types at compile time

\`\`\`exinix
name  = "Alice"          // String assign inline
name2:str  // declare 
name2 = "bob" // assign later


const age = 25             // Number 
const pi:float // declare
pi = 3.14 // assign later

static const roll = 10 // innline declare
static const roll:int //declare
roll = 10 // assign later



\`\`\`

## Some Issue
\`\`\`
name = "Alice"        // String
name =  10 //error not allowed
name = "Bob" //allowed

age:int

age = "nil" // error type mismatched

\`\`\`

## Rules of Identifiers
- Names can contain letters, digits, underscores(only underscore)
- Names must begin with a letter or \`_\`
- Names cannot contain whitespace
- Names are case-sensitive ("myVar" and "myvar" are different variables)
- Reserved words (such as \`int\` or \`bool\`) cannot be used as names
        `,
    codeExample: `
var name = "Alice"        // String
name =  10 //error not allowed
name = "Bob" //allowed

var age = 25
age = 225.7 // cause Error types mismatch
age : float = 225.7 // Allowed Implicit type cast
age : float = (float) 225.7 //Allowed Explicit type cast


    `,
    codeExampleLang:'exinix'
};

export default variable;