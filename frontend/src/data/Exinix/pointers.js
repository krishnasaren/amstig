const pointers = {
    id :"pointers",
    title : "Pointers in Exinix",
    content : `
# Pointers

##### In Exinix \`ptr\` are  used for pointers

##### Performs Low level memory operation.


### Pointer Variable

\`\`\`exinix
val:int = 100
pval:*int = &val

(*pval) = 200       // modifies val directly




\`\`\`



### Class Pointers

\`\`\`exinix
cls Main {
    x:int = 10;
    fn show {
        out("This is Class Method")
    }
}

// Create objects
object : Main = Main()
object2 : Main = Main()

// Create pointers
ptr1 : *Main = &object       // pointer to object
ptr2 : *Main = &object2      // pointer to object2

// Access members via pointer
(*ptr1).x = 20               // dereference and modify
ptr2->x = 30                 // shorthand pointer access

// Call methods via pointer
(*ptr1).show()
ptr2->show()

// Pointer reassignment
ptr1 = &object2              // now ptr1 points to object2
ptr1->x = 50                 // modifies object2

\`\`\`

### Static member access

\`\`\`exinix
// Access static members via class name or pointer
Main.y = 200
ptr1->y = 300        // allowed, shared across all
Main.staticShow()
ptr2->staticShow()   // also allowed



\`\`\`


### Pointers to Pointers

\`\`\`exinix
pptr : **Main = &ptr1
(**pptr).x = 60




\`\`\`

### \`const\` Pointers

\`\`\`exinix
constPtr : *const Main = &object
constPtr->x = 100    
// ❌ Error: cannot modify through const pointer

\`\`\`
### Pointers Arithmetics

\`\`\`exinix

arr : [Main] = [Main(), Main(), Main()]
pArr : *Main = &arr[0]    // pointer to first element

// Access array elements via pointer arithmetic
(*pArr).x = 10           // arr[0].x = 10
*(pArr + 1)->x = 20      // arr[1].x = 20
(pArr + 2)->x = 30       // arr[2].x = 30

// Call methods via pointer
(pArr + 1)->show()       // calls show() on arr[1]


\`\`\`









        `,
    codeExample: `
var a = 100
var b = 100
out(a==b) //True
out(a===b) //True


out(a instanceof int) //True


    `,
    codeExampleLang:'exinix'

};

export default pointers;