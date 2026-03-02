const inheritance = {
    id: 'inheritance',
    title: 'Inheritance in Exinix',
    content: `
# Inheritance

In Exinix , it is possible to inherit attributes and methods from one class to another. We group the "inheritance concept" into two categories:

- subclass (child) - the class that inherits from another class
- superclass (parent) - the class being inherited from
To inherit from a class, use the \`:\` symbol.

In the example below, the ==Car== class (subclass) inherits the attributes and methods from the ==Vehicle== class (superclass):


### Example

\`\`\`

cls Vehicle{
    @name : str
    @model: str
    (name,model){
        __name = name
        __model = model
    }
    fn display(){
        out("{name} and {model}")
    }
    
}

cls Car : Vehicle{
    (name, model){
        parent(name, model)
    }
    
}
objC : Car = Car("Ford","Lz4")
objC.display() // out vehicle details


\`\`\`

- \`@\` used for protected, and only accessible in subclass after extends super class
- \`:\` used for inherit the parent class


#### final
Symbol - \`!!\` 
\`final\` class means class is visible or even you can create object but not inherit them or override them
- reason : To prevent data safety not to edit the class, like \`Math\` . it is a secure class

\`\`\`
cls !!Vehicle{
    //action
}

cls Car : Vehicle{
    //error not allowed
    //override not allowed

}
\`\`\`
#### Why Inheritance ?
- Code reusability
- **Inherit Parent's class features in all subclass**
- That extended features may / may not overwrite in sub classes


 `,
    codeExample: `
cls Vehicle{
    @name : str
    @model: str
    (name,model){
        __name = name
        __model = model
    }
    fn display(){
        out("{name} and {model}")
    }
    
}

cls Car : Vehicle{
    (name, model){
        parent(name, model)
    }
    
}
objC : Car = Car("Ford","Lz4")
objC.display() // out vehicle details


`,
    codeExampleLang:'exinix'
};

export default inheritance;