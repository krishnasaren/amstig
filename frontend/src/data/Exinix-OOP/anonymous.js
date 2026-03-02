const anonymous = {
    id: 'anonymous',
    title: 'Anonymous Class in Exinix',
    content: `
# Anonymous Class

An anonymous class is a class without a name. It is created and used at the same time.

You often use anonymous classes to override methods of an existing class or interface, without writing a separate class file.

### Example

\`\`\`
cls Animal{
    fn sound(){
        out("Mo Mo")
    }
}

obj : Animal = Animal(){
    fn sound(){
        out("Updated Mo Mo")
    }
}
obj2 : Animal = Animal(){
    //remain same
}
obj3 : Animal = Animal(){
    
    fn sound(){
        parent.sound()
        //call parent here Animal
        out("Updated Mo Mo")
    }
}
obj.sound()
//print Updated Mo Mo

obj2.sound()
//Mo Mo
obj3.sound()
//Mo Mo
//Updated Mo Mo





\`\`\`

### Why and When?

Use anonymous classes when you need to create a short class for one-time use. For example:

- Overriding a method without creating a new subclass
- Implementing an interface quickly
- Passing small pieces of behavior as objects













 `,
    codeExample: `
cls Animal{
    fn sound(){
        out("Mo Mo")
    }
}

obj : Animal = Animal(){
    fn sound(){
        out("Updated Mo Mo")
    }
}
obj2 : Animal = Animal(){
    //remain same
}
obj3 : Animal = Animal(){
    
    fn sound(){
        parent.sound()
        //call parent here Animal
        out("Updated Mo Mo")
    }
}
obj.sound()
//print Updated Mo Mo

obj2.sound()
//Mo Mo
obj3.sound()
//Mo Mo
//Updated Mo Mo

`,
    codeExampleLang:'exinix'
};

export default anonymous;