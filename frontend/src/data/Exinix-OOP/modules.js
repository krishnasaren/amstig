const modules = {
    id: 'modules',
    title: 'Modules in Exinix',
    content: `
# Modules


### Types
- Built-in Packages (packages from the Exinix API)
- User-defined Packages (create your own packages)

### Use a Module
\`\`\`

use['math','folder1.file1','folder3.*'](
    sqrt as st,
    add as ad,
    mul as ml
)
//or 

use math (sqrt as st)
//or 
use math (*)


\`\`\`


#### Explaination

\`use\` \`moduleName\` (\`classes\` and \`methods\`)
- module name : ==exinix.io.math== ,Here \`exinix\` is folder and \`io\` is subfolder and \`math\` is actual module
        `,
    codeExample: `
cls myClass:
    $name:str
    $age:age
    
    fn setName(name){
        __.name = name
    }
    fn getName(){
        return name
    }
obj: myClass = myClass()
obj.name // error
obj.setName("BOB")
obj.getName() //BOB


`,
    codeExampleLang:'exinix'
};

export default modules;