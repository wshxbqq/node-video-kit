const ffmpeg = require('ffmpeg-static').path;
const child_process = require('child_process');
const fs = require('fs');
const tmpDirRoot = path.join(os.tmpdir(), "ez_media");
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
            const child = child_process.execFile(ffmpeg, ['-i', input, '-c', 'copy', output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
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
    cutarea(input, option, output) {
        let x = option.x || 0;
        let y = option.y || 0;
        let filterCmd;
        if (option.scale) {
            filterCmd = `[1:v]scale=${option.scale}[v1];[0:v][v1]overlay=${x}:${y}`;
        } else {
            filterCmd = `overlay=${x}:${y}`;
        }
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-vf', `crop=${option.width}:${option.height}:${option.x}:${option.y}`, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    extractSound(input, output) {
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-vn', output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    extractVideo(input, output) {
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-an', output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    watermark(inputVideo, inputVideo1, option, output) {
        let x = option.x || 0;
        let y = option.y || 0;
        let filterCmd;
        if (option.scale) {
            filterCmd = `[1:v]scale=${option.scale}[v1];[0:v][v1]overlay=${x}:${y}`;
        } else {
            filterCmd = `overlay=${x}:${y}`;
        }
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', inputVideo, '-i', inputVideo1, '-filter_complex', filterCmd, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(inputVideo);
                }
            });
        });
    },
    videoshot(input, time, output) {
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-ss', time, '-vframes', '1', output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },
    autoVideoshot(input, timespan = 1, output) {
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-i', input, '-vf', 'fps=1/' + timespan, output, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(input);
                }
            });
        });
    },

    desktopRecord(videoSize = "1024x768", offset = {
        x: 0,
        y: 0
    }, range = 60, sound = false, output) {
        return new Promise((resolve, reject) => {
            let cmdArr = ['-rtbufsize', '100M', '-f', 'gdigrab', '-framerate', range, '-video_size', videoSize, '-offset_x', offset.x, '-offset_y', offset.y, '-r', range, '-i', 'desktop', output, '-loglevel', 'error', '-y']
            if (sound) {
                cmdArr = [
                    '-rtbufsize', '100M',
                    '-f', 'dshow', '-i', 'audio=virtual-audio-capturer',
                    '-f', 'gdigrab', '-framerate', range, '-video_size', videoSize, '-offset_x', offset.x, '-offset_y', offset.y, '-i', 'desktop', '-c:v', 'h264_nvenc', '-c:a', 'aac', '-pix_fmt', 'yuv420p', output, '-loglevel', 'error', '-y'
                ]
            }
            const child = child_process.execFile(ffmpeg, cmdArr, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {

                }
            });
            resolve(child);
        });
    },

    createScreenShot() {
        let screentShotImgFile = path.join(tmpDirRoot, "screen.jpg");
        if (fs.existsSync(screentShotImgFile)) {
            fs.unlinkSync(screentShotImgFile);
        }
        return new Promise((resolve, reject) => {
            const child = child_process.execFile(ffmpeg, ['-f', 'gdigrab', '-i', 'desktop', '-vframes', '1', screentShotImgFile, '-loglevel', 'error', '-y'], (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error, stderr);
                    reject(error, stderr);
                } else {
                    resolve(screentShotImgFile);
                }
            });
        });
    },
};

module.exports = video;