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
    myLcd.write(req.body.message);
    myLcd.setColor(parseInt(r), parseInt(g), parseInt(b));

    res.send('Message Received!');
});
app.listen(8080);
