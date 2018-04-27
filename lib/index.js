const videokit = require("./videokit");
const child_process = require('child_process');
const path = require("path");


let inp = path.normalize(path.join(__dirname, "../1.mp3"));
let oup = path.normalize(path.join(__dirname, "../out2.aac"));


console.log(inp);
console.log(oup);
videokit.audio.converter(inp, oup);





window.ipc.on('selected-directory-audio', function (event, p) {
    let tmpDir = path.join(window.top.tmpDir, "audio");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });
})

window.top.ipc.on('selected-directory-video', function (event, p) {
    alert(11);
    let tmpDir = path.join(window.top.tmpDir, "video");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });
})


