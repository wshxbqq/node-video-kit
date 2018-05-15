"use strict";
const ffmpeg = require('ffmpeg-static').path;
const parse = require('ffmpeg-device-list-parser').parse;
const options = {
    ffmpegPath: ffmpeg
}

const util = {
    getDevicesList: function () {
        return parse(options);
    }
};


module.exports = util;