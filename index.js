"use strict";
const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const winFunc = {};

$(".func").on("click", function (e) {
    let url = $(this).attr("page");
    if (winFunc[url]) {
        winFunc[url].focus();
    } else {
        const modalPath = path.join('file://', __dirname, url)
        let win = winFunc[url] = new BrowserWindow({
            width: 600,
            height: 600
        });
        win.on('close', function () {
            win = winFunc[url] = null;
        });
        win.loadURL(modalPath);
        win.show();
        //win.webContents.openDevTools()
    }

});