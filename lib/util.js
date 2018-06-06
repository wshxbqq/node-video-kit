"use strict";
const path = require("path");
const electron = require('electron');
const ffmpeg = require('ffmpeg-static').path;
const parse = require('ffmpeg-device-list-parser').parse;
const options = {
    ffmpegPath: ffmpeg
};
const BrowserWindow = require('electron').remote.BrowserWindow;

const util = {
    getDevicesList: function () {
        return parse(options);
    },
    ffmpegPath: path.join(__dirname, "ffmpeg"),
    template: [{
        label: "万能影音处理器",
        submenu: [{
            label: 'quit',
            click() {
                electron.remote.app.quit();
            }
        }]
    }, {
        label: 'Edit',
        submenu: [{
                label: 'undo',
                role: 'undo'
            },
            {
                label: 'redo',
                role: 'redo'
            },

            {
                label: 'cut',
                role: 'cut'
            },
            {
                label: 'copy',
                role: 'copy'
            },
            {
                label: 'paste',
                role: 'paste'
            },

            {
                label: 'delete',
                role: 'delete'
            },
            {
                label: 'selectall',
                role: 'selectall'
            }
        ]
    }, {
        label: "Main Window",
        submenu: [{
            label: 'Open Main Window',
            click() {
                const modalPath = path.join('file://', __dirname, "../index.html")
                let win = new BrowserWindow({
                    width: 600,
                    height: 600
                });
                win.loadURL(modalPath);
                win.show();
            }
        }]
    }],
    setMenu() {
        let menu = electron.remote.Menu.buildFromTemplate(this.template)
        electron.remote.Menu.setApplicationMenu(menu);
    },
};





module.exports = util;