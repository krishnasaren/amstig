const classObject = {
    id: 'classandobject',
    title: 'Classes and Object in Exinix',
    content: `
# Class


### Types
1. General
2. Abstract
3. Interface
4. Anonymous
5. Enum

Exinix is an object-oriented programming language.
Everything in Java is associated with classes and objects, along with its attributes and methods. For example: in real life, a car is an object. The car has attributes, such as weight and color, and methods, such as drive and brake.
A Class is like an object constructor, or a "blueprint" for creating objects.

## Create a Class
- To create a class you need to use \`cls\` keywords

### Syntax

\`\`\`exinix
cls Main{
    //by default this is public class

}

\`\`\`

## Create Object

In Exinix, an object is created from a class. We have already created the class named ==Main==, so now we can use this to create objects.

To create an object of ==Main==, specify the Object name and reference type

### Example

\`\`\`
cls Main{
    x:int = 10;
    fn show {
        out("This is Class Method")
    }

}

object : Main = Main()


\`\`\`

## Multiple Object

\`\`\`
cls Main{
    x:int = 10;
    fn show {
        out("This is Class Method")
    }

}

object : Main = Main()
object2 : Main= Main()


\`\`\`

## Class in different File
1. second.xn

\`\`\`
cls myClass{
    x:int = 10;

}

\`\`\`

2. Main.xn

\`\`\`

use myclass from second
cls myClass{
    x:int = 10;

}

\`\`\`

## Rules for Class names
- Names can contain letters, digits, underscores(only underscore)
- Names must begin with a letter or \`_\`
- Names cannot contain whitespace
- Names are case-sensitive ("myVar" and "myvar" are different variables)
- Reserved words (such as \`int\` or \`bool\`) cannot be used as names

        `,
    codeExample: `


`,
    codeExampleLang:'exinix'
};

export default classObject;