"use strict";
const path = require("path");
const electron = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow;
const winFunc = {};
const util = require("./lib/util");

$(".func").on("click", function (e) {
    let url = $(this).attr("page");
    const modalPath = path.join('file://', __dirname, url)
    let win = winFunc[url] = new BrowserWindow({
        width: 600,
        height: 600
    });
    win.loadURL(modalPath);
    win.show();
    //win.webContents.openDevTools()
});

util.setMenu();