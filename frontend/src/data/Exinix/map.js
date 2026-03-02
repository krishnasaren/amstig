const map = {
    id :"map",
    title : "Map in Exinix",
    content : `
# Map

Set is container that can hold any type of data with any type.This is built-in class.

### Syntax

\`varName\` : \`type(optional)\` = \`coll()\`

\`varName\` : \`type(optional)\`

\`\`\`
name : coll = coll(1,2,3,4)
//or
name : coll

name.add(1)
out(name.get(1))

\`\`\`
## Rules:

- There are no specific rules 
- This is ordered, 
- Changeable
- Duplicate allowed
- Contain any data types


## Colletion method
- \`add()\` : Add item
- \`remove()\` : remove item
- \`get(index)\` : Access item
- \`update(index,val)\` : update item
- \`join()\` : join collection

## Unpacking/Copying Collection
\`\`\`
vc : coll = coll(1,2,3,4)
((a,b,c,d),_,_)= vc
\`\`\`


        `,
    codeExample: `
for var i = 0, i< 5, i++{
    if i = 1 {
        break // output will be 0 only
    }
    out(i) //0 1 2 3 4

}

    `,
    codeExampleLang:'exinix'

};

export default map;

