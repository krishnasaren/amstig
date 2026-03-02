const syntax = {
    id : "syntax",
    title: "Syntax of Exinix",
    content  :`
# Exinix Syntax

- Note :  \`;\` is Optional to end the syntax


    
## Exinix Variable
\`\`\`exinix
a = 45
static z=100 // inside module everything is static not need any explicit declaration
b:int // just declare later init
c:str


a--        // decrement
b = 10 




//public class inner
cls static @inner{
    $age : int = 18
    @name : str = "ok"
    static count = 0
    display(a,b) => int { return 1; }
  
}



m : coll[int]  = [] // built in coll class with int types which have different method like __
m : mem[int] = (1,2,3,4) // () are optional built in mem class 
m : set[int] = {} //  are optional built in set class 

m : map[typeA : typeB] = {A : B}

m : map[int, list[int]] = {0 : [1,2], 1 : [2,3]}




\`\`\`

## Exinix Comments
\`\`\`exinix
// single line comments
---out("a") 
multi-line comments
this is.---

\`\`\`

## Exinix Functions
\`\`\`exinix
display() => str {
}
//OR

display(a,b) => str {
}
\`\`\`

## Exinix MultiString
\`\`\`exinix
str1 = 'str1'
str2 = "str2"

mulstr = """This is a multistring \\n
.This is for Exinix multiString,
and can be denoted as """

mulstr = '''This is a multistring
.This is for Exinix multiString,
and can be denoted as '''

\`\`\`


    `,
    codeExample : ``,
    codeExampleLang:'exinix'
};
export default syntax;