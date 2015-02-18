/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*global */

/*
A simple node.js application intended to blink the onboard LED on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client:
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/

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
