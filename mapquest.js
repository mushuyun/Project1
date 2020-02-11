var L;
var lat;
var lon;

window.onload = function () {

  navigator.geolocation.getCurrentPosition(success, error);
  function success(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    buildMap();
  }
  function error() {
    console.log("not given location access by user");
  }



  function buildMap() {

    L.mapquest.key = 'oKGNJy7554W39K4kH01ZGPwNamd85M0c';
    //var current = '2004 Elcombe Ct, Chapel Hill, NC 27517';
    //var current = '36.0194048, -78.917632';
    var current = lat + ',' + lon;
    var destination = '914 w main st, Durham, NC 27705';

    // 'map' refers to a <div> element with the ID map
    L.mapquest.map('mapID', {
      center: [0, 0],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    L.mapquest.directions().route({

      start: current,
      end: destination
    });
    getDirections(current, destination);
  }


  function getDirections(current, destination) {
    //var current = "39.750307,-104.999472"
    //var current ="2004 Elcombe Ct,Chapel Hill,NC";
    //var destination = "914 W Main St,Durham,NC";
    //var destination = "39.750907,-104.999272"


    var queryURL = "http://www.mapquestapi.com/directions/v2/route?key=oKGNJy7554W39K4kH01ZGPwNamd85M0c&from=" + current + "&to=" + destination;

    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      if (response.route) {
        var directions = response.route.legs[0].maneuvers;
        for (var i = 0; i < directions.length; i++) {
          console.log(directions[i].narrative);
        }
      }
      else {
        console.log("Couldn't find directions");
      }

    });
  }
}