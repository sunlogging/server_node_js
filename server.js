const color = require('simple-log-color')
const fs = require('fs');

function info(text) {
    console.log(color.Green, text)
}
function warn(text) {
    console.log(color.Yellow, text)
}
function crit(text) {
    console.log(color.Red, text)
}

var settings = {};

for (var index = 0; index < process.argv.length; index++) {
    if (process.argv[index] == '-p') {
        if (process.argv[index + 1] > 65535 || process.argv[index + 1] < 1025) {
            crit("wrong port entered");
            process.exit(-1);
        }
        var PORT = process.argv[index + 1];
        index++;
    }
    else if (process.argv[index] == '-t') {

        switch (process.argv[index + 1]) {
            case "http":
                break
            default:
                crit("wrong type entered");
                process.exit(-1);
        }

        var server = require(process.argv[index + 1]);
        index++;
    }
    else if (process.argv[index] == '-s') {
        
        info(`read settings file - ${process.argv[index + 1]}`)
        fs.readFile(process.argv[index + 1], 'utf8', (err, data) => {
            if (err) { crit("not found file"); process.exit(-1); };
            for (var j = 0; j < data.split("\n").length; j++) {
                for (var i = 0; i < data.split("\n")[j].split(" ").length; i++) {
                    settings[data.split("\n")[j].split(" ")[i].split('~')[0]] = data.split("\n")[j].split(" ")[i].split('~')[1];
                }

            }
        });
    }
}

server.createServer(function (req, res) {

    fs.readFile(`${settings[req.url]}`, function (error, data) {

        if (error) {

            res.statusCode = 404;
            res.end("Resourse not found!");
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(PORT, function () {
    warn(`Server started 127.0.0.1:${PORT}`);
});
