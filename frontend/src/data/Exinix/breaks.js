const breaks = {
    id :"break",
    title : "break/next in Exinix",
    content : `
# break and next

Usable only side a loops , in other area it may raise error.

### Break Keyword
- Note : \`break\` keyword often used for break the loop

### Next Keyword
- Note : \`next\` keyword often used for skip the action (No Action)

#### Break Example
\`\`\`exinix
for i = 0, i < 5, i++{
    if i = 1 {
        break // output will be 0 only
    }
    out(i) //0 1 2 3 4

}

\`\`\`

#### Next Example
\`\`\`exinix
for i = 0, i < 5, i++{
    if i = 1 {
        next // skip to rest action, move to next itteration
    }
    out(i) //0 1 2 3 4

}

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

export default breaks;

