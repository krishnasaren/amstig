const typecast = {
    id :"typecast",
    title : "TypeCasting in Exinix",
    content : `
# Type Casting in Exinix

## Casting Method
1. **Implicit** (Small to Big data types)
2. **Explicit** ( Big to Small data types )


## Implicit

\`\`\`exinix
x = 10 // int
y:long 
y= x
//OR
y : long = x // Allowed

\`\`\`


## Explicit
\`\`\`
//case: 1
age : int = 25 //type is not defined 'int'
age = (int) 225.723 // Allowed

//type of age is 'int'

//case: 2
age : float = 36.233 // tye not defined  'float'
age  = (float) 23// allowed
age = (float) 23.56 //alowed

//type of age is  'float'

//case:3
age:int
age = 100 //ok
age = (float) 10 // Not allowed age in an 'int' 

//case 4
x = 10L //long
x : long = 10L
y : int = (int) x




\`\`\`

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

export default typecast;