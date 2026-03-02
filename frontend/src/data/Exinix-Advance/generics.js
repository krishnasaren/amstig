const generics = {
    id: 'generics',
    title: 'Generics in Exinix',
    content: `
# Generics

Generics allow you to write classes, interfaces, and methods that work with different data types, without having to specify the exact type in advance.

This makes your code more flexible, reusable, and type-safe.

## Why?

- **Code Reusability**: Write one class or method that works with different data types.
- **Type Safety**: Catch type errors at compile time instead of runtime.
- **Cleaner Code**: No need for casting when retrieving objects.

## Example

\`\`\`
cls Mycls[T]{
    T value
    fn setVal(a:T){
        __.value = a
    }
    fn getVal(){
        return val
    }
}

a:Mycls[Integer] = Mycls()
a.setValue(10)
out(a.getValue())
//10

a:Mycls[str] = Mycls()
a.setValue("Hello")
out(a.getValue())
//Hello



\`\`\`

**Note**- Generics class expect Reference types Object, not primitive data type
- \`a:Mycls[int] = Mycls() \` : Cause Error
- \`a:Mycls[Integer] = Mycls() \` : OK
- Can have constructure, just like normal class

## Generics Methods

\`\`\`
fn[] printArray(T[] array) {
    for (T item : array) {
      System.out.println(item);
    }
}
names:str = ["Jenny", "Liam"]

numbers:int = [1, 2, 3] // not allowed 
//need reference Object type
numbers:Integer = [1, 2, 3] // Allowed
printArray(names);
printArray(numbers);



\`\`\`

## Important Rules
- \`[]\`- defines Types here


## Use \`:\` (Extends)
\`\`\`
cls stat[T : Number]{
    nums[]: T
    (nums[]:T){
        __nums = nums
    }
    fn average():double {
        double sum = 0;
        for (num: T <> nums) {
            sum += num.doubleValue();
        }
        return sum / nums.length;
    }
}

intNums[]: Integer = {10, 20, 30, 40}
intStats:Stats = Stats<>(intNums)
out("Integer average: " + intStats.average())

//Use with Double
doubleNums[]:double = {1.5, 2.5, 3.5}
doubleStats:Stats = Stats[double](doubleNums)
out("Double average: " + doubleStats.average())


\`\`\`


### Usage
1. Normal Arraylist<Integer> :[1,2,3,4,5,6,7]
2. 2D - ArrayList<ArrayList<Integer>> : [[1,2,3],[1,2]]
3. Pair Tupple (1D) - \`ArrayList <Pair<String,String>>\` : [("Alice","Aval"),("Bob","Bval")]  
    - for (Pair<String, String> p : pairs) -> p.getKeys() p.getValues()
4. Map - \`ArrayList<Map<String,String>>\` : [{Alice=Paris, Bob=London}, {Charlie=Rome}]
5. 3D - \`ArrayList<ArrayList<ArrayList<Integer>>>\`
6. 4D - \`ArrayList<ArrayList<ArrayList<ArrayList<Integer>>>>\`




 














 `,
    codeExample: `
    
fn[] printArray(T[] array) {
    for (T item : array) {
      System.out.println(item);
    }
}
names:str = ["Jenny", "Liam"]

numbers:int = [1, 2, 3] // not allowed 
//need reference Object type
numbers:Integer = [1, 2, 3] // Allowed
printArray(names);
printArray(numbers);


`,
    codeExampleLang:'exinix'
};

export default generics;