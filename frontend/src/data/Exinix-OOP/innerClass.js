const innerClass = {
    id: 'innerClass',
    title: 'Inner Class in Exinix',
    content: `
# Inner Class

In Exinix, it is also possible to nest classes (a class within a class). The purpose of nested classes is to group classes that belong together, which makes your code more readable and maintainable.

To access the inner class, create an object of the outer class, and then create an object of the inner class:

### Example

\`\`\`

cls OuterClass {
  x:int = 10

  cls InnerClass {
    y:int = 5
  }
  cls static StaticInnerClass {
    z:int = 100
  }
  cls $pvtClass{
    p : int = 100
  }
}

outer : OuterClass = OuterClass()
//create outer object
inner : InnerClass = outer.InnerClass()
//create inner class object
out(inner.y)//access innerclass y
//or
out(OuterClass().InnerClass().y)
//access innerclass y

//Access Static inner Class
staticInner : StaticInnerClass = outer.StaticInnerClass()
// not allowed
---because static object belongs to class not any object,
here outer is and object of OuterClass---
staticInner : StaticInnerClass = OuterClass.StaticInnerClass()
 // Allowed
 
 out(OuterClass().pvtClass().p)
 //error cant access private class
 



\`\`\`










 `,
    codeExample: `

cls OuterClass {
  x:int = 10

  cls InnerClass {
    y:int = 5
  }
  cls static StaticInnerClass {
    z:int = 100
  }
  cls $pvtClass{
    p : int = 100
  }
}

outer : OuterClass = OuterClass()
//create outer object
inner : InnerClass = outer.InnerClass()
//create inner class object
out(inner.y)//access innerclass y
//or
out(OuterClass().InnerClass().y)
//access innerclass y

//Access Static inner Class
staticInner : StaticInnerClass = outer.StaticInnerClass()
// not allowed
---because static object belongs to class not any object,
here outer is and object of OuterClass---
staticInner : StaticInnerClass = OuterClass.StaticInnerClass()
 // Allowed
 
 out(OuterClass().pvtClass().p)
 //error cant access private class


`,
    codeExampleLang:'exinix'
};

export default innerClass;