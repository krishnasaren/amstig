const abstraction = {
    id: 'abstraction',
    title: 'Abstraction in Exinix',
    content: `
# Abstraction
- This is One of the special types of Class

Data abstraction is the process of hiding certain details and showing only essential information to the user.
Abstraction can be achieved with either abstract classes or interfaces (which you will learn more about in the next chapter).

The \`proto\` keyword is a non-access modifier, used for classes and methods:

- **Abstract class**: is a restricted class that cannot be used to create objects (to access it, it must be inherited from another class).

- **Abstract method** : can only be used in an abstract class, and it does not have a body. The body is provided by the subclass (inherited from).
An abstract class can have both abstract and regular methods:

Regular Method : \`fn functionName(){body}\`

Abstract Method : \`fn functionName()\`

- In Abstrct class which method have body considered as regular, which don't have body will be considered as abstract method
- **Abstract class can't have Object**
### Example

\`\`\`

proto myClass{
    fn display() //abstract method
    fn call(){
        //normal method
    }

}
obj : myClass = myClass()
//error object creation not allowed



\`\`\`

- If an abstract class have a constructure, which have parameter, then each subclass must have constructure.
- If abstract class constructure having no parameter then , constructure in subclass can be skipped

### With Constructure
\`\`\`
proto A{
    name : str
    age : int
    (name,age){
        __.name = name
        __.age = age
    }
    fn display() //abstract method
    fn call(){
        out("From A")
    }

}

cls B : A{
    model : bool
    
    (model,name,age){
        parent(name,age)
        __.model = model
    }
    
    fn display(){
        //mandatory override
        out("From B display")
    }
    fn call(){
        //optional override
        out("From B")
    }

}

cls C : B{
    year : int
    (year,model,name,age){
        parent(model,name,age)
        __.year = year
    }
    fn display(){
        out("From C display")
    }
}

obj1:A = C(2000,true,"Bob",23);  
// reference type A, object type C
obj1.call();      // From B
obj1.display();   // From C display 

obj2:B = C(2000,true,"Bob",23);
obj2.call();      //  From B
obj2.display();   // From C display

obj3:C = C(2000,true,"Bob",23);
obj3.call();      // From B
obj3.display();   // From C display
\`\`\`

### Why And When To Use Abstract Classes and Methods?
- To achieve security - hide certain details and only show the important details of an object.

### Important
- Up Casting Allowed \`obj: A = C()\` or \`obj: A = B()\`
- Down Casting Not Allowed \`obj: C = B()\`
- Downcasting Not allowed, reason can't be force a parent behave like child













 `,
    codeExample: `
proto A{
    name : str
    age : int
    (name,age){
        __.name = name
        __.age = age
    }
    fn display() //abstract method
    fn call(){
        out("From A")
    }

}

cls B : A{
    model : bool
    
    (model,name,age){
        parent(name,age)
        __.model = model
    }
    
    fn display(){
        //mandatory override
        out("From B display")
    }
    fn call(){
        //optional override
        out("From B")
    }

}

cls C : B{
    year : int
    (year,model,name,age){
        parent(model,name,age)
        __.year = year
    }
    fn display(){
        out("From C display")
    }
}

obj1:A = C(2000,true,"Bob",23);  
// reference type A, object type C
obj1.call();      // From B
obj1.display();   // From C display 

obj2:B = C(2000,true,"Bob",23);
obj2.call();      //  From B
obj2.display();   // From C display

obj3:C = C(2000,true,"Bob",23);
obj3.call();      // From B
obj3.display();   // From C display


`,
    codeExampleLang:'exinix'
};

export default abstraction;