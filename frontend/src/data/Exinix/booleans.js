const booleans = {
    id :"booleans",
    title : "Boolean in Exinix",
    content : `
# Boolean

##### In Exinix \`bool\` are  used to store \`True\` or \`False\` value.
- \`==\` Compare Value
- \`===\` Compare with Type



## Example
\`\`\`exinix

a = 100
b = 100
out(a==b) //True
out(a===b) //True


out(a instanceof int) //True
\`\`\`









        `,
    codeExample: `
var a = 100
var b = 100
out(a==b) //True
out(a===b) //True


out(a instanceof int) //True


    `,
    codeExampleLang:'exinix'

};

export default booleans;