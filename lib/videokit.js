let video;
let audio;
const os = require("os");
if (os.platform().includes("win")) {
    video = require("./video/index");
    audio = require("./audio/index");
} else {
    video = require("./video/index_mac");
    audio = require("./audio/index_mac");
}
const ffmpeg = require('ffmpeg-static').path;
const VideoKit = {
    video: video,
    audio: audio,
    ffmpeg: ffmpeg
};

module.exports = VideoKit;