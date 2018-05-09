const util = require("./lib/util");
util.getDevicesList().then(e => {
    console.log(e);
});

console.log(util);