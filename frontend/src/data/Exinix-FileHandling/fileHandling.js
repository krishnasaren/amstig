const fileHandling = {
    id : "filehandling",
    title: "File Handling",
    content  :`
# File Operation

## Read

\`\`\`

a : file = fopen("data.txt" , "r")
out(a.read())

\`\`\`

---
## Write

\`\`\`

a : file = fopen("data.txt" , "w")
out(a.write("This is the content!"))

\`\`\`

## Append

\`\`\`

a : file = fopen("data.txt" , "a")
out(a.append("This is the content!"))
\`\`\`

## File Length

\`\`\`

a : file = fopen("data.txt" , "r")
out(a.length())

\`\`\`

## Exists

\`\`\`

a : file = fopen("data.txt" , "r")
out(a.exists()) // True or False


\`\`\`

## Delete

\`\`\`

a : file = fopen("data.txt" , "w")
a.delete()
\`\`\`

## Info

\`\`\`

a : file = fopen("data.txt" , "r")
out(a.fname()) // data.txt
out(a.fpath()) // /var/info/data.txt
out(a.fabsPath()) //  C://Desktop/var/info/data.txt


\`\`\`







    `,
    codeExample : `

a : file = fopen("data.txt" , "r")
out(a.fname()) // data.txt
out(a.fpath()) // /var/info/data.txt
out(a.fabsPath()) //  C://Desktop/var/info/data.txt

`,
    codeExampleLang:'exinix'
};
export default fileHandling;