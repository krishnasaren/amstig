const classconstructure = {
    id: 'classconstruct',
    title: 'Constructure in Class',
    content: `
# Class Constructure

A constructor  is a special method that is used to initialize objects.
The constructor is called when an object of a class is created.
It can be used to set initial values for object attributes:

- Automatically called during object initialization


## Create Constructure
- Methods tell programs that the behaviour of that class
- Create Method by using \`fn\` keywords

### Syntax

\`\`\`exinix
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True
    
    (){
        //this is contructure
    }

}

\`\`\`

- Here ==(){ }== is constructure creation method

## Constructor Parameters

### Example

\`\`\`
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True
    
    (a,b,c){
        __.x = a
        __.y = b
        __.z = c
    }
    
    fn myMethod(){
        out(x) 
    }

}
obj : Main = Main(16,15,14)
out(obj.myMethod()) // called the method
//output 16


\`\`\`

- Note: \`__\` is used as reference of self class instances, double underscore





        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default classconstructure;