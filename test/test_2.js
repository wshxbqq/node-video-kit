var fs = require('fs');
var path = require('path');
var walk = require('walk');
var fs = require('fs');
var data = require('./data.js');

var file = {};

file.route2Handle = function(itemPath) {
    var ext = path.extname(itemPath);
    switch (ext) {
        case ".html":
            return "html";
            break;
        case ".js":
            return "js";
            break;
        case ".css":
            return "css";
            break;
        case ".jpg":
            return "jpg";
            break;
        case ".jpeg":
            return "jpg";
            break;
        case ".png":
            return "png";
            break;
        case ".gif":
            return "gif";
            break;
        case ".mp3":
            return "mp3";
            break;
    }
}

// https://nodejs.org/api/fs.html#fs_class_fs_stats
file.splitPathTaskArray = function(itemPath, onFile, onErr, onEnd) {
    var status = fs.statSync(itemPath);
    //如果是文件夹
    if (status.isDirectory()) {
        var walker = walk.walk(itemPath, {
            followLinks: false
        });

        walker.on("file", fileHandler);
        walker.on("errors", errorsHandler); // plural
        walker.on("end", endHandler);

        function fileHandler(root, fileStat, next) {
            var p = path.resolve(root, fileStat.name);
            var handle = file.route2Handle(p);
            if (handle) {
                var fileInfo = {
                    fullPath: p,
                    handle: handle,
                    fileStat: fileStat
                }
                if (onFile) {
                    onFile(fileInfo);
                }
            }


            next();
        }

        function errorsHandler(root, nodeStatsArray, next) {
            if (onErr) {
                onErr(nodeStatsArray);
            }
            // nodeStatsArray.forEach(function(n) {
            //     console.error("[ERROR] " + n.name)
            //     console.error(n.error.message || (n.error.code + ": " + n.error.path));
            // });
            next();
        }

        function endHandler() {
            if (onEnd) {
                onEnd();
            }
        }
    }

    if (status.isFile()) {
        var p = path.normalize(itemPath);
        var fileInfo = {
            fullPath: p,
            handle: file.route2Handle(p),
            fileStat: fileStat
        }
        if (onFile) {
            onFile(fileInfo);
        }
    }
}

module.exports = file;
