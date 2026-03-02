const advances = {
    id: 'advances',
    title: 'Advances in Exinix',
    content: `
    
    
# Generic Method
Where action does not depend on Type like sort, comparison etc
    

#### \`main.en\`

\`\`\`exinix
typedef T

::[annotions]
sort printArray ([T] array) => str{
    for (T item : array) {
        out(item);
    }

}
array : int = [1,2,3]
printArray(array);

\`\`\`


# Generic Class

#### \`child.en\`
\`\`\`exinix

cls geN -> T,K {
    a : T
    b: T
    c : K
    (i : T, j : str){
    }
    

}


obj : geN->int,int = geN(100,"Kri")



\`\`\`

# Collection
1. **Array** : Traditional Not Extendable, Fixed Sized
2. **List** : Can be Unpacked with \`...\`
    - Ordered : ✔Yes
    - Mutable: ✔Yes
    - Allows Duplicates : ✔Yes
    - Indexed: ✔Yes
    - Unique Values : ❌No
3. **Set** : Can be Unpacked with \`...\`
    - Ordered : ❌No
    - Mutable: ✔Yes Expandable but not changed by index
    - Allows Duplicates : ❌No
    - Indexed: ❌No
    - Unique Values : ✔Yes
4. **Map** : Can be Unpacked with \`...\`
    - Ordered : ✔Yes
    - Mutable: ✔Yes
    - Allows Duplicates : Keys must be Unique
    - Indexed: ❌No
    - Unique Values : Key must be Unique
    
    
- Note : Normally List,Set, Map are not Fixed , but can achieve this by \`Array.asList()/Array.asSet()\` or \`List.of()/Set.of()/Map.of()\` backed by Array. 

\`\`\`exinix
//array
a : int[5] // init
a = [1,2,4,7]

//or

a:int[] = [1,5,45,4]

//list
b : [int] // init
//or
b :[int] = [1,52,15,47,8,56,78]
b.add(1) // function
b[0] = 45 //access or change
//some function : add,get,remove,pop,size,clear,contains etc


//set / mem
b : {int} // init
//or
b :{int} = {1,52,15,47,8,56,78}
b.add(1) // function
b[0] = 45 //error not indexed
//some function : add,remove,size,clear,contains etc



//dict / map
b : {str,str} // init
c : {str->{str:{str:str}}}

//or
b : {str,str} = {"name":"TechCorp","age":"45","duration":"20"}
b.add(1) // function
b[0] = 45 // error 
//some function : put ,get,remove,containsKey,keySet etc




\`\`\`

# Unpacking of Collections
- Note: \`~\` is for garbage value collection ignorance
### Array/List/Set
#### Syntax
\`variable : Type (Optional), var2,var3.... = Array/List/set\`
- Note : Each variable store single value , to store all value we have to write \`[Type],{Type}, Type[]\`
    - Inline Casting Allowed because that variable is never assigned before so it can by any Type

### Map
#### Syntax
\`variable : Type (Optional), var2,var3.... = Map\`
-Note : Vargas Cant be Multiple
    - Unpacking Element should be within range (unpacked args <= Target ) 


\`\`\`exinix




#Array + List
d : [str] = ["1","SDD","dss","edd"] //List
d : str[] = ["1","SDD","dss","edd"] //Array

a : int, b: [str],c = d //
//a = 1 (int) // inline typecast
//b = ["SDD","dss"] (List/Array)
//c = "edd" (str)

a : int, b , ~,c = d // b = ["SDD"]
//a = 1 (int) // inline typecast
//b = "SDD" //str
//c = "edd" (str)

a,b : int = d //b cause error "SDD" can't be int




::[Set Structure]
d : {str} = {"1","name,"as","s","swd"}
a : int , ~, b= d
//a = 1 (int) // inline typecast
//b= "as" //str

a : int , b, ~ , c : {} = d
//a = 1 (int) // inline typecast
//b= "name" //str
//c = {"s","swd"} // set






::[Map Structure]

m :{str,str} ={"0":"TechCorp","age":"45","duration":"20"}
n,p = m.keys() // return a set because no duplicates
n,p = m.values() // return List because value can be duplicate


n : {{,}} , ~, p : {,} = m.items() 
//Multiple {{,}} {set of map} not allowed this is for rest of 

n = {{"name":"TechCorp"}} // set
p = {"duration":"20"} //dict

//or

n,~,p = m
n = {{"name":"TechCorp"}} // set
p = {"duration":"20"} //dict

//or

n : {{int,str}},~, p = m // inline TypeCasting
n = {{0="TechCorp"}} // set
p = {"duration":"20"} //dict








\`\`\`



# Multiple Args as Params
- Note : \`...\` params need to be at last or Single Argument
    - Arguments after \`...\` not allowed 


\`\`\`exinix


display(a... : int){
    //primitive types
}
display(a... : int, b : int ){
    //Not Allowed
    //Varargs Must be in Last for multi Arguments
}

display(a... : int[]){
    //array
}
display(a... : [int]){
    //List
}
display(a... : {str}){
    //set
}
display(a... : {str,str}){
    //map
}

typedef T 
display(a... : T){
    //Custom Type
}
display(a... : [T]){
}
display(a... : T[]){
}
display(a... : {T}){
}
display(a... : {T,T}){
}






\`\`\`


# Lambda Function

\`\`\`exinix

b = (x,y) => x + y
d = () => out("Done!")
v = (s) => s+ "kl"
out(b(1,2))



\`\`\`










 `,
    codeExample: `



`,
    codeExampleLang:'exinix'
};

export default advances;