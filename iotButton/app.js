var hue = require("node-hue-api");
var express = require('express');
var app = express();
var port = process.env.PORT || 2610;
var router = express.Router();
var request = require('request');
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());


var loginInfo = require("./loginInfo.js");
var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);

var displayError = function(err) {
    console.error(err);
};

app.get('/', function(req,res){
    res.send({"status":"200"});
});


var brightCount = 0;

var countOne=0;
var brightCount = 0;
var lowWaterSendCount = 0;


app.get('/color/:redColor/:greenColor/:blueColor', function(req, res){
	var redColor = req.params.redColor;
	var greenColor = req.params.greenColor;
	var blueColor = req.params.blueColor;

	hueState = lightState.create().effect("none");
	setLight(hueState);
	setTimeout(function(){
		setLightFromColor(redColor+","+greenColor+","+blueColor);
	},1000)
	extendLightTimer();
	
	res.send("OK");
});



/*
app.get('/btnOne', function(req,res){
	if (countOne>9){
		countOne = 0;
	}
	hueState = lightState.create().effect("none");
	setLight(hueState);

	setTimeout(function(){
	    setColor(countOne);
		countOne++;
	},1000)
	extendLightTimer();
});
*/

app.get('/btnTwo', function(req,res){
    hueState = lightState.create().effect("colorloop");
    hueState.on();
    setLight(hueState);
	extendLightTimer();
	res.send("OK");

});


app.get('/btnThree', function(req,res){
	if(brightCount == 0){
		setHueBrightness(100);
		brightCount++;
	} else if(brightCount==1) {
		setHueBrightness(60);
		brightCount++;
	} else {
		setHueBrightness(30);
		brightCount=0;
	}
	res.send("OK");


});

app.get('/waterAlert',function(req,res){
	console.log(new Date()+ " Low fountain water Detected");
	var i = 0;
    var loggingInterval = setInterval(function(){
        i++;
    }, 300000);
    
	if(lowWaterSendCount<1){
		sendWaterLowAlert();
		lowWaterSendCount++;
		setTimeout(function(){
			lowWaterSendCount = 0;
		}, 420*60*1000)
	}
	
	res.send("OK");
});

function setHueBrightness(brightness){
	console.log("setting brightness");
	hueState = lightState.create().brightness(brightness).on();
	setLight(hueState);
	extendLightTimer();

}


function setColor(count){
	switch(count) {
	    case 0:
			setLightFromColor("152,0,0");
	        break;
	    case 1:
			setLightFromColor("255,0,0");
	        break;
	    case 2:
			setLightFromColor("255,153,0");
	        break;
	    case 3:
			setLightFromColor("255,255,0");
	        break;
	    case 4:
			setLightFromColor("0,255,0");
	        break;
	    case 5:
			setLightFromColor("74,134,232");
	        break;
	    case 6:
			setLightFromColor("0,0,255");
	        break;
	    case 7:
			setLightFromColor("153,0,255");
	        break;
	    case 8:
			setLightFromColor("255,0,255");
	        break;
	    case 9:
			setLightFromColor("255,255,255");
	        break;
	    default:
	}
}

function setLightFromColor(color){
	var rgb;
    rgb = color.split(",")
    console.log("Setting color to "+color);
    console.log(rgb);
    var r=parseInt(rgb[0],10);
    var g=parseInt(rgb[1],10);
    var b=parseInt(rgb[2],10);
    hueState = lightState.create().rgb(r,g,b);
    hueState.on();
    setLight(hueState);
}

function setLight(hueState){
    api.setLightState(5, hueState)
        .then()
        .fail(displayError)
        .done();
    api.setLightState(6, hueState)
        .then()
        .fail(displayError)
        .done();
    api.setLightState(7, hueState)
        .then()
        .fail(displayError)
        .done();
    api.setLightState(9, hueState)
        .then()
        .fail(displayError)
        .done();
	api.setLightState(11, hueState)
		.then()
		.fail(displayError)
		.done();
	api.setLightState(12, hueState)
		.then()
		.fail(displayError)
		.done();

}

function extendLightTimer(){
	request('http://192.168.0.111:8080/extend', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
		}
    });
}

function sendWaterLowAlert(){
	
	request.post({
	          url:	"http://192.168.0.100:2605/twilioSend",
	          form: { toNumber: loginInfo.connorCell, fromNumber:loginInfo.holkaAlertNumber, message: "Fountain water is low!!", twilioLocalKey: loginInfo.twilioLocalKey }
	    }, function(error, response, body){
	        if (!error && response.statusCode == 200) {
	            console.log(body);
	        }
	    });
	    
}