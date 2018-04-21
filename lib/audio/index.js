const ffmpeg = require('ffmpeg-static').path;
const child_process = require('child_process');

const audio = {
    converter(input, output) {
        const child = child_process.execFile(videokit.ffmpeg, ['-version'], (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            console.log(stdout);
        });
    },
};

module.exports = audio;