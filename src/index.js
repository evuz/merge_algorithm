const { mergeBackward } = require("./mergeBackward");
const { mergeForward } = require("./mergeForward");
const { mergeWithCursor } = require("./mergeWithCursor");
const { names, colors } = require("./data");

// const result = [
// {id: 1, name: 'madrid'},
// {id: 2, name: 'barcelona', color: 'blue'},
// {id: 4, color: 'red'},
// {id: 5, color: 'green'},
// {id: 6, name: 'sevilla'},
// {id: 9, name: 'alicante', color: 'red'},
// {id: 15, name: 'córdoba', color: 'yellow'},
// {id: 17, color: 'orange'},
// {id: 20, name: 'coruña'},
// {id: 24, name: 'almería', color: 'pink'},
// {id: 26, color: 'blue'},
// {id: 29, name: 'bilbao', color: 'yellow'},
// {id: 43, color: 'green'},
// ]

console.log(mergeForward(names.slice(), colors.slice()));
console.log(mergeBackward(names.slice(), colors.slice()));
console.log(mergeWithCursor(names.slice(), colors.slice()));
