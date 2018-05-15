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

const video = document.getElementById("video");
const waterimg = document.getElementById("waterimg");
let $range;


setInterval(d => {
    app.$data.currentTime = video.currentTime;
    if (video.currentTime >= app.$data.end) {
        video.pause();
    }
}, 100);

let imgDragDiff = {
    x: 0,
    y: 0
}

var app = new Vue({
    el: '#app',
    data: {
        videoSrc1: "",
        videoSrc2: "",
        currentTime: 0,
        duration: 0,
        start: 0,
        end: 0,
        left: 0,
        top: 0,
        
        video1SpriteWidth: 300,
        video1SpriteHeight: 300,
        video2SpriteWidth: 50,
        video2SpriteHeight: 50,
        spriteRatio: 1,

        videoShowWidth: 300,
        videoShowHeight: 300,
        imgShowWidth: 50,
        imgShowHeight: 50,
        imgShowLeft: 0,
        imgShowTop: 0,

        baseRatio: 1,

    },
    computed: {
        videoName() {
            return path.basename(this.videoSrc);
        },
        imgName() {
            return path.basename(this.imgSrc);
        }
    },
    watch: {
        imgSpriteWidth(val, oldVal) {
            this.calculate();
        },
        imgSpriteHeight(val, oldVal) {
            this.calculate();
        },
    },
    methods: {
        prevent(e) {
            event.preventDefault();
            return false;
        },
        goStart(e) {
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
            videokit.video.watermark(app.$data.videoSrc, app.$data.imgSrc, {
                x: app.$data.left,
                y: app.$data.top,
                scale: app.$data.imgSpriteWidth + ":" + app.$data.imgSpriteHeight,
            }, outPutFullFileName).then(e => {
                ipc.send('open-file-dialog');
                processing = false;
            }).catch(e => {
                console.log(e);
                processing = false;
            });
        },
        calculate() {
            let baseVol = Math.max(app.$data.videoSpriteWidth, app.$data.videoSpriteHeight);
            app.$data.baseRatio = 300 / baseVol;



            app.$data.videoShowWidth = app.$data.videoSpriteWidth * app.$data.baseRatio;
            app.$data.videoShowHeight = app.$data.videoSpriteHeight * app.$data.baseRatio;

            app.$data.imgShowWidth = app.$data.imgSpriteWidth * app.$data.baseRatio;
            app.$data.imgShowHeight = app.$data.imgSpriteHeight * app.$data.baseRatio;
        },
        removeFile: function (message, e) {
            let idx = app.$data.filesArr.indexOf(message);
            app.$data.filesArr.splice(idx, 1);
        },
        imgload(e) {
            app.$data.imgSpriteWidth = waterimg.width;
            app.$data.imgSpriteHeight = waterimg.height;
            this.calculate();
        },
        durationchange(e) {
            app.$data.videoSpriteWidth = video.videoWidth;
            app.$data.videoSpriteHeight = video.videoHeight;
            app.$data.duration = ~~video.duration;
            app.$data.start = 0;
            app.$data.end = app.$data.duration;
            this.calculate();
        },
        imgmousedown(e) {
            window.imgDragFlag = true;
            imgDragDiff.x = e.pageX - app.$data.imgShowLeft;
            imgDragDiff.y = e.pageY - app.$data.imgShowTop;
        },
        imgmousemove(e) {
            if (window.imgDragFlag) {
                let x = e.pageX - imgDragDiff.x;
                let y = e.pageY - imgDragDiff.y;

                x = Math.max(0, x);
                y = Math.max(0, y);

                x = Math.min(app.$data.videoShowWidth - app.$data.imgShowWidth, x);
                y = Math.min(app.$data.videoShowHeight - app.$data.imgShowHeight, y);

                app.$data.imgShowLeft = x;
                app.$data.imgShowTop = y;

                app.$data.left = x / app.$data.baseRatio;
                app.$data.top = y / app.$data.baseRatio;
            }

        },
        imgmouseup(e) {
            window.imgDragFlag = false;
        },
    }
});



$("#dragZoneVideo")
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
        app.$data.videoSrc = file.path;
        video.src = file.path;
    });

$("#dragZoneImg")
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
        app.$data.imgSrc = file.path;
        waterimg.src = app.$data.imgSrc;
    });





ipc.removeAllListeners("selected-directory");
ipc.on('selected-directory', function (event, p) {
    let tmpDir = path.join(tmpDirRoot, "video");
    let files = shelljs.find(tmpDir).filter(f => {
        return fs.statSync(f).isFile();
    });
    files.map(f => {
        shelljs.mv(f, p[0]);
    });
})