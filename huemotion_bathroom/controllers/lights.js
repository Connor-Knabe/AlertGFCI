var hue = require("node-hue-api");

var HueApi = hue.HueApi;
var lightState = hue.lightState;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);

var displayError = function(err) {
    console.error(err);
};
var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};


function setLightFromColor(color){
	var rgb;
	var allLightsOn = true;
    rgb = color.split(",");
    console.log(rgb);
    var r=parseInt(rgb[0],10);
    var g=parseInt(rgb[1],10);
    var b=parseInt(rgb[2],10);
    hueState = lightState.create().rgb(r,g,b);
    hueState.on();
    set(hueState,allLightsOn);
}

function setHueBrightness(brightness, allLights){
	hueState = lightState.create().brightness(brightness).on();
	set(hueState,allLights);
}

function setHueColorTemp(temp, allLights){
	hueState = lightState.create().ct(500);
	set(hueState,allLights);
}


function flipHueOn(allLightsOn){
	hueState = lightState.create().on();
	set(hueState,allLightsOn);
}

function flipHueOff(){
	hueState = lightState.create().off();
	set(hueState,true);
}

function turnLampOn(){
	hueState = lightState.create().on();
	setLampState(hueState);
}

function turnLampOff(){
	hueState = lightState.create().off();
	setLampState(hueState);
}

function setLampState(hueState){
	setTimeout(function(){
		api.setLightState(10, hueState)
		    .then(displayResult)
		    .fail(displayError)
		    .done();
	}, 0.2*60*1000);
}



function turnBedroomLampsOn(){
	hueState = lightState.create().on();
    turnLampOn();
	setBedroomLampState(hueState);
}


function turnBedroomLampOff(){
	hueState = lightState.create().off();
    turnLampOff();
	setBedroomLampState(hueState);
}

function setBedroomLampState(hueState){
	api.setLightState(4, hueState)
	    .then()
	    .fail(displayError)
	    .done();
}

function bathroomLights(on){
	if(on){
		hueState = lightState.create().on();
	} else {
		hueState = lightState.create().off();
	}
	twoBathroomLights(hueState);
}

function twoBathroomLights(hueState){
	api.setLightState(1, hueState)
	    .then()
	    .fail(displayError)
	    .done();
	api.setLightState(2, hueState)
	    .then()
	    .fail(displayError)
	    .done();
}

function set(hueState,allLightsOn){
    api.setLightState(1, hueState)
        .then()
        .fail(displayError)
        .done();

    api.setLightState(2, hueState)
        .then()
		.fail(displayError)
        .done();

    api.setLightState(3, hueState)
        .then()
        .fail(displayError)
        .done();

    if(allLightsOn){
		api.setLightState(8, hueState)
		    .then()
			.fail(displayError)
		    .done();
    }
}


module.exports.set = set;
module.exports.flipHueOff = flipHueOff;
module.exports.flipHueOn = flipHueOn;
module.exports.setLightFromColor = setLightFromColor;
module.exports.turnLampOff = turnLampOff;
module.exports.setHueBrightness = setHueBrightness;
module.exports.turnLampOn = turnLampOn;
module.exports.turnLampOff = turnLampOff;
module.exports.setHueColorTemp = setHueColorTemp;
module.exports.turnBedroomLampOff = turnBedroomLampOff;
module.exports.bathroomLights = bathroomLights;
module.exports.turnBedroomLampsOn = turnBedroomLampsOn;
