<!--
  Mega Markdown Formatting Reference
  Covers: GFM, Extended Syntax, HTML, Math, Diagrams, Lists, Links, Code, etc.
-->

# H1 – Main Title
Short paragraph with a  
soft line break (two spaces)  
and a hard line break (blank line below).

## H2 – Text Styles

- **Bold**
- *Italic*
- ***Bold + Italic***
- ~~Strikethrough~~
- <u>Underline (HTML)</u>
- <mark>Highlight (HTML)</mark>
- <sup>Superscript</sup> and <sub>Subscript</sub>
- `Inline code` and ``double backticks``
- Escaping: \*escaped asterisk\*

---

## H2 – Blockquotes

> Single-level blockquote with **formatting**.
>> Nested quote level 2 with *italic*.

---

## H2 – Lists

### Unordered:
- Item 1
    - Nested Item
        - Third Level
- Item 2

### Ordered:
1. Step One
2. Step Two
    1. Sub-step A
    2. Sub-step B

### Mixed:
- Point
1. Ordered inside unordered
2. Still works

### Task List:
- [x] Done
- [ ] Pending
- [ ] Task with `inline code`

---

## H2 – Links

- Inline: [OpenAI](https://www.openai.com "Hover Title")
- Reference: [GitHub][github]
- Autolink: <https://example.com>
- Email: <me@example.com>

---

## H2 – Images

Inline image:  
![Random placeholder](https://picsum.photos/800/200 "Placeholder Image")

Reference image:  
![Ref Img][img]

Clickable image link:  
[![Clickable](https://picsum.photos/300/100)](https://example.com)

---

## H2 – Tables

| Left Align | Center Align | Right Align |
|:-----------|:------------:|------------:|
| Text       | Text         | Text        |
| **Bold**   | *Italic*     | `Code`      |

---

## H2 – Code Blocks

Inline: `print("Hello")`

Fenced with language:
```python
def hello(name):
    return f"Hello, {name}"
print(hello("World"))
