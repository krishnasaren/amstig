const wrapperClass = {
    id: 'wrapper',
    title: 'Wrapper in Exinix',
    content: `
# Wrapper Class

Wrapper classes provide a way to use primitive data types (\`int\`, \`bool\`, etc..) as objects.

The table below shows the primitive type and the equivalent wrapper class:

|Type | Wrapper Class|
|----|---------|
|byte | Byte|
|short | Short|
|int| Integer|
|long | Long|
|float | Float|
|double | Double|
|bool | Boolean|
|char | Character|

## Primitive Type
- **Performance**: Fast
- **Methods support**: ❌
- **Can be null**: ❌
- **Use in Collections**: ❌
- **Autoboxing required?** : ❌

## Primitive Type with Wrapper Class
- **Performance**: Slightly Slower
- **Methods support**: ✅
- **Can be null**: ✅
- **Use in Collections**: ✅
- **Autoboxing required?** : ✅

## Why ? 
- Flexibility
- Get usefull methods \`intValue\`, \`parseInt\`,\`compare\` etc
















 `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default wrapperClass;