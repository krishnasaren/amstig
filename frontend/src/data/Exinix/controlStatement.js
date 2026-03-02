const controlStatement = {
    id: "controlStatement",
    title: "Control Statement in Exinix",
    content: `
# Control Statements

### Types
1. \`if\`
2. \`if\`...\`else\`
3. \`if\`...\`else if\`...\`else\`
4. \`select\`...\`option\`...\`default\`


### Syntax

\`\`\`exinix

if conditions{
    //action
}
//or
if conditions{
    //action
}else{
    //action
}
//or
if conditions{
    //action
}else if conditions{
    //action
}else{
    //action
}
//or

select variable {
    option 1:
        //action
        break
    option 2:
        //action
        break
    option 3:
        //action
        break
    default :
        //action
}

\`\`\`

## if Statement \`if\`
\`\`\`
a = 10
b : int = 10

if a > b{
    out("a is greter")
}
\`\`\`

## if..else Statement \`if\`...\`else\`
\`\`\`
a = 10
b : int = 10

if a > b {
    out("a is greter")
}else{
    out("b is greter")
}
\`\`\`

## if..else if...else Statement \`if\`...\`else if\`...\`else\`
\`\`\`
a = 10
b : int = 10

if a >= 20 {
    out("a is greater than 20")
}else if a >= 15{
    out("a is greater than 15")
}else{
out("a is less than 15")
}
\`\`\`

- Note: Ternary operator can be used as \`if\`...\`else\` shorthand
- Note : you can use \`()\` to define th condition like \`if (a=b)\`.This is optional

## select...option...default Statement \`select\`...\`option\`...\`default\`
\`\`\`
var a = 4

select a {
    option 1:
        out("day 1")
        break
    option 2:
        out("day 2")
        break
    option 3:
        out("day 3")
        break
    default :
        out("day 4")
}

\`\`\`




        `,
    codeExample: `
var a = 4

select a {
    option 1:
        out("day 1")
    option 2:
        out("day 2")
    option 3:
        out("day 3")
    default :
        out("day 4")
}


    `,
    codeExampleLang: 'exinix'

};

export default controlStatement;