const video = require("./video/index");
const audio = require("./audio/index");
const ffmpeg = require('ffmpeg-static').path;
const VideoKit = {
    video: video,
    audio: audio,
    ffmpeg: ffmpeg
};

module.exports = VideoKit;