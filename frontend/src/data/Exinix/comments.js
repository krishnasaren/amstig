const comments = {
    id : "comments",
    title: "Comments",
    content :  `
# Exinix comments

- Use \`//\` for single line comment
- Use \`---\` at start and \`---\` at end for multi line comments

## Comments
\`\`\`exinix
//this is a comment
---This is Multi-line comment.
var b = &a
out(10) //int
out("Hello, World!") // str
out('A') // char
out(True) //bool
out(1.23) //float
out(b) //ptr
---

\`\`\`

`,
    codeExample : `
//this is a comment
--- This is Multi-line comment.
var b = &a
out(10) //int
out("Hello, World!") // str
out('A') // char
out(True) //bool
out(1.23) //float
out(b) //ptr
---

`,
    codeExampleLang : 'exinix'



};
export default comments;