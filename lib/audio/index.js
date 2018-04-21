const ffmpeg = require('ffmpeg-static').path;
const child_process = require('child_process');

const audio = {
    converter(input, output) {
        const child = child_process.execFile(ffmpeg, ['-i', input, output, '-loglevel', 'info', '-y'], (error, stdout, stderr) => {
            console.log(111);
            if (error) {
                console.log("err");
                console.log(error);
                throw error;
            }
            console.log("stderr");
            console.log(stderr);
            console.log("stdout");
            console.log(stdout);
        });
    },
};

module.exports = audio;