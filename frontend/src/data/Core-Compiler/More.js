const More = {
    id: 'More',
    title: 'More in Exinix',
    content: `
    
    
# Slice of Array/List (Indexed)

### Syntax
\`list[start : stop : step]\`

- Note : During Slice assignment the length should be maintained

#### \`main.en\`

\`\`\`exinix
a = [10, 20, 30, 40, 50]

a(a[1:4])  
// [20, 30, 40]

a[:3]
//[10, 20, 30]

a[2:]
//[30, 40, 50]

a[:]
// entire list → [10, 20, 30, 40, 50]

a[-3:]
// last 3 elements → [30, 40, 50]

a[:-2]
// remove last 2 → [10, 20, 30]

a[-4:-1]
// [20, 30, 40]


a[0:5:2]
//[10, 30, 50]

a[::-1]
//[50, 40, 30, 20, 10]


a[4:0:-1]
//[50, 40, 30, 20]

a[::2]
// every 2nd element → [10, 30, 50]

a[::-2]
// reverse with step 2 → [50, 30, 10]


Slice Assignment
b = [1, 2, 3, 4, 5]
b[1:4] = [20, 30, 40]

out(b)
//[1, 20, 30, 40, 5]

b[::2] = [10, 20, 30]  // must match length


Empty Slice
a[1:1]  //empty slice
// []

a[4:1:1] 
//If start > stop with positive step → empty
// []

a[1:4:-1] 
//If start < stop with negative step → empty
// []

a[-1:-6:-1]
// [50, 40, 30, 20, 10]

a[-2::-1]
// [40, 30, 20, 10]

copy_list = a[:]
reversed_copy = a[::-1]


Delete 
a = [10,20,30,40,50]
del a[1:4]

out(a)
# [10, 50]


















\`\`\`


# Iterator 
Work For
    - Array
    - List
    - Set
    - Queue
    - Map
    
    Above all these have \`iterator()\` that generate Collection with Pointer
    after That \`it.hasNext()\`

#### \`child.en\`
\`\`\`exinix

a : [int] = [10, 20, 30, 40, 50]
it : Iterator ? int = a.iterator()
while(it.hasNext()) {
    //
}

//or

foreach (a.iterator() as a:int){
    //
}







\`\`\`

# \`<?>\` - Wild card Type

|Wildcard|Meaning|Can Read As|Can Write|Use Case|
|\`?\`|unknown type|Object|no|only iterate/print|
|\`? extends T\`|T or subclass|T|no|reading|
|\`? super T\`|T or superclass|Object|yes (T only)|writing|

\`?\`

"Some unknown type."

You can:

- ✔ Read values as Object
- ✘ Cannot add anything (except ==null==)

Use when:

- You don't care about the type
- You only need to iterate or print

\`\`\`exinix
void printList(List<?> list) {
    for (Object x : list) {
        System.out.println(x);
    }
}
printList(List.of(1, 2, 3));
printList(List.of("a", "b"));
printList(new ArrayList<Double>());



\`\`\`
# \`<? extends T>\` — Upper Bounded Wildcard

Meaning: "Some unknown type that is T or a subclass of T."

Example:
\`? extends Number\` → Integer, Double, Number, Float…

You can:

- ✔ Read values as type T (safe!)
- ✘ Cannot add anything (UNSAFE)

Why cannot write?
Because compiler doesn’t know the exact subtype.

Use when:

- You want to read data
- You need covariance: “I accept anything that IS-A T”

\`\`\`exinix
void sumNumbers(List<? extends Number> list) {
    double sum = 0;
    for (Number n : list) {
        sum += n.doubleValue();
    }
}
sumNumbers(List.of(1, 2, 3)); // List<Integer>
sumNumbers(List.of(1.2, 3.4)); // List<Double>
list.add(5);  // ❌ compile error


\`\`\`

# \`? super T\` — Lower Bounded Wildcard
Meaning:
“Some unknown type that is T or a SUPERCLASS of T.”

Example:
\`? super String\` → Object, CharSequence, String

You can:

- ✔ Add/write T values
- ✔ Read only as Object (because exact type unknown)

Use when:

- You want to write items
- You need contravariance: “I accept any parent of T”

\`\`\`exinix
void addStrings(List<? super String> list) {
    list.add("hello");
    list.add("world");
}
addStrings(new ArrayList<String>());
addStrings(new ArrayList<Object>());
addStrings(new ArrayList<CharSequence>());
String s = list.get(0); // ❌ compile error
Object o = list.get(0); // ✔ OK


\`\`\`


# Example

\`\`\`exinix
class Fruit {}
class Apple extends Fruit {}
class Mango extends Fruit {}
void washFruits(List<? extends Fruit> basket) {
    for (Fruit f : basket) { }
}
washFruits(new ArrayList<Apple>());
washFruits(new ArrayList<Mango>());


void addApples(List<? super Apple> basket) {
    basket.add(new Apple());
}
addApples(new ArrayList<Fruit>());
addApples(new ArrayList<Object>());



\`\`\`









 `,
    codeExample: `



`,
    codeExampleLang:'exinix'
};

export default More;