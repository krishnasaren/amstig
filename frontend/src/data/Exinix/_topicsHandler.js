// src/data/topics/exinix-basics/index.js
import introduction from "./introduction";
import variables from "./variable";
import syntax from "./syntax";
import output from "./output";
import comments from "./comments";
import {keywords} from "./keywords";
import {datatypes} from "./datatypes";
import typecast from "./typecast";
import operators from "./operators";
import strings from "./strings";
import booleans from "./booleans";
import c_if_else   from "./controlStatement";
import loops from "./loops";
import breaks from "./breaks";
import arrays from "./arrays";
import coll from "./coll";
import sets from "./sets";
import map from "./map";
import pointers from "./pointers";


const exinixBasics = {
    id: "exinix-basics",
    title: "Exinix Basics",
    icon: "🚀",
    description: "Learn the fundamentals of Exinix programming",
    subtopics: [introduction,syntax,output,comments,keywords,datatypes, variables, typecast,operators,strings,booleans,
        pointers, c_if_else,loops,breaks,arrays,coll,sets,map]  // gathered here
};

export default exinixBasics;
