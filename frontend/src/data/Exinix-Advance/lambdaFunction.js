const lambdaFunction = {
    id: 'lambdaFunction',
    title: 'Lambda Function in Exinix',
    content: `
# Lambda Function

Simplest form of function

### Syntax

\`\`\`
(args,args) => {action}
//or
(*args) => {action}
/or
(**args) = {action}


\`\`\`
## Variable Declaration

\`\`\`

a : int= (x,y) =>  x+y
out(a(10,20))
//30


\`\`\`

## Example with Interface
\`\`\`
imu inter{
    fn add(a,b)
}
fn result(a,b, in :inter){
    res : int = inter.add(a,b)
    out(res)
}

ad : inter = (a,b) => a+b
result(10,20,ad)

\`\`\`














 `,
    codeExample: `
a : int= (x,y) =>  x+y
out(a(10,20))
//30



`,
    codeExampleLang:'exinix'
};

export default lambdaFunction;