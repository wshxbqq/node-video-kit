"use strict";
const util = window.top.require("./lib/util");
const fs = window.top.require("fs");
const os = window.top.require("os");
const path = window.top.require("path");
const async = window.top.require("async");
const shelljs = window.top.require("shelljs");

var app = window.top.v = new Vue({
    el: '#dragZone',
    data: {
        ss: false,
        filesArr: []
    },
    methods: {
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

        var files = e.originalEvent.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            let f = files[i];

            if (!app.$data.filesArr.indexOf(f.path) > -1 && fs.statSync(f.path).isFile()) {
                app.$data.filesArr.push({
                    path: f.path,
                    stat: 0,
                });
            }
        }
    });
$("#start").on("click", function (e) {
    window.top.processing = true;
    let task;
    let fileNameInp = $("#fileName").val();
    let targetType = $("#targetType").val();
    let sameDirCkb = $("#coverCkb")[0];
    $(".file-p").removeClass("success").removeClass("failed");
    let tmpDir = path.join(window.top.tmpDir, "video");
    shelljs.rm("-rf", tmpDir);
    shelljs.mkdir("-p", tmpDir);
    let outPutFullFileName = path.join(tmpDir, fileNameInp) + '.' + targetType;
    window.top.videokit.video.concat(app.$data.filesArr, outPutFullFileName).then(e => {
        window.top.ipc.send('open-file-dialog');
        window.top.processing = false;
    }).catch(e => {
        console.log(e);
        window.top.processing = false;
    });
});


$("#reset").on("click", function (e) {
    app.$data.filesArr.splice(0, app.$data.filesArr.length);
});

window.top.ipc.removeAllListeners("selected-directory");
window.top.ipc.on('selected-directory', function (event, p) {
    let tmpDir = path.join(window.top.tmpDir, "video");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });


})