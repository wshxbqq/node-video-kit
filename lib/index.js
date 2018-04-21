const videokit = require("./videokit");
const child_process = require('child_process');
const path = require("path");


let inp = path.normalize(path.join(__dirname, "../1.mp3"));
let oup = path.normalize(path.join(__dirname, "../out2.aac"));


console.log(inp);
console.log(oup);
videokit.audio.converter(inp,oup);


