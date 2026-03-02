const arrays = {
    id :"arrays",
    title : "Arrays in Exinix",
    content : `
# Arrays




### Syntax

### Instant Assignment of Value
\`varName\` : \`type[size](optional)\` = \`{value}\`

## Declare later assignment
\`varName\` : \`type[size]\`

\`\`\`
name : int = {1,2,3,4,5}
name[0] = 2

or 

name:int[5]
name = {1,2,3,4,5} //cause error must be init during declaration
name[0] = 1
name[1] = 2
name[2] = 3
name[3] = 4
name[4] = 5
\`\`\`
## Rules:

- Array Has Fixed Size, can't be added/removed
- Array item can be accessed/changed by its index
- Array element size can be varied , if you not fixed the size (Jagged Array)
- Needs to be in same data types


## Jagged Array
==works only if you not assign the sized, if you assign the size then it failed==

\`\`\`

arra : in = {{1,2},{1,2,6}} //  allowed
//or
arr : int[2][3]
arr = {{1,2},{1,2,6}} // allowed
 



\`\`\`

## Multidimensional Arrays

\`\`\`exinix

name = {{1,2},{3,4}}
//or
name : int[2][3][2]
name = {{{1,2},{3,4},{2,5}},{{0,2},{3,7},{9,5}}}


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

export default arrays;

