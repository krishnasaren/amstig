const introduction = {
    id: "method",
    title: "Functions in Exinix",
    content: `
# Functions

- A method is a block of code which only runs when it is called.

- You can pass data, known as parameters, into a method.

- Methods are used to perform certain actions, and they are also known as functions.

- Why use methods? To reuse code: define the code once, and use it many times.

## Create Method
### Syntax
\`\`\`


display (a:str,b: str) => str{
}

or

display (a:str,b: str){
    //return not allowed  
    //void function
}


\`\`\`

- Note : Parameter a or b are optional , and return type \`str\` are optional.

## Multiple Optional Parameters
\`*\` - for other than \`map\`

\`**\` - only for \`map\`

\`\`\`
display(*a : str, **b:map){
    out(a)
    //(10)
    out(b)
    //{'a':10,'b':102}
}

display(10,a = 10, b=102)

\`\`\`

## Call Methods
\`\`\`

fn display(a,b):str{
    out("This is a function.")
    return ""

}
display()

\`\`\`

## Params default value

\`\`\`

fn display(a =100,b =100):str{
    out("This is a function.")
    out("value passed :{a} and {b}")
    return ""

}

display() //works without pass any value
//or
display(250) //work
//or
display(250,256) //work

\`\`\`

## Void function
### No return

\`\`\`
fn display(a,b){
    out("This is a function.")

}

display() // errr parameter need
display(10,25) //work

\`\`\`

- Note : \`str\` or any other types are not need to specify for void function
- No \`return\` keyword for \`void\` method


  `,
    codeExample : `
fn display(a,b){
    out("This is a function.")

}

display() // errr parameter need
display(10,25) //work
`,
    codeExampleLang:'exinix'

};
export default introduction;