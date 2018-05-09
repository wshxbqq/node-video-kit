const ffmpeg = require('ffmpeg-static').path;
const {
    parse
} = require('ffmpeg-device-list-parser');
const options = {
    ffmpegPath: ffmpeg
}

const util = {
    getDevicesList() {
        return parse(options);
    }
};


module.exports = util;