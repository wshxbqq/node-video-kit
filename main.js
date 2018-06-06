"use strict";
const fs = require("fs");
const shelljs = require("shelljs");
const electron = require('electron')
// Module to control application life.
const app = electron.app
const Menu = electron.Menu
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const os = require('os');

let mainWindow;
const template = [{
        label: 'MainWindow',
        submenu: [{
                label: 'Open MainWindow',
                click() {
                    createWindow();
                }
            },

        ]
    }, {
        label: 'Edit',
        submenu: [{
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [{
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [{
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click() {
                require('electron').shell.openExternal('https://electronjs.org')
            }
        }]
    }
]

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [{
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })

    // Edit menu
    template[1].submenu.push({
        type: 'separator'
    }, {
        label: 'Speech',
        submenu: [{
                role: 'startspeaking'
            },
            {
                role: 'stopspeaking'
            }
        ]
    })

    // Window menu
    template[3].submenu = [{
            role: 'close'
        },
        {
            role: 'minimize'
        },
        {
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            role: 'front'
        }
    ]
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    //mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        try {
            mainWindow = null
        } catch (ex) {
            console.log(ex)
        }
    })
}

let donateWindow

function createdonateWindow() {
    donateWindow = new BrowserWindow({
        width: 300,
        height: 500
    })
    donateWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'donate.html'),
        protocol: 'file:',
        slashes: true
    }))
    //donateWindow.webContents.openDevTools()
    donateWindow.on('closed', function () {
        donateWindow = null
    })
}


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        try {
            app.quit();
        } catch (ex) {
            console.log(ex)
        }

    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const tmpDirRoot = path.join(os.tmpdir(), "ez_media");
shelljs.mkdir("-p", path.join(tmpDirRoot, "video"));
shelljs.mkdir("-p", path.join(tmpDirRoot, "audio"));
shelljs.mkdir("-p", electron.app.getPath('userData'));
let softStartFilePath = path.join(electron.app.getPath('userData'), "start.txt");

if (!fs.existsSync(softStartFilePath)) {
    fs.writeFileSync(softStartFilePath, "0", "utf-8");
}
let c = fs.readFileSync(softStartFilePath, "utf-8");
c = parseInt(c);
c++;
fs.writeFileSync(softStartFilePath, c, "utf-8");

app.on('ready', function (e) {
    createWindow();
    if (c > 8) {
        createdonateWindow();
        fs.writeFileSync(softStartFilePath, "0", "utf-8");
    }
})