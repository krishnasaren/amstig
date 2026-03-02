export const datatypes = {
    id : "datatypes",
    title : "Exinix Datatypes",
    content : `
    # Exinix Datatypes




## Primitive

| byte     | short   | int    | long   |
| float    | double    | bool  | char   |

## Non Primitive
---
| ptr     | str     | array   | mem     |
| coll    | set     | map     |   obj    |

---
## Details
| Type | Size (bits/bytes) | Range/Capacity | Remarks | 
|------|------|---------|--------|
| \`byte\`     | 8/1   | -128 to 127   | Store Whole Number|
| \`short\`   | 16/2   | -32768 to 32767  | Store Whole Number| 
| \`int\`   | 32/4   | - 2<sup>32</sup> to ( 2<sup>32</sup> - 1 )  | Store Whole Number| 
| \`long\`   | 64/8   | - 2<sup>64</sup> to ( 2<sup>64</sup> - 1 )  | Store Whole Number. \`l\` suffix |
| \`float\`   | 32/4   | ±3.40282347 × 10³⁸   | upto 7 decimal precision fractional number. \`f\` suffix| 
| \`double\`   | 64/8   | ±1.7976931348623157 × 10³⁰⁸  | upto 16 decimal precision fractional number. \`d\` suffix|
| \`char\`   | 16/2   | 0 - 65535  | Store single character |
| \`bool\`   | 8/1   | \`True\`/\`False\`  | logical values |

- \`array\` : Fixed Length (NO Limit)
- \`mem\` : Not Fixed Length (NO Limit)
- \`coll\` : Not Fixed Length (NO Limit)
- \`set\` : Not Fixed Length (NO Limit)
- \`map\` : Not Fixed Length (NO Limit)
- \`obj\` : Not Fixed Length (NO Limit)
- \`str\` : Not Fixed Length (NO Limit)
- \`ptr\` : Depend on Arch. 32 bits(~ 4GB = 0xFFFFFFFF) or 64 bits( ~ 16EB = 0xFFFFFFFFFFFFFFFF)



    
    `,
    codeExample : ``,
    codeExampleLang:'exinix'
}