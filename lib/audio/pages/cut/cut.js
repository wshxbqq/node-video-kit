"use strict";
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
const audio = window.audio = document.createElement("audio");
let $range;
audio.addEventListener("durationchange", function (e) {
    app.$data.duration = ~~audio.duration;
    $(".control-zone").html(`<input type="hidden" class="range-slider" value="10" />`);
    console.log(app.$data.duration);
    $range = window.top.$range = $('.range-slider').jRange({
        from: 0,
        to: app.$data.duration,
        step: 1,
        scale: [0, app.$data.duration],
        format: '%s',
        width: 300,
        showLabels: true,
        isRange: true,
        ondragend: function (e) {
            app.$data.start = e.split(',')[0];
            app.$data.end = e.split(',')[1];
            audio.currentTime = app.$data.start;
            audio.play();
        },
        onbarclicked: function (e) {
            app.$data.start = e.split(',')[0];
            app.$data.end = e.split(',')[1];
            audio.currentTime = app.$data.start;
            audio.play();
        }
    });
    $range.jRange('setValue', '0,' + app.$data.duration);
    app.$data.start = 0;
    app.$data.end = app.$data.duration;

});

setInterval(d => {
    app.$data.currentTime = audio.currentTime;
    if (audio.currentTime >= app.$data.end) {
        audio.pause();
    }
}, 100)

var app = new Vue({
    el: '#app',
    data: {
        audioSrc: "",
        currentTime: 0,
        duration: 0,
        start: 0,
        end: 0,

    },
    methods: {
        removeFile: function (message, e) {
            let idx = app.$data.filesArr.indexOf(message);
            app.$data.filesArr.splice(idx, 1);
        },
        play(message, e) {
            audio.currentTime = app.$data.start;
            audio.play();
        },
        cut() {
            processing = true;
            let task;
            let fileNameInp = $("#fileName").val();
            let targetType = $("#targetType").val();
            let sameDirCkb = $("#coverCkb")[0];
            $(".file-p").removeClass("success").removeClass("failed");
            let tmpDir = path.join(tmpDirRoot, "audio");
            shelljs.rm("-rf", tmpDir);
            shelljs.mkdir("-p", tmpDir);
            let outPutFullFileName = path.join(tmpDir, fileNameInp) + '.' + targetType;
            videokit.audio.cut(app.$data.audioSrc, app.$data.start, app.$data.end, outPutFullFileName).then(e => {
                ipc.send('open-file-dialog');
                processing = false;
            }).catch(e => {
                console.log(e);
                processing = false;
            });
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
        var file = e.originalEvent.dataTransfer.files[0];
        app.$data.audioSrc = file.path;
        audio.src = file.path;
    });





ipc.on('selected-directory', function (event, p) {
    let tmpDir = path.join(tmpDirRoot, "audio");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });
})