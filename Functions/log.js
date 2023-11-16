const fs = require('fs');

module.exports = {
    log:function(message) {
        //console.log(message);
        fs.appendFileSync('logs.txt', `${message}\n`);
    }
}
