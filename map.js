var L;
var lat;
var lon;

window.onload = function() {
  
  navigator.geolocation.getCurrentPosition(success, error);
function success(position) {
lat = position.coords.latitude;
lon = position.coords.longitude;
buildMap();
}
function error() {
console.log("not given location access by user");
}
  



function buildMap(){
  
  L.mapquest.key = 'oKGNJy7554W39K4kH01ZGPwNamd85M0c';
  //var current = '2004 Elcombe Ct, Chapel Hill, NC 27517';
  //var current = '36.0194048, -78.917632';
  var current = lat + ',' + lon; 
  var destination = '914 w main st, Durham, NC 27705';
     
  // 'map' refers to a <div> element with the ID map
L.mapquest.map('mapID', {
center: [0,0],
layers: L.mapquest.tileLayer('map'),
zoom: 12
});

L.mapquest.directions().route({

    start: current,
    end: destination
  });
}


 }