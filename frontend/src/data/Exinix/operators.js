const operators = {
    id :"operators",
    title : "Operator in Exinix",
    content : `
# Operators

## Arithmetic Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`+ \`   | Addition  | Add Values |
| \`-\`   | Subtraction  | Subtract Values |
| \`*\` | Multiplication | Multiply Values |
| \`/\` | Division | Divide Values | 
| \`//\` | Floor Division | Integer Quotient |
| \`%\` | Modulus | Reminder Values |
| \`**\` | Exponent | Exponent(power) Values |
|\`++\`| Increment | Increment Values |
|\`--\`|Decrement | Decrement Values |

---

## Assignment Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`= \`   | Assign  | Assign Values |
|\`?=\`| Maybe  Asignment | Assign Values if values is \`null\`, otherwise skip|
| \`+=\`   |  Addition Assignment | Addition of two operands and assign to left Operand |
| \`-=\` | Subtraction Assignment | Subtraction of two operands and assign to left Operand |
| \`*=\` | Multiplication Assignment | Multiply of two operands and assign to left Operand | 
| \`/=\` | Division Assignment| Division of two operands and assign to left Operand |
| \`//=\` | Floor Division Assignment | Floor Division of two operands and assign to left Operand |
| \`%=\` | Modulus Assignment | Modulus of two operands and assign to left Operand |
| \`**=\` | Exponent Assignment | Exponent of two operands and assign to left Operand|
|\`&=\`| Bitwise AND Assignment | Bitwise AND Operation of two operands and assign to left Operand |
|\`|=\`| Bitwise OR Assignment | Bitwise OR Operation of two operands and assign to left Operand |
|\`^=\` | Bitwise XOR Assignment | Bitwise XOR Operation of two operands and assign to left Operand |
|\`<<=\`| Left Shift Assignment| LeftShift Operation of two operands and assign to left Operand |
|\`>>=\`|Right Shift Assignment | Right Shift Operation of two operands and assign to left Operand |



## Comparison Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`== \`   | Equal to  | Check Equality |
| \`!=\`   | Not Equal to | Check Equality |
| \`>\` | Greater Than | Check Greater |
| \`<\` | Less Than | Check Less | 
| \`>=\` | Grater Equal | Check Greater or Equal |
| \`<=\` | Less Equal | Check Less or Equal |


## Identity Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`===\`   |  - | Return True is object refer to Same Memory ,Memory level comparison|
| \`!===\`   | - | Return True is object is not refer to Same Memory, Memory level comparison|


---
## Bitwise Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`&\`   | Bitwise AND  | Bitwise AND |
| \`|\`   | Bitwise OR | Bitwise OR |
| \`^\` | Bitwise XOR | Bitwise XOR |
| \`~\` | Bitwise NOT  | Flip All Bits | 
| \`<<\` | Left Shift | Push bits left  |
| \`>>\` | Right Shift |  Push bits Right|


## Logical Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`&&\`   | Logical AND  | Logical AND |
| \`||\`   | Logical OR | Logical OR |
| \`!\` | Logical NOT | Logical NOT |

## Membership Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`<>\`   | in  | Return True is object is present |
| \`!<>\`   | not in | Return True is object is not present |


## Ternary Operators
|Operator | Name | Description |
|--------|---------|-----------|
| \`? :\`   | Ternary | Shorthand of if...else|

### Example of Ternary Operators
\`expression\` ? \`True Value\` : \`False Value\`
\`\`\`exinix
a = 100
b = a > 100 ? 200 : 300
out(b) //300
\`\`\`




## Operator Precedence
##### Operator precedence describes the order in which operations are performed.
\`()\`,\`**\`,\`+x\`,\`-x\`, \`~x\`,\`*\`,\`/\`,\`//\`,\`%\`,\`+\`,\`-\`,\`<<\`,\`>>\`,\`&\`,\`^\`,\`|\`,\`==\`,\`!=\`,\`>\`,\`>=\`,\`<\`,\`<=\`,\`===\`,\`!==\`,\`<>\`,\`!<>\`,\`!\`,\`&&\`,\`||\`









        `,
    codeExample: `
var name = "Alice"        // String
name =  10 //error not allowed
name = "Bob" //allowed

var age = 25
age = 225.7 // cause Error types mismatch
age : float = 225.7 // Allowed Implicit type cast
age : float = (float) 225.7 //Allowed Explicit type cast


    `,
    codeExampleLang:'exinix'
};

export default operators;