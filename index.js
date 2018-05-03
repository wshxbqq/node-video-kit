// $(".left-title").on("click", function (e) {
//     let $this = $(this);
//     $(".left-container").hide();
//     $this.next().show();
// })

// $(".left-block .left-container a").on("click", function (e) {
//     if (window.top.processing) {
//         e.preventDefault();
//         return;
//     }
//     let $this = $(this);
//     $(".sp-1").html($this.parent().parent().prev().text());
//     $(".sp-2").html($this.text());

//     $("#video").hide();
// });

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
        win.webContents.openDevTools()
    }

});