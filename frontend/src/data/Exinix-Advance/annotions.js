const annotions = {
    id: 'annotions',
    title: 'Annotions in Exinix',
    content: `
# Annotion Function

Annotations are special notes you add to your Exinix code. They start with the \`[]\` symbol.

## Built-In Annotion
1. \`[parent]\` - to state that , this is from parent
2. \`[deprecated]\` - Marks a method or class as outdated or discouraged from use
3. \`[suppressWarning]\` - suppress any warnings



## Example
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
    (name,model){
        parent(name,model)
    }
    
    [Override]
    fn display(){
        out("Override")
    }
    //Override
}

carobj : Car = Car()
carobj.display()
//Override

\`\`\`














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
    (name,model){
        parent(name,model)
    }
    
    [Override]
    fn display(){
        out("Override")
    }
    //Override
}

carobj : Car = Car()
carobj.display()
//Override

`,
    codeExampleLang:'exinix'
};

export default annotions;