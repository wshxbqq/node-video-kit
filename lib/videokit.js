"use strict";
let video;
let audio;
const os = require("os");
if (os.platform().includes("win32")) {
    video = require("./video/index");
    audio = require("./audio/index");
} else {
    video = require("./video/index.mac");
    audio = require("./audio/index.mac");
}
const ffmpeg = require('ffmpeg-static').path;
const VideoKit = {
    video: video,
    audio: audio,
    ffmpeg: ffmpeg,
};

module.exports = VideoKit;