const ffmpeg = require('ffmpeg-static').path;
const child_process = require('child_process');

const video = {
    converter(input, output) {
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });

    },
};

module.exports = video;