const classattribute = {
    id: 'classattribute',
    title: 'Attributes in Class',
    content: `
# Class Attributes


## Create a Class
- To create a class you need to use \`cls\` keywords
- Attributes of class tell programms that what a class have the value.

### Syntax

\`\`\`exinix
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True

}

\`\`\`

- Here ==x==,==y==, ==z== are attributes

## Access Attributes

### Example

\`\`\`
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True

}

object : Main = Main()
out(object.x) // 10
out(object.y) // Bob


\`\`\`

## Modify Attributes

\`\`\`
cls Main{
    x:int = 10
    y : str = "Bob"
    z : bool = True

}

object : Main = Main()
object2 : Main= Main()

object.x = 20
object2.x = 100



\`\`\`
- Note : attributes a shared through different object .now the attributes have different value



        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default classattribute;