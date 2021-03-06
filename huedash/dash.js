//warning this may trigger multiple times for one press
//...usually triggers twice based on testing for each press
dash_button = require('node-dash-button');
var dash = dash_button("74:c2:46:e8:91:f8"); //address from step above
var hue = require("node-hue-api");

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);


console.log("start2");
var count =0;
dash.on("detected", function (){
	
	if (count>6){
		count = 0;
	}
	console.log("count"+count);
	switch(count) {
	    case 0:
			setLightFromColor("255,255,255");
			count++;	
	        break;
	    case 1:
			setLightFromColor("0,255,255");	
			count++;	
	        break;
	    case 2:
			setLightFromColor("255,0,255");	
			count++;	
	        break;
	    case 3:
			setLightFromColor("255,255,0");
			count++;	
	        break;
	    case 4:
			setLightFromColor("0,255,0");
			count++;	
	        break;
	    case 5:
			setLightFromColor("255,128,0");
			count++;	
	        break;
	    case 6:
			setLightFromColor("0,0,255");
			count++;	
	        break;
	    default:
	}


	
});






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
        .done();
    api.setLightState(6, hueState)
        .then()
        .done();
    api.setLightState(7, hueState)
        .then()
        .done();  
    api.setLightState(9, hueState)
        .then()
        .done();      
}