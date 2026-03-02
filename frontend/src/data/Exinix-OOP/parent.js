const parent = {
    id: 'parent',
    title: 'parent keyword in Exinix',
    content: `
# parent Keyword

In Exinix, the \`parent\` keyword is used to refer to the parent class of a subclass.

The most common use of the \`parent\` keyword is to eliminate the confusion between superclasses and subclasses that have methods with the same name.

It can be used in two main ways:
- To access attributes and methods from the parent class
- To call the parent class constructor

### Example

\`\`\`

cls Animal {
  fn animalSound() {
    out("The animal makes a sound")
  }
}

cls Dog : Animal {
  fn animalSound() {
    parent.animalSound(); // Call the parent method
    out("The dog says: bow wow");
  }
}

dob : Dog = Dog()
dob.animalSound()
//output : 
//The Animal makes a sound
//The dog says: bow wow

\`\`\`

## Access Parent Attributes
\`\`\`
cls Animal {
  type:str = "Animal"
}

cls Dog : Animal {
  type:str = "Dog";

  fn printType() {
    out(parent.type)
    // Access parent attribute
  }
}

\`\`\`
 ## Multiple Inheritance
 Resolution Order
 
 \`\`\`
class A{
    (){
        out("A init")
    }  
}

class B : A{:
    (){
        parent() //optional if no argument
        out("B init")
    }
}

class C :A:
    (){
        parent() //optional if no argument
        out("C init")
    }
}

//Multiple Inheritance
class D : B,C:   
    (){
        parent() //optional if no argument
        out("D init")
    }
}

d : D = D()

 
 \`\`\`
 
 ### Output
 \`\`\`
A init
C init
B init
D init
 
 \`\`\`
 
- Note : if multiple subclass inherited from same parent class then , parent class behaviour will not duplicate multiple time when call \`parent()\`

### Explanation
1. Created ==D== class object who extends ==B== and ==C== (parent), and call parent
2. Go to ==B== class, Now call \`parent\` 
3. Now it is on \`A\` class
4. Go to ==C== class, Now call \`parent\` 
5. Now it is on \`A\` class
6. Now ==A== class two time by ==B== and ==C==
7. so , Follow LIFO (Last in First Out) order
8. ==A==(from C)->C
9. ==A==(from B)->B
10. remove duplicate ==A== called already, skip
11. back to ==D==
12. \`A->C->B->D\`

- Note : if you change the order D : C, B then order will be \`A->B->C->D\`







 `,
    codeExample: `

cls Animal {
  type:str = "Animal"
}

cls Dog : Animal {
  type:str = "Dog";

  fn printType() {
    out(parent.type)
    // Access parent attribute
  }
}


`,
    codeExampleLang:'exinix'
};

export default parent;