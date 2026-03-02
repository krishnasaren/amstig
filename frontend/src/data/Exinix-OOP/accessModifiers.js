const accessModifiers =  {
    id: 'accessModifier',
    title: 'Access Modifier in Exinix',
    content: `
# Access Modifier

## Types
1. Access Modifier ==Control visibility (who can access)==
2. Non-Access Modifier ==Change behavior (lifecycle, usage, threading, inheritance)==

- Note : Access Modifier ==Who can do (Visibility)==
- Non-Access Modifier == What can do ( Action/behaviour after visibility)==

#### Syntax
\`\`\`
(symbol)VarName : type //var declare
cls (symbol)ClassName{} //class declare
fn (symbol)functionName(){} // function declare

\`\`\`

### Access Modifiers
Responsible for Visibility


|Types| Symbol | Usage | Example|
|-----|--------|--------|---------|
| \`public\`| ==nothing==| everything is public by default, anyone can access | \`cls myClass{}\`|
| \`private\`| \`$\`| Accessible only inside module/class | \`cls $myClass{} $name:str = "Alice"\`|
| \`protected\`| \`@\`| Accessible only inside sub-classes after inherit | \`@name:str = "Alice"\`|

### Non-Access Modifiers
Responsible for behaviour


|Types| Symbol | Usage | Example|
|-----|--------|--------|---------|
| \`static\`| ==nothing==| means this is directly to a class, not obtain for object| \`static name:str\`|
| \`final\`| \`!!\`| can't be modified after initialization(variable) or can't be inherit (class) | \` !!name:str = "Alice"\`|
| \`synchronized\`| \`sync\`| usage for thread safety, variable can be accessible by single thread at multithreading  | \`sync name:str = "Alice"\`|
| \`volatile\`| \`volatile\`| usage for thread safety, variable value not read from thread cache , read from main memory and then propagate to all thread  | \`volatile name:str = "Alice"\`|
| \`transient\`| \`transient\`| Used to ignore an attribute when serializing an object | \`transient name:str = "Alice"\`|
| \`native\`| \`native\`| declares a method as belonging to an external compiled library which is native to the operating system | \`native fn test(){}\`|

### Classes
#### For Outer Class
- Public
- \`final\` - final

#### For inner Class
- Public 
- \`$\` - Private
- \`@\` - Protected

### Variable
- Public
- \`final\`
- \`static\`
- \`$\`
- \`@\`
- \`volatile\`
- \`synchronized\`
- \`transient\`

### Methods
- Public
- \`final\`
- \`static\`
- \`$\`
- \`@\`
- \`native\`








        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default accessModifiers;