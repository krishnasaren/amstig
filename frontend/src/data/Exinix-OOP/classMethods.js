const classMethods = {
    id: 'classmethod',
    title: 'Methods in Class',
    content: `
# Class Methods


## Create a Methods
- Methods tell programs that the behaviour of that class
- Create Method by using \`fn\` keywords

### Syntax

\`\`\`exinix
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True
    
    fn myMethod(){
    }

}

\`\`\`

- Here ==x==,==y==, ==z== are attributes
- ==myMethod== is the method

## Access Method

### Example

\`\`\`
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True
    
    fn myMethod(){
        out("This is class method")
    }

}
obj : Main = Main()
obj.myMethod() // called the method


\`\`\`

## Static Method
-Note : This method/attribute are not obtain to an object , instead of object this is obtain directly to a class
- we can use \`static\` keyword to define this type of method or attribute

\`\`\`
cls Main{
    static x:int = 10
    y : str = "Bob"
    z : bool = True
    fn static myMethod(){
        out("This is static method inside of class")
    }
    fn normalMathod(){
        out("This is Normal Method inside of class")
    }

}

object : Main = Main()
object2 : Main= Main()

object.myMethod() //cause error , 
//because myMethod is directly to a class not an object

Main.myMethod() // Ok Allowed
object.normalMathod() // Ok Allowed

\`\`\`
- Note : \`.\` is used to access inner method/attributes



        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default classMethods;