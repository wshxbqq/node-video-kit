const util = require("../../../util");
const fs = require("fs");
const os = require("os");
const path = require("path");
const async = require("async");
const shelljs = require("shelljs");
const videokit = require("../../../videokit");
const ipc = window.ipc = require('electron').ipcRenderer;

const tmpDirRoot = path.join(os.tmpdir(), "ez_media");
let processing = false;


var app = new Vue({
    el: '#app',
    data: {
        videoSrc: "",
        currentTime: 0,
        duration: 0,
        start: 0,
        end: 0,
        timespan: 1,
        fileName: "img%05d.jpg",
    },
    methods: {
        autoshotclick(e) {
            processing = true;
            let tmpDir = path.join(tmpDirRoot, "video");
            shelljs.rm("-rf", tmpDir);
            shelljs.mkdir("-p", tmpDir);
            let outPutFullFileName = path.join(tmpDir, app.$data.fileName);
            videokit.video.autoVideoshot(app.$data.videoSrc, app.$data.timespan, outPutFullFileName).then(e => {
                ipc.send('open-file-dialog');
                processing = false;
            }).catch(e => {
                console.log(e);
                processing = false;
            });
        },
        durationchange(e) {
            app.$data.duration = ~~video.duration;
            app.$data.start = 0;
            app.$data.end = app.$data.duration;
        },
        removeFile: function (message, e) {
            let idx = app.$data.filesArr.indexOf(message);
            app.$data.filesArr.splice(idx, 1);
        }
    }
})

$(".drag-zone")
    .on("dragenter", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let file = e.originalEvent.dataTransfer.files[0];
        app.$data.videoSrc = file.path;

    });

ipc.on('selected-directory', function (event, p) {
    let tmpDir = path.join(tmpDirRoot, "video");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });


})