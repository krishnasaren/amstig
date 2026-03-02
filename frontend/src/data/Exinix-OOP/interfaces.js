const interfaces = {
    id: 'interfaces',
    title: 'Interfaces in Exinix',
    content: `
# Interface
Another way to achieve abstraction in Java, is with interfaces.

An interface is a completely "abstract class" that is used to group related methods with empty bodies:

The \`imu\` keyword is used for classes and automatically all method are abstract mwthod. No Body.
Usage : with the help of \`guard\` special method 

**Important Notes**
- Only \`const\` variable allowed
- Method must not have a body
- Variable are by default public static final must
- Constructure Not Allowed

### Why Not Private/Protected Variable
To avoid same variable in multiple instances

\`\`\`
imu inter{
    @age : int = 20
    x: int = 20
}
imu inter2{
    @age : int = 22
    x : int = 22
}
cls main(inter,inter2){
    fn show(){
        out(age) // here should be confusion
        //which one age
        
        out(inter.x)
        //static public value
        //inter x=20
        out(inter.y)
        //22
    }
    
}


\`\`\`

### Example

\`\`\`

imu inter{
    age : int = 20
    fn dis()
    fn show()
     

}
cls main(inter){
    fn dis(){
        //action
    }
    fn show(){
        //action
        out(inter.age)
    }
}



\`\`\`

### Variable
- public static final by default
- private , protected not allowed

### Method
- static, private and default allowed
- static called by interface itself
- private method help for reusable code inside interface
- default method are called from object of sub class which implement the interface
- default method can be override, used for code reusability 

### with __guard__
\`\`\`
imu inter{
    age : int = 20
    fn dis()
    fn show()
     

}
imu inter2{
    year : int = 2000
    fn call()

}
cls main(){
    __guard__(inter,inter2){
        fn show(){
        }
        fn dis(){
        
        }
        fn call(){
            out(inter.year) 
        }
        
    }
    imuVar : inter,inter2 = __guard__(inter,inter2){
        fn show(){
        }
        fn dis(){
        
        }
        fn call(){
            out(inter.year) 
        }
        
    }
    out(imuVar.year)
    out(imuVar.age)
    
    
}


\`\`\`













 `,
    codeExample: `
imu inter{
    age : int = 20
    fn dis()
    fn show()
     

}
cls main(inter){
    fn dis(){
        //action
    }
    fn show(){
        //action
        out(inter.age)
    }
}


`,
    codeExampleLang:'exinix'
};

export default interfaces;