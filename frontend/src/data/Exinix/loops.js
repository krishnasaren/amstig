const loops = {
    id :"loops",
    title : "Loops in Exinix",
    content : `
# Loops

### Types
1. \`do\`...\`while\`
2. \`while\`
3. \`for\`

### Syntax

\`\`\`exinix

while conditions{
    //action
}
//or
do{
    //action
}while conditions

//or
for assign /args, condition,step {
    //action
}
\`\`\`

## do...while loop \`do\`...\`while\`
\`\`\`
a = 0

do {
    out(a) //0 1 2 3 4
    a++
}while a < 5

\`\`\`

- Note : \`do\`...\`while\` first action then check conditon,if conditions true then enter into loop

## while loop \`while\`
\`\`\`
a = 0
while a < 5 {
    out(a) //0 1 2 3 4
    a++
}
\`\`\`

## for loop \`for\`
\`\`\`
for i = 0, i< 5, i++{
    out(i) //0 1 2 3 4

}

\`\`\`

## foreach loop \`foreach\`
\`\`\`
foreach i : numbers {
    out(i) //0 1 2 3 4
}

\`\`\`













        `,
    codeExample: `
for var i = 0, i< 5, i++{
    out(i) //0 1 2 3 4

}

    `,
    codeExampleLang:'exinix'

};

export default loops;

