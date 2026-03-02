const polymorphism = {
    id: 'polymorphism',
    title: 'Polymorphism in Exinix',
    content: `
# Polymorphism

Polymorphism means "many forms", and it occurs when we have many classes that are related to each other by inheritance.

Like we specified in the previous chapter; Inheritance lets us inherit attributes and methods from another class. Polymorphism uses those methods to perform different tasks. ==This allows us to perform a single action in different ways.==

### Syntax
\`objectName\` : \`referenceType\` = \`createObject\`

- **referenceType** : decide which method/attribute/innerClasses etc, you get to call
- **createObject** : the version got executed after method/attribute/innerClasses call

So, referenceType : ==Poly==
createObject : ==Action==

### Example

\`\`\`

cls Animal{
    fn animalSound(){
        out("Animal Sound")
    }
    fn specialAnimalSound(){
        out("Special Animal Sound")
    }
}
cls Pig : Animal{
    fn animalSound(){
        out("Pig : wee wee")
    }
    fn specialPigSound(){
        out("Special Pig Sound" )
    }
    
}
cls Dog : Animal{
    
    fn specialDogSound(){
        out("Special Dog Sound" )
    }
    
}

cls Main{
    aobj : Animal = Animal()
    aa : Pig = Animal() 
    --- not allowed, reaseon reference type is subclass
    and object is parent class , so if you call reference class method
    which is not part of parent class then cause error ---
    
    pobj : Pig = Pig() 
    // reference of pig, so got pig all features
    paobj : Animal = Pig()
    // reference of Animal , so got animal all features
    
    dobj : Dog = Dog() 
    // reference of dog, so got dog all features
    
    daobj : Animal = Dog()
     // reference of animal, so got animal all features
    
    aobj.animalSound() 
    //Animal Sound
    aobj.specialAnimalSound()
    //Special Animal Sound
    aobj.specialPigSound()
    //error Animal reference don have this method
    aobj.specialDogSound()
    //error Animal reference don have this method
    
    pobj.animalSound()
    // Pig : wee,wee
    pobj.specialAnimalSound()
     //Special Animal Sound
    pobj.specialPigSound()
    //Special Pig Sound
    
    paobj.animalSound()
    ---Pig : wee,wee overwritten here
    otherwise -> Animal Sound ---
    paobj.specialAnimalSound()
    //Special Animal Sound 
    paobj.specialPigSound()
    ---error
    reference type Animal dont have this method---
    
    
    dobj.animalSound()
    // Animal Sound
    ---No overwritten---
    
    dobj.specialAnimalSound() 
     //Special Animal Sound
    dobj.specialDogSound()
    //Special Dog Sound
    daobj.animalSound()
    //Animal Sound
    ---Not overwritten Here---
    daobj.specialAnimalSound()
    //Special Animal Sound
    daobj.SpecialDogSound()
    ---error reference type Animal dont have this method---
    
    

}


\`\`\`

### Some Concerns
- ==Reference Type== : tell about the method /attribute/class etc can be accessed
- ==Reference Object== : tell the version of action will executes
- **Reference Type  >= Reference Object**
    1. \`obj: Pig = Animal()\` //not allowed ,because pig is subclass, then other like dog may be not hold pig behaviour
    2. \`obj : Animal = Animal()\` // Allowed
    3. \`obj : Animal = Pig()\` // Allowed
    4. \`obj: Pig = Pig()\` //Allowed
    
### Important
- Upcasting Allowed. \`obj : Animal = Pig()\`
- Down casting Not Allowed ,Reason : You cannot force a parent object (Animal) to behave like a child (Pig) \`obj: Pig = Animal()\`

## Use of Method
- After extends of superclass, subclass got all features from parent class, whether its method is override or not
- Reference class decides which method user will get, like ==if parent class don't have the method but Subclass have that features then if reference class is parent class then it can't get the method, if subclass is reference type with Subclass Object then it will get that method with all parent class features==
    1. \`obj: parent = childObj\` -> Can't access because parent class don't have it , and reference is parent class here
    2. \`obj : child = parentObj\` -> now reference is child, but this not allowed in Exinix, reason: DownCasting you force parent to behave like child means put child method in parent class forcefully,
    2. \`obj: child = childObj\` -> Can access child class method , which is not part of parent



 `,
    codeExample: `

cls Animal{
    fn animalSound(){
        out("Animal Sound")
    }
    fn specialAnimalSound(){
        out("Special Animal Sound")
    }
}
cls Pig : Animal{
    fn animalSound(){
        out("Pig : wee wee")
    }
    fn specialPigSound(){
        out("Special Pig Sound" )
    }
    
}
cls Dog : Animal{
    
    fn specialDogSound(){
        out("Special Dog Sound" )
    }
    
}

cls Main{
    aobj : Animal = Animal()
    aa : Pig = Animal() 
    --- not allowed, reaseon reference type is subclass
    and object is parent class , so if you call reference class method
    which is not part of parent class then cause error ---
    
    pobj : Pig = Pig() 
    // reference of pig, so got pig all features
    paobj : Animal = Pig()
    // reference of Animal , so got animal all features
    
    dobj : Dog = Dog() 
    // reference of dog, so got dog all features
    
    daobj : Animal = Dog()
     // reference of animal, so got animal all features
    
    aobj.animalSound() 
    //Animal Sound
    aobj.specialAnimalSound()
    //Special Animal Sound
    aobj.specialPigSound()
    //error Animal reference don have this method
    aobj.specialDogSound()
    //error Animal reference don have this method
    
    pobj.animalSound()
    // Pig : wee,wee
    pobj.specialAnimalSound()
     //Special Animal Sound
    pobj.specialPigSound()
    //Special Pig Sound
    
    paobj.animalSound()
    ---Pig : wee,wee overwritten here
    otherwise -> Animal Sound ---
    paobj.specialAnimalSound()
    //Special Animal Sound 
    paobj.specialPigSound()
    ---error
    reference type Animal dont have this method---
    
    
    dobj.animalSound()
    // Animal Sound
    ---No overwritten---
    
    dobj.specialAnimalSound() 
     //Special Animal Sound
    dobj.specialDogSound()
    //Special Dog Sound
    daobj.animalSound()
    //Animal Sound
    ---Not overwritten Here---
    daobj.specialAnimalSound()
    //Special Animal Sound
    daobj.SpecialDogSound()
    ---error reference type Animal dont have this method---
    
    

}


`,
    codeExampleLang:'exinix'
};

export default polymorphism;