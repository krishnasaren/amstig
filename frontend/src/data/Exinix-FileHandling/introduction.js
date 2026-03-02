const introduction = {
    id : "fileintroduction",
    title: "Introduction",
    content  :`
# File Operation

File handling is an important part of any application.

Exinix has several methods for creating, reading, updating, and deleting files and others

### How
##### By built-in \`fopen\` method, that return a File Object


## Syntax
\`fopen(fileName, operationMode)\`

## Operation Mode
1. \`r\` : Read only. File must exist .default mode
2. \`w\` : Write only. Creates new file if missing, overwrites existing.
3. \`a\` : Write only. Creates file if missing, appends if exists.
4. \`r+\` : Read + write. File must exist. Cursor starts at beginning.
5. \`w+\` : Read + write. Truncates file to zero length.
6. \`a+\` : Read + write. Cursor moves to end before writing.
7. \`rb\` : Read raw bytes.
8. \`wb\` : Write raw bytes. Truncate existing or create new.
9. \`ab\` : Append raw bytes to file.
10. \`rb+\` : Read + write raw bytes.
11. \`wb+\` : Read + write, reset file first.
12. \`ab+\` : Read + append raw bytes.

## File Object Method
- \`read()\` - read
- \`write()\` - write
- \`fname()\` - retun file name
- \`fpath()\` - retun path
- \`fabsPath()\` - retun Absolute path
- \`length()\` - file Length
- \`delete()\` - delete file 
- \`exists()\` - exists of file







    `,
    codeExample : `
a : file = fopen("data.txt" , "r")
out(a.length())

`,
    codeExampleLang:'exinix'
};
export default introduction;