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
    concat(srcArr, output) {
        let paths = [];
        for (let index = 0; index < srcArr.length; index++) {
            const element = srcArr[index];
            paths.push(element.path);
        }
        let input = "concat:" + paths.join('|');
        paths.reverse();
        console.log(input);
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-acodec', 'copy', output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },

    cut(input, start, end, output) {
        function format(num) {
            let hours = "00" + Math.floor(num / 60 / 60);
            let minutes = "00" + Math.floor((num % 3600) / 60);
            let seconds = "00" + num % 60;

            hours = hours.substr(-2);
            minutes = minutes.substr(-2);
            seconds = seconds.substr(-2);

            return `${hours}:${minutes}:${seconds}`
        }

        let timeSpan = end - start;
        start = format(start);
        end = format(timeSpan);
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-codec', 'copy', '-ss', start, '-t', end, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    extract(input, output) {
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
    watermark(inputVideo, inputImg, x, y, output) {
        console.log(inputVideo, inputImg, x, y, output);
        return new Promise((resolve, reject) => {
            let command = `overlay=${x}:${y}`;
            console.log(command);
            const child = child_process.execFile(ffmpeg, ['-i', inputVideo, '-i', inputImg, '-filter_complex', command, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(inputVideo);
                }
            });
        });
    },
};

module.exports = video;