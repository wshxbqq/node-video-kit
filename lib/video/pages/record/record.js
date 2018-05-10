const util = require("../../../util");
const fs = require("fs");
const os = require("os");
const path = require("path");
const async = require("async");
const shelljs = require("shelljs");
const videokit = require("../../../videokit");
const ipc = window.ipc = require('electron').ipcRenderer;
const tmpDirRoot = path.join(os.tmpdir(), "ez_media");



const waterimg = document.getElementById("waterimg");
const waterimgWrapper = document.getElementById("waterimgWrapper");
let $range;
let tmpDir = path.join(tmpDirRoot, "video");
let ffmpegHandle;
let durationInv;
let imgDragDiff = {
    x: 0,
    y: 0
}

var app = new Vue({
    el: '#app',
    data: {
        fileName: "record_video",
        targetType: "avi", //当前选中的输出视频格式
        audioSource: "", //当前选中的音源
        videoSource: "gdigrab", //当前选中的音源
        audioList: [], //所有 audio 音源 设备的列表数组
        videoList: ["gdigrab"],
        currentTime: 0,
        withSound: false,
        duration: 0,

        start: 0,
        end: 0,
        left: 0,
        top: 0,
        screenShot: "",

        videoSpriteWidth: 300,
        videoSpriteHeight: 300,
        imgSpriteWidth: 100,
        imgSpriteHeight: 100,
        spriteRatio: 1,

        videoShowWidth: 400,
        videoShowHeight: 300,
        imgShowWidth: 1024,
        imgShowHeight: 768,
        imgShowLeft: 0,
        imgShowTop: 0,

        baseRatio: 1,

        processing: false,


    },
    mounted: function () {
        let _this = this;
        videokit.video.createScreenShot().then(screenShotPath => {
            app.$data.screenShot = screenShotPath;
            return util.getDevicesList();
        }).then(devicesList => {
            devicesList.audioDevices.map(ad => {
                app.$data.audioList.push(ad.name);
            });
            devicesList.videoDevices.map(ad => {
                app.$data.videoList.push(ad.name);
            });
        })
    },
    computed: {
        videoName() {
            return path.basename(this.videoSrc);
        },
    },
    watch: {
        imgSpriteWidth(val, oldVal) {
            this.calculate();
        },
        imgSpriteHeight(val, oldVal) {
            this.calculate();
        },
        withSound(val, oldVal) {
            if (val) {
                if (!app.$data.audioSource) {
                    app.$data.audioSource = app.$data.audioList[0];
                }

            }
        }
    },
    methods: {
        prevent(e) {
            event.preventDefault();
            return false;
        },
        imgload(e) {
            app.$data.videoSpriteWidth = app.$refs.screenShotImg.naturalWidth;
            app.$data.videoSpriteHeight = app.$refs.screenShotImg.naturalHeight;
            this.calculate();
            app.$data.imgShowWidth = 50;
            app.$data.imgShowHeight = 50;
            app.$data.imgSpriteWidth = 50 / app.$data.baseRatio;
            app.$data.imgSpriteHeight = 50 / app.$data.baseRatio;
        },
        stopRecord(e) {
            clearInterval(durationInv);
            if (ffmpegHandle && ffmpegHandle.stdin.writable) {
                ffmpegHandle.on("close", code => {
                    app.$data.processing = false;
                    ffmpegHandle.kill();
                    ffmpegHandle = undefined;
                    ipc.send('open-file-dialog');
                    app.$data.processing = false;
                });
                ffmpegHandle.stdin.write("q");
            }
        },
        goRecord(e) {
            if (ffmpegHandle) {
                ffmpegHandle.kill();
            }
            clearInterval(durationInv);
            app.$data.duration = 0;
            durationInv = setInterval(d => {
                app.$data.duration++;
            }, 1000)
            app.$data.processing = true;
            shelljs.rm("-rf", tmpDir);
            shelljs.mkdir("-p", tmpDir);
            let outPutFullFileName = path.join(tmpDir, app.$data.fileName) + '.' + app.$data.targetType;
            videokit.video.desktopRecord(app.$data.videoSource, app.$data.audioSource, `${~~app.$data.imgSpriteWidth}x${~~app.$data.imgSpriteHeight}`, {
                x: ~~app.$data.left,
                y: ~~app.$data.top,
            }, 60, app.$data.withSound, outPutFullFileName).then(child => {
                ffmpegHandle = child;
            }).catch(e => {
                console.log(e);
                app.$data.processing = false;
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

            if (window.imgResizeFlag) {

                let width = e.pageX - window.imgResizeWrapper.left - app.$data.imgShowLeft;
                let height = e.pageY - window.imgResizeWrapper.top - app.$data.imgShowTop;



                width = Math.max(10, width);
                height = Math.max(10, height);

                width = Math.min(app.$data.videoShowWidth - app.$data.imgShowLeft, width);
                height = Math.min(app.$data.videoShowHeight - app.$data.imgShowTop, height);

                app.$data.imgShowWidth = width;
                app.$data.imgShowHeight = height;

                app.$data.imgSpriteWidth = width / app.$data.baseRatio;
                app.$data.imgSpriteHeight = height / app.$data.baseRatio;
            }
        },

        imgmouseup(e) {
            window.imgDragFlag = false;
            window.imgResizeFlag = false;
        },

        resizemousedown(e) {
            window.imgResizeFlag = true;
            window.imgResizeWrapper = $(".position-area").offset();
            e.stopPropagation();
            return false;
        }
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

        app.$data.videoSrc = " ";
        let file = e.originalEvent.dataTransfer.files[0];
        setTimeout(d => {
            app.$data.videoSrc = file.path;
        }, 10);

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