const enums = {
    id: 'enums',
    title: 'Enums in Exinix',
    content: `
# Enums

An \`enum\` is a special "class" that represents a group of constants (unchangeable variables, like final variables).

To create an enum, use the \`enum\` keyword (instead of class or interface), and separate the constants with a comma.

### Syntax

\`\`\`
enum enumName {
  LOW,
  MEDIUM,
  HIGH
}


\`\`\`
## Example

\`\`\`

enum Level{
    easy,
    medium,
    high
}
a : Level = Level.easy
out(a)
//output easy


\`\`\`

### Important Notes
- An \`enum\` can, just like a class, have attributes and methods. 
- The only difference is that enum constants are public, static and final (unchangeable - cannot be overridden).

- An \`enum\` cannot be used to create objects, and it cannot extend other classes (but it can implement interfaces).

### Enum class default Methods
1. \`values\` - help-full for iteration

### With Constructure
\`\`\`
enum level{
    //constants
    easy("Easy level"),
    medium("Medium level"),
    high("High level")
    
    //variable
    $des : str
    (des){
        __.des = des
    }
    fn getDes(){
        return des
    }
    
    
    
}

a : level = Level.easy
b : level = Level.medium

out(a.getDes())
//Easy level
out(b.getDes())
//medium level
\`\`\`

### Iterations in Enum
\`\`\`
for a: level <> level.values(){
    out(a.getDes())
    //Easy level
    //Medium level
    //High level
}
\`\`\`

### Setter
- That also works but not recommended
\`\`\`

enum level{
    //constants
    easy("Easy level"),
    medium("Medium level"),
    high("High level")
    
    //variable
    $des : str
    (des){
        __.des = des
    }
    fn getDes(){
        return des
    }
    fn setDes(a:str){
        __.des = a
    }
    
    
    
}

a : level = Level.easy
out(a.getDes())
//Easy level
a.setDes("Level 0")
out(a.getDes())
//Level 0
\`\`\`













 `,
    codeExample: `
enum level{
    //constants
    easy("Easy level"),
    medium("Medium level"),
    high("High level")
    
    //variable
    $des : str
    (des){
        __.des = des
    }
    fn getDes(){
        return des
    }
    fn setDes(a:str){
        __.des = a
    }
    
    
    
}

a : level = Level.easy
out(a.getDes())
//Easy level
a.setDes("Level 0")
out(a.getDes())
//Level 0

`,
    codeExampleLang:'exinix'
};

export default enums;