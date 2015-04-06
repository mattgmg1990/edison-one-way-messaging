//var mraa = require('mraa'); //require mraa
//console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var LCD = require('jsupm_i2clcd');
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
myLcd.write('Waiting...');

app.post("/submit-message", function(req, res) {
    console.log(req.body.message);
    console.log(req.body.color);

    var rgb = req.body.color.split(",");
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

    myLcd.clear();
    splitMessageAndShowParts(myLcd, req.body.message);

    myLcd.setColor(parseInt(r), parseInt(g), parseInt(b));

    res.send('Message Received!');
});

function splitMessageAndShowParts(lcd, message) {
    var parts = new Array();

    // The LCD can display 32 columns at a time.
    for(var i = 1; i <= Math.ceil((message.length / 32)); i++) {
        parts.push(message.substring(32 * (i - 1), 32 * i));
    }

    var curPart = 0;
    var displayPart = function() {
        writePart(lcd, parts[curPart % parts.length]);
        curPart++;
        setTimeout(displayPart, 2000);
    }

    // Recursively loop through the message parts on repeat.
    setTimeout(displayPart(), 2000);
}

function writePart(lcd, part) {
    myLcd.clear();
    myLcd.setCursor(0, 0);
    myLcd.write(part.substring(0, 16));
    myLcd.setCursor(1, 0);
    if (part.length > 16) {
        myLcd.write(part.substring(16));
    }
}
app.listen(8080);
