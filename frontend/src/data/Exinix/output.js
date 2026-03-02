const output = {
    id : "output",
    title: "Output of Exinix",
    content  :`
# Exinix Output
    
## Output with multiple Data Types
\`\`\`exinix
a = 10
b : ptr[int] = &a //built i pointer class of int type

//or
out(b)//memory address of a

out(*b) // 10
out(10) //int
out("Hello, World!") // str
out('A') // char
out(True) //bool
out(1.23) //float
out(b) //ptr


\`\`\`


    `,
    codeExample : `
a = 10
var b = ptr(10) //pointer
//or
var b = &a
out(10) //int
out("Hello, World!") // str
out('A') // char
out(True) //bool
out(1.23) //float
out(b) //ptr

var myMember = mem(10,20)
out(myMember) //mem

var myColl = coll(20,45)
out(coll) //coll

company = {
    "name": "TechCorp",
    "employees": [
        {
            "name": "Alice",
            "age": 30,
            "roles": ["Developer", "Designer"],
            "projects": [
                {"name": "Website", "duration": "3 months"},
                {"name": "App", "duration": "6 months"}
            ]
        },
        {
            "name": "Bob",
            "age": 28,
            "roles": ["Tester"],
            "projects": [
                {"name": "API", "duration": "2 months"}
            ]
        }
    ]
}
var myColl = map(company)
out(myMap) //map()
    `,
    codeExampleLang:'exinix'
};
export default output;