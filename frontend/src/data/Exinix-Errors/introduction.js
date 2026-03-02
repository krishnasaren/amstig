const introduction = {
    id : "errorintroduction",
    title: "Errors",
    content  :`
# Errors

### Types
1. Compilation Errors 
2. Runtime Errors
3. LogicL Errors (Human Prompt Errors)

## Compilation Errors
==Caught before the code execution==
\`\`\`
name = str => 10 // syntax error
nm ; str = "hhd" // syntax error

name : str = 10 // Type Error


\`\`\`

## Runtime Errors
==Caught during code execution==

\`\`\`
a:int = 10
b : int= a/0 // get error can be divided by Zeror

\`\`\`

## Logical Errors
==Human Generated Errors==
- Unexpected Output

\`\`\`

a : int = 10
b : int = 20
c : int = b+a
out("Multiplication of {a} and {b} : {c}")
\`\`\`



    `,
    codeExample : `
name = str => 10 // syntax error
nm ; str = "hhd" // syntax error

name : str = 10 // Type Error

`,
    codeExampleLang:'exinix'
};
export default introduction;