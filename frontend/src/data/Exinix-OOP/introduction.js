const introduction = {
    id: 'oop',
    title: 'OOP in Exinix',
    content: `
# OOP

OOP stands for Object-Oriented Programming.

Procedural programming is about writing procedures or methods that perform operations on the data, while object-oriented programming is about creating objects that contain both data and methods.

Object-oriented programming has several advantages over procedural programming:

- OOP is faster and easier to execute
- OOP provides a clear structure for the programs
- OOP helps to keep the Exinix code DRY "Don't Repeat Yourself", and makes the code easier to maintain, modify and debug
- OOP makes it possible to create full reusable applications with less code and shorter development time

## What are Classes and Objects?

### Class
- Classes is a big container, 
- A class is like a blueprint or a template.

- It describes how something should look and behave (its attributes and methods).

- But a class itself is not a real object; it’s just a definition.

### Object

- An object is a real-world instance of a class.

- When you create an object, you are building something from the blueprint.

- Each object has its own values for the attributes.

== Example (real life):==
A red Toyota car made from the blueprint



\`\`\`exinix

cls Main{
    //Global Variable
    const pi = 3.14
    const si : float
    static const ni :int //declare
    $x:int
    y:int
    @z:int
    
    _{
        //class instances block
        // related to class only not object
        //define static variable
        //run only once
    }
    
    {
        //object block
        //Local Variable
    }
    
    
    
    (a:int, b:int,c:int){
        //constructure
        //special method
        its.x=a
        its.y = b
        its.z=c
        its.si = 10.45f
    }
    
}


cls second : Main,Ext,Sco {


}

cls Third : Meths => {
}


\`\`\`.
        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default introduction;