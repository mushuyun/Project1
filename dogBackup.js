//declaring global variables
var L;
window.onload = function () {
  var sex, zip, street, city, state, mediaContent, directions, current, destination, breedType, animalType, lat, lon, mqQuery;
  dirArray = [];
  var geoCount = 0;
  var wantMap = false;
  var shelter = false;
  noGeo = false;


  //Submit Button click event with text formatting and user error handling
  $("#submitBtn").on("click", function (event) {
    event.preventDefault();
    $("#zip").attr("style", "color: black");
    $("#sex").attr("style", "color: black");
    $("#pet-div").empty();

    animalType = $("#animalType").val().toLowerCase();
    console.log(animalType);
    breedType = $("#breed").val();
    breedType = formatBreed(breedType);
    console.log(breedType);
    sex = $("#sex").val().toUpperCase();
    if (sex !== "M" && sex !== "F" && sex !== "") {
      $("#sex").val("Can only input M or F or leave blank");
      $("#sex").attr("style", "color: red");
    }
    console.log(sex);
    zip = $("#zip").val();
    console.log(zip);
    if (zip > 9999 && zip < 100000) {}
    else {
      $("#zip").val("Must be a 5 digit number");
      $("#zip").attr("style", "color: red");
    }
    apiCall();
  });


  //Map display button click event
  $(document).on("click", "#mapBtn", function (event) {
    event.preventDefault();
    
    wantMap = true;
    $("#mapID").remove();
    mapDiv = $("<div>").attr("id", "mapID");
    $(this).parent("div").prepend(mapDiv);

    var i = $(this).parent("div").attr("id");
    mqQuery = localStorage.getItem(i);
    $("#startBtn" + i).text("Display Map");

    if(noGeo) {
    noGeoloc(i);
  }
    else {
    geoLoc(i);
    }
  });



  //Direction display button click event
  $(document).on("click", "#directionsBtn", function (event) {
    event.preventDefault();

    var i = $(this).parent("div").attr("id");;
    mqQuery = localStorage.getItem(i);
    $("#startBtn" + i).text("Get Directions");
    if(noGeo){
      noGeoloc(i);
    }
    else {
    geoLoc(i);
    }
    
  });


  //Shows input box for current address when geolocation is disabled
  function noGeoloc(i) {
    //$("#" + i).children("#directionsBtn").addClass("hide");
    $("#start" + i).removeClass("hide");
    $("#startLabel" + i).removeClass("hide");
    $("#startBtn" + i).removeClass("hide");
    if(localStorage.getItem("current")){
      console.log(localStorage.getItem("current"));
      $("#start" + i).attr("value", localStorage.getItem("current"));
    }
  }

  //Start Button Click Event
  $(document).on("click", ".start-button", function (event) {
    event.preventDefault();
    var i = $(this).parent("div").attr("id");
    mqQuery = localStorage.getItem(i);
    current = $("#start" + i).val();
    localStorage.setItem("current", current);
    console.log(current, mqQuery);

    if (wantMap) {
      buildMap(mqQuery);
    }
    else {
      printDirections(i);
    }
  });


  //Makes all letters lowercase except 1st in every word
  function formatBreed(breed) {
    var splitStr = breed.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }


  //Takes users pet search and passes it to the Petfinder Api to get info on the closest 25 animals that match their criteria
  function apiCall() {
    var url = "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466" + "&animal=" + animalType + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip + "&format=json";
    //var url = "http://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466" +"&animal=" + animalType + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip +"&format=json";

    $.ajax({
      url: url,
      dataType: "jsonp",
      type: "GET",
      error: function () {
        $("article").removeClass("hide");
      },
      success: function (data) {
        console.log(data);

        if (!data.petfinder.pets || !data.petfinder.pets.pet) {
          $("article").removeClass("hide");
        }
        else {
          $("article").addClass("hide");
          for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
            if (data.petfinder.pets.pet[i].media.photos) {
              var id = i;
              var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);

              var breeds = [];
              if(data.petfinder.pets.pet[i].breeds.breed.$t) {
                breeds.push(data.petfinder.pets.pet[i].breeds.breed.$t)
              }
              for(var j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++) {
                if(data.petfinder.pets.pet[i].breeds.breed[j].$t){
                  breeds.push(data.petfinder.pets.pet[i].breeds.breed[j].$t);
                }
              }
              console.log(breeds);
              var breedsList = $("<p>").text("- Breeds: " + breeds);
              
              
              var petAge = $("<p>").text("- Age: " + data.petfinder.pets.pet[i].age.$t);
              var petSex = $("<p>").text("- Sex: " + data.petfinder.pets.pet[i].sex.$t);
              var petLocation = $("<p>").text("- Location: " + data.petfinder.pets.pet[i].contact.city.$t + ", " + data.petfinder.pets.pet[i].contact.state.$t + ", " + data.petfinder.pets.pet[i].contact.zip.$t);
              var petEmail = $("<a>").attr("href", "mailto:" + data.petfinder.pets.pet[i].contact.email.$t).text("- Email: " + data.petfinder.pets.pet[i].contact.email.$t);
              var rowCard = $("<div>");
              rowCard.addClass("row columns");
              var thirdCol = $("<div>");
              thirdCol.addClass("column is-one-half");
              var divCard = $("<div>");
              divCard.addClass("card large");
              var divCardContent = $("<div>");
              divCardContent.addClass("card-content");
              var divMedia = $("<div>");
              divMedia.addClass("media");
              var divMediaLeft = $("<div>");
              divMediaLeft.addClass("media-left");
              var figure = $("<figure>");
              figure.addClass("image is-128x128");
              var img = $("<img>");

              img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[1].$t);

              var separator = $("<hr>");
              var petId = data.petfinder.pets.pet[i].id.$t;
              rowCard.append(thirdCol);
              thirdCol.append(divCard);
              divCard.append(divCardContent);
              divCardContent.append(divMedia);
              divMedia.append(divMediaLeft);
              //divMediaLeft.append(figure);
              figure.append(img);
              mediaContent = $("<div>");
              mediaContent.addClass("media-content").addClass("media-right").attr("id", i);
              //mediaContent.addClass("media-right");
              var br = $("<br>");

              petName.addClass("title is-4");
              petName.append(br);
              var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
              var anchor = $("<a>").attr("href", animalLink).attr('target', '_blank');

              anchor.text("- [Click here to read more about " + data.petfinder.pets.pet[i].name.$t + "!]");
              var separator = $("<hr>");
              // petAge.addClass("subtitle is-6");
              // petSex.addClass("subtitle is-6");
              // petLocation.addClass("subtitle is-6");
              // petEmail.addClass("subtitle is-6");


              divCard.append(mediaContent);
              figure.append(img);

              $(mediaContent).append(petName).append(separator).append(figure).append(breedsList).append(petAge).append(petSex).append(petLocation).append(petEmail).append("<br>").append(anchor).append("<br>");

              street = data.petfinder.pets.pet[i].contact.address1.$t;
              city = data.petfinder.pets.pet[i].contact.city.$t;
              state = data.petfinder.pets.pet[i].contact.state.$t;
              mqQuery = street + ", " + city + ", " + state;
              localStorage.setItem(id, mqQuery);

              //takes shelter Id to get address
              if (data.petfinder.pets.pet[i].shelterId.$t && data.petfinder.pets.pet[i].shelterId.$t !== "NC917") {
                shelterId = data.petfinder.pets.pet[i].shelterId.$t;
                shelterFind(shelterId, i);

                var directionsBtn = $("<button>");
                directionsBtn.attr("id", "directionsBtn");
                directionsBtn.text("Display Directions");
                mediaContent.append(directionsBtn);
                shelter = true;

                var mapBtn = $("<button>");
                mapBtn.attr("id", "mapBtn");
                mapBtn.text("Display Map");
                mediaContent.append(mapBtn);
              }

              //adds directions and map button if address is available
              if (data.petfinder.pets.pet[i].contact.address1.$t && shelter === false) {
                var street = data.petfinder.pets.pet[i].contact.address1.$t;
                //filter out PO Boxes
                if (street[0] !== "P" || street[1] !== "O") {
                  if (street[0] !== "P" || street[1] !== ".") {
                    if (street[0] !== "P" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t") {
                      if (street[0] !== "F" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t") {

                        var directionsBtn = $("<button>");
                        directionsBtn.attr("id", "directionsBtn");
                        directionsBtn.text("Display Directions");
                        mediaContent.append(directionsBtn);

                        var mapBtn = $("<button>");
                        mapBtn.attr("id", "mapBtn");
                        mapBtn.text("Display Map");
                        mediaContent.append(mapBtn);
                      }
                    }
                  }
                }
              }
            }
            var startLabel = $("<p>").text('Choose Starting Address').addClass("hide").attr("id", "startLabel" + i);
            var startQ = $("<input>").addClass("input start hide").attr("id", "start" + i).attr("type", "text").attr("placeholder", "914 W Main St,Durham, NC 27701");
            var startButton = $("<button>").addClass("button start-button hide").attr("id", "startBtn" + i).text("START");
            $(mediaContent).append(startLabel).append(startQ).append(startButton);

            mediaContent.append(br);

            $("#pet-div").append(rowCard, separator)

          }
        }
      }
    });
  }


  //uses shelterId to find the location of shelter
  function shelterFind(shelterId, id) {
    var url = "https://api.petfinder.com/shelter.get?key=2f95f51b181ddd27883e91878e922466" + "&id=" + shelterId + "&format=json";

    $.ajax({
      url: url,
      dataType: "jsonp",
      type: "GET",
      error: function () {
      },
      success: function (data) {
        //console.log(data);

        lon = data.petfinder.shelter.longitude.$t;
        lat = data.petfinder.shelter.latitude.$t;
        mqQuery = lat + "," + lon;
        localStorage.setItem(id, mqQuery);
      }
    });
  }

  //Asks the user to allow us to access their current location to develop map and directions
  function geoLoc(i) {
    if (geoCount < 1) {
      navigator.geolocation.getCurrentPosition(success, error);
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        current = lat + ',' + lon;
        geoCount++;
        if (wantMap) {
          buildMap(mqQuery);
        }
        else {
          printDirections(i);
        }
      }
      function error() {
        console.log("not given location access by user");
        noGeo = true;
        noGeoloc(i);
    
      }
    }
    else {
      if (wantMap) {
        buildMap(mqQuery);
      }
      else {
        printDirections(i);
      }
    }
  }

  //uses current location and desired destination to build a map with a route between these 2 points
  function buildMap(mqQuery) {

    L.mapquest.key = 'oKGNJy7554W39K4kH01ZGPwNamd85M0c';

    destination = mqQuery;
    console.log(current, destination);
    // 'map' refers to a <div> element with the ID map
    L.mapquest.map('mapID', {
      center: [0, 0],
      layers: L.mapquest.tileLayer('map'),
      zoom: 5
    });

    L.mapquest.directions().route({

      start: current,
      end: destination
    });
    wantMap = false;
  }


  //adds step by step directions to find pet
  function printDirections(divId) {

    destination = mqQuery;

    var queryURL = "https://www.mapquestapi.com/directions/v2/route?key=oKGNJy7554W39K4kH01ZGPwNamd85M0c&from=" + current + "&to=" + destination;

    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      if (response.route) {
        directions = response.route.legs[0].maneuvers;
        var dirTitle = $("<h4>").text("Driving Directions");
        $("#" + divId).append(dirTitle).append("<hr>");

        for (var i = 0; i < directions.length; i++) {
          //dirArray.push(directions[i].narrative);
          if(i === directions.length - 1){
            var dir = $("<p>").text(directions[i].narrative);
          } 
          else {
          var dir = $("<p>").text("- " + directions[i].narrative + " (" + response.route.legs[0].maneuvers[i].distance + " miles)");
        }
          $(dir).addClass("directions-step");
          $("#" + divId).append(dir).append;
        }
        
      }
      else {
        console.log("Couldn't find directions");
      }
    });
  }

  //removes incorrect input warning when user clicks the 'X'
  $(".delete").on("click", function () {
    $("article").addClass("hide");
  });

};