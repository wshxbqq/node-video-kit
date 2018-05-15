"use strict";
const ffmpeg = require('ffmpeg-static').path;
const child_process = require('child_process');

const audio = {
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
            const child = child_process.execFile(ffmpeg, ['-i', input, '-ss', start, '-t', end, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    mix(srcArr, output) {
        let paths = [];
        for (let index = 0; index < srcArr.length; index++) {
            const element = srcArr[index];
            paths.push(element.path);
        }
        let input = [];

        paths.map(p => {
            input.push("-i");
            input.push(p);
        });

        input.push("-filter_complex");
        input.push(`amix=inputs=${srcArr.length}:duration=first:dropout_transition=${srcArr.length}`);
        input.push(output);
        input.push('-loglevel');
        input.push('error');
        input.push('-y');

        console.log(input);
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, input, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    }
};

module.exports = audio;