const strings = {
    id :"strings",
    title : "Strings in Exinix",
    content : `
# Strings

##### In Exinix \`str\` are generally used to store text.

## Types
1. Mutable(Elements)
2. Immutable (Elements)

## Mutable (using array)
\`\`\`exinix
text = {'H','e','l','l','o'} 
or 
text : char[5]
text = {'H','e','l','l','o'}
text[0] = 'A'
out(text) // Aello
\`\`\`

### Immutable (using \`str\` or \`ptr\`)

\`\`\`exinix
name = "Bob"
name[0] = 'C' //now allowed error
out(name) // Bob

//OR

name : str = "Bob"
name[0] = 'C' //now allowed error
out(name) // Bob

//OR
name : ptr = "Hello"
name[0] = "A" //error
out(name) // Hello

\`\`\`



==Why Mutable and Immutable Matters==

\`\`\`exinix
//Imutable
name = "Bob"
name2 = "Bob"

out(name == name2) //True
name = name2
out(name == name2) //True

//Also
out(name === name2) //True

//But 
//Mutable
var a = {1,2,3}
var b = {1,2,3}

out(a==b) // True
out(a===b) // False ,

\`\`\`

- **Note** : \`str\` are mutable/immutable in exinix , depends how you declare a String.
- For Mutable : \`==\` and \`===\` will be different for \`str\`
- For Immutable : \`==\` and \`===\` will be same for \`str\`

**Note** : \`==\` and \`!=\` used for value level, and \`===\` and \`!==\` for memory level comparison.











        `,
    codeExample: `
var text : char[5] = ['H','e','l','l','o']
text[0] = 'A'
out(text) // Aello


    `,
    codeExampleLang:'exinix'

};

export default strings;