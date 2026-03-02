const exModule = {
    id: 'module',
    title: 'Module in Exinix',
    content: `
    
    
# Access Modifiers
- public : for all
- protected : for same package
- private: only inside that module
    
# Modules (Outer Layer)

### Note
- In module evrythings acts like \`static\`
- everything inside it is implicitly \`static\`
- ==That does not means that they are shared or same for all, that only means all inside a module is simply callable without creating objects , they are simply just sharable code where you can create a copy of them by creating your own version in your target, without creating a object of module itself==

#### \`main.en\`

\`\`\`exinix
//declaration

::[Module variable]

name : str? //nullable 
@age : int // non null
$class : str

class A{


}

{
    //static block runs automatically whenever 
    //programs runs
}()

display(){
    // void method
}

show(a:str?,b:int) => str{
    //returnable method

}








\`\`\`


# Import Module

#### \`child.en\`
\`\`\`exinix

use {name,age,class, A} from main

out (name)
//if in this module variable
//with same name then it will be overwrite

//or

name = "Sar"
out (name) // current module variable
out (main.name) //imported variable

obj: A = A()

\`\`\`

# Class
## features : 

- class variable (private,public,protected)
- class method
- inner class
- \`static\` class, method, variable
- local variable 

\`\`\`exinix
cls student{
    ::[class variable()]
    
    name : str?
    age : int?
    roll : int?
    $id : long
    @phoneno : long
    final userid : str
    
    static marks : int
    
    ::[constructure]
    (){
        //const 1
    }
    (){
        const 2
    }
    
    init{
        //equivalent to static run once
    }
    
    {
        //block runs every time when object created
    }
    cls B{
        //normal inner class
    }
    
    static cls c{
        //static class
    }
    cls $d{
        //inner private class
    }
    cls @e{
        //inner protected class
    }
    


}

secured data{
    ::[final class]
    // can be overwritten 
    // inheritance not possible
}


shared mData{
    //abstract class
    
}

data cSata{
    //interface 
    //variable are constant
    ::[public static final]
    
    //method with + without body
    
    //inside it any class can stay 
    // only data class extends are possible


}


\`\`\`



# Class and Interface Hierarchy Rules in Exinix
### A. Concrete Class (Normal Class)

- Can extend: one concrete or abstract class
- Can implement: any number of interfaces
- Can be instantiated (unless constructor is private)

### B. Abstract Class

- Can extend: concrete class ✅
- Can extend: abstract class ✅
- Can implement: any number of interfaces ✅
- Cannot be instantiated

### C. Interface

- Can extend: one or more interfaces ✅
- Cannot extend a class ❌
- Cannot be instantiated

### D. Final Class

- Cannot be extended ❌
- Can implement interfaces ✅
- Can be instantiated ✅

### E. Nested Classes

- Inner class: non-static → requires outer object to create
- Static nested class → can be created independently
- Abstract + nested: same rules as outer class

# Object Creation Rules
|Type|Can instantiate directly?|Notes|
|Concrete class|✅ Yes|Normal new|
|Abstract class|❌ No|Must subclass or anonymous class|
|Interface|❌ No|Must implement|
|Final class|✅ Yes|Normal new|
|Nested non-static class|✅ Only via outer instance|\`Outer.Inner i = outer().Inner()\`|
|Nested static class|✅ Directly|\`Outer.Inner i = Outer.Inner()\`|
|Abstract nested class|❌ Must subclass|Can subclass inside or outside|

# Inheritance / Implementation Matrix
|Parent/Child|Concrete Class|Abstract Class|Interface|Final Class|
|Concrete Class|✅ single|✅ single|✅ implement|❌ cannot extend|
|Abstract Class|✅ single|✅ single|✅ implement|❌ cannot extend|
|Interface|✅ implement|✅ implement|✅ extend multiple|❌ cannot extend|
|Final Class|❌ cannot extend|❌ cannot extend|✅ implement|❌ cannot extend|

<img src="/v_d.png">

 `,
    codeExample: `



`,
    codeExampleLang:'exinix'
};

export default exModule;