const recurssion = {
    id: "recursion",
    title: "Recursion in Exinix",
    content: `
# Recursion

Recursion is the technique of making a function call itself. This technique provides a way to break complicated problems down into simpler problems which are easier to solve.

Recursion may be a bit difficult to understand. The best way to figure out how it works is to experiment with it.


### Example
Adding two numbers together is easy to do, but adding a range of numbers is more complicated. In the following example, recursion is used to add a range of numbers together by breaking it down into the simple task of adding two numbers:
\`\`\`

fn sum(k:int):int{
    if (k > 0) {
      return k + sum(k - 1);
    } else {
      return 0;
    }

}

out(sum(10)) // output 55


\`\`\`

- Note : Parameter a or b are optional , and return type \`str\` are optional.



## Example Explained
When the sum() method is called, it adds parameter k to the sum of all numbers smaller than k and returns the result. When k becomes 0, the method just returns 0. When running, the program follows these steps:

#### 10 + sum(9)
#### 10 + ( 9 + sum(8) )
#### 10 + ( 9 + ( 8 + sum(7) ) )
...
#### 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 + sum(0)
#### 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 + 0
Since the method does not call itself when k is 0, the program stops there and returns the result.

## Halting Condition

Just as loops can run into the problem of infinite looping, recursive methods can run into the problem of infinite recursion. Infinite recursion is when the method never stops calling itself. Every recursive method should have a halting condition, which is the condition where the method stops calling itself. In the previous example, the halting condition is when the parameter \`k\` becomes \`0\`.

It is helpful to see a variety of different examples to better understand the concept. In this example, the method adds a range of numbers between a start and an end. The halting condition for this recursive method is when \`end\` is not greater than \`start\`:

\`\`\`

fn sum(int:start, int:end) : int {
    if (end > start) {
      return end + sum(start, end - 1);
    } else {
      return end;
    }
}

out(sum(5,10))

\`\`\`

- Be careful with recursion: it's easy to accidentally write a method that never stops or uses too much memory. But when written correctly, recursion can be both efficient and elegant.

## Example 2
\`\`\`


fn countdown(int:n) {
    if (n > 0) {
      out(n + " ");
      countdown(n - 1);
    }
}
out(countdown(5)); 
\`\`\`
- The method calls itself with \`n - 1\` until \`n\` becomes \`0\`.

## Factorial with Recursion

\`\`\`

fn factorial(n:int):int {
    if (n > 1) {
      return n * factorial(n - 1);
    } else {
      return 1;
    }
  }

out(factorial(5)) // 5! -> 120
\`\`\`



  `,
    codeExample : `

fn factorial(n:int):int {
    if (n > 1) {
      return n * factorial(n - 1);
    } else {
      return 1;
    }
  }

out(factorial(5)) // 5! -> 120
`,
    codeExampleLang:'exinix'

};
export default recurssion;