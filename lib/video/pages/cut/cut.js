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
let $range;


var app = new Vue({
    el: '#app',
    data: {
        videoSrc: "",
        currentTime: 0,
        duration: 0,
        start: 0,
        end: 0,
    },
    methods: {
        cutclick(e) {
            processing = true;
            let task;
            let fileNameInp = $("#fileName").val();
            let targetType = $("#targetType").val();
            let sameDirCkb = $("#coverCkb")[0];
            $(".file-p").removeClass("success").removeClass("failed");
            let tmpDir = path.join(tmpDirRoot, "video");
            shelljs.rm("-rf", tmpDir);
            shelljs.mkdir("-p", tmpDir);
            let outPutFullFileName = path.join(tmpDir, fileNameInp) + '.' + targetType;
            videokit.video.cut(app.$data.videoSrc, app.$data.start, app.$data.end, outPutFullFileName).then(e => {
                ipc.send('open-file-dialog');
                processing = false;
            }).catch(e => {
                console.log(e);
                processing = false;
            });
        },
        durationchange(e) {
            app.$data.duration = ~~video.duration;
            $(".control-zone").html(`<input type="hidden" class="range-slider" value="10" />`);
            $range = $('.range-slider').jRange({
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
                    video.currentTime = app.$data.start;
                },
                onbarclicked: function (e) {
                    app.$data.start = e.split(',')[0];
                    app.$data.end = e.split(',')[1];
                    video.currentTime = app.$data.start;
                }
            });
            $range.jRange('setValue', '0,' + app.$data.duration);
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