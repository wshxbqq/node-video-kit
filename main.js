const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


let mainWindow

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
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}


let donateWindow

function createdonateWindow() {
    donateWindow = new BrowserWindow({
        width: 600,
        height: 600
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function (e) {
    createWindow();
    createdonateWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
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