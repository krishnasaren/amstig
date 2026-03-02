const errorHandling = {
    id : "errorhandling",
    title: "Errors Handling",
    content  :`
# Errors Handling

### How ? 

- With \`try\`...\`catch\`...\`else\`...\`fallback\`
- With \`interrupt\` 

- **Note** : \`else\` and \`fallback\` are optional

## When 
This will tell you the runtime error by this 

## Errors Handling


\`\`\`

try{
    a:int = 10
    b : int= a/0 // get error can be divided by Zeror
}catch Error as e{
  //Handle Error
}catch IOError as e{
}else{
    //run this when there is no error
}fallback{
    //by default run no matter code has error or not

}


\`\`\`
- Note : \`Error\` class holds multiple type of error like \`IOError\`,\`NullPointerError\`, \`FileNotFoundError\`,\`ArithmaticError\` etc
- \`catch\` can be used multiple time to detect multiple errors

### With \`interrupt\` keyword

\`\`\`

interrupt Error("Stop Execution!") //immediately stop Execution!


\`\`\`





    `,
    codeExample : `
try{
    a:int = 10
    b : int= a/0 // get error can be divided by Zeror
}catch Error as e{
  //Handle Error
}catch IOError as e{
}else{
    //run this when there is no error
}fallback{
    //by default run no matter code has error or not

}

`,
    codeExampleLang:'exinix'
};
export default errorHandling;