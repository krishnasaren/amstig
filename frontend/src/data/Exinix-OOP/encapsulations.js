const encapsulations = {
    id: 'encapsulations',
    title: 'Encapsulation in Exinix',
    content: `
# Encapsulation

The meaning of Encapsulation, is to make sure that "sensitive" data is hidden from users. To achieve this, you must:

declare class variables/attributes as \`$\`
provide public get and set methods to access and update the value of a \`$\` variable

### Get and Set

You learned from the previous chapter that \`$\` variables can only be accessed within the same class (an outside class has no access to it). However, it is possible to access them if we provide public get and set methods.

The \`get\` method returns the variable value, and the \`set\` method sets the value.

Syntax for both is that they start with either \`get\` or \`set\`, followed by the name of the variable, with the first letter in upper case:

### Example
\`\`\`
cls myClass:
    $name:str
    $age:age
    
    fn setName(name){
        __.name = name
    }
    fn getName(){
        return name
    }
obj: myClass = myClass()
obj.name // error
obj.setName("BOB")
obj.getName() //BOB
\`\`\`

#### Explaination
The \`getName\`  method returns the value of the variable \`name\`

The \`setName\` method takes a parameter (name) and assigns it to the name variable. The \`__\` used for class instances to refer to the current object.

However, as the name variable is declared as private, we cannot access it from outside this class:

#### Why Encapsulation?
- Better control of class attributes and methods
- Class attributes can be made read-only (if you only use the get method), or write-only (if you only use the set method)
- Flexible: the programmer can change one part of the code without affecting other parts
- Increased security of data
        `,
    codeExample: `
cls myClass:
    $name:str
    $age:age
    
    fn setName(name){
        __.name = name
    }
    fn getName(){
        return name
    }
obj: myClass = myClass()
obj.name // error
obj.setName("BOB")
obj.getName() //BOB


`,
    codeExampleLang:'exinix'
};

export default encapsulations;