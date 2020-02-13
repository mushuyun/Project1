//declaring global variables
var L;
window.onload = function () {
var sex, zip, street, city, state, arrayCount, mediaContent, directions, current, destination, breedType, animalType, lat, lon, mqQuery;
dirArray = [];
var geoCount = 0;
var wantMap = false;


  //Map display button click event
  $(document).on("click", "#mapBtn", function (event) {
    event.preventDefault();
    $("#mapID").remove();
    mapDiv = $("<div>").attr("id", "mapID");
    $(this).parent("div").prepend(mapDiv);

    var i = $(this).parent("div").attr("id");
    mqQuery = localStorage.getItem(i);

    mapTime(i);
  });



  //Direction display button click event
  $(document).on("click", "#directionsBtn", function (event) {
    event.preventDefault();
    var divId = $(this).parent("div").attr("id");

    var i = $(this).parent("div").attr("id");;
    mqQuery = localStorage.getItem(i);
    getDirections(divId);
  });

  //Start Button Click Event
  $(document).on("click", ".start-button", function (event) {
    event.preventDefault();
    var divId = $(this).parent("div").attr("id");

    var i = $(this).parent("div").attr("id");
    console.log(i);
    mqQuery = localStorage.getItem(i);
    current = $("#start" + i).val();
    console.log(current, mqQuery);
  
    if(wantMap) {
      buildMap(mqQuery);
    }
    else {
      printDirections(divId);
    }
  });


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
    if (zip < 10000 || zip > 99999) {
      $("#zip").val("Must be a 5 digit number");
      $("#zip").attr("style", "color: red");
    }
    console.log(zip);
    apiCall();
  });

//Makes the all letters lowercase except 1st in every word
  function formatBreed(breed) {
    var splitStr = breed.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }



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
        /*   console.log(data.petfinder.pets.pet[0].contact);
           console.log(data.petfinder.pets.pet[0].contact.state);
           console.log(data.petfinder.pets.pet[0].contact.city);
           console.log(data.petfinder.pets.pet[0].contact.zip);
           console.log(data.petfinder.pets.pet[0].contact.address1);
           console.log(data.petfinder.pets.pet[0].contact.email);
           console.log(data.petfinder.pets.pet[0].media.photos.photo[0]);
           console.log(data.petfinder.pets.pet[0].description); */
        // console.log(data.petfinder.pets.pet[i].name.$t);
        //data.petfinder.pets.pet.length
        if (!data.petfinder.pets || !data.petfinder.pets.pet) {
          $("article").removeClass("hide");
        }
        else {
          $("article").addClass("hide");
          for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
            if (data.petfinder.pets.pet[i].media.photos) {
              var id = i;
              var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);
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
              //console.log(i, data.petfinder.pets.pet[i].media.photos);

              img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[1].$t);

              //img.attr("width", 200);
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

              $(mediaContent).append(petName).append(separator).append(figure).append(petAge).append(petSex).append(petLocation).append(petEmail).append("<br>").append(anchor).append("<br>");

              street = data.petfinder.pets.pet[i].contact.address1.$t;
              city = data.petfinder.pets.pet[i].contact.city.$t;
              state = data.petfinder.pets.pet[i].contact.state.$t;
              mqQuery = street + ", " + city + ", " + state;
              localStorage.setItem(id, mqQuery);

              if (data.petfinder.pets.pet[i].shelterId.$t && data.petfinder.pets.pet[i].shelterId.$t !== "NC917" ) {
                shelterId = data.petfinder.pets.pet[i].shelterId.$t;
                shelterFind(shelterId, i);
               

                var mapBtn = $("<button>");
                mapBtn.attr("id", "mapBtn");
                mapBtn.text("Display Map");
                mediaContent.append(mapBtn);

                var directionsBtn = $("<button>");
                directionsBtn.attr("id", "directionsBtn");
                directionsBtn.text("Display Directions");
                mediaContent.append(directionsBtn);
                
              }


              //adds directions and map button if address is available
              if (data.petfinder.pets.pet[i].contact.address1.$t) {
                var street = data.petfinder.pets.pet[i].contact.address1.$t;
                //filter out PO Boxes
                if (street[0] !== "P" || street[1] !== "O") {
                  if (street[0] !== "P" || street[1] !== ".") {
                    if (street[0] !== "P" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t") {
                      if (street[0] !== "F" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t") {
                        var mapBtn = $("<button>");
                        mapBtn.attr("id", "mapBtn");
                        mapBtn.text("Display Map");
                        mediaContent.append(mapBtn);

                        var directionsBtn = $("<button>");
                        directionsBtn.attr("id", "directionsBtn");
                        directionsBtn.text("Display Directions");
                        mediaContent.append(directionsBtn);
                      }
                    }
                  }
                }
              }
            }
            var startLabel = $("<p>").text('Choose Starting Address').addClass("hide").attr("id", "startLabel" + i);
            var startQ = $("<input>").addClass("input hide start").attr("id", "start" + i).attr("type", "text").attr("placeholder", "914 W Main St,Durham, NC 27701");
            var startButton = $("<button>").addClass("button hide start-button").attr("id", "startBtn" + i).text("START");
            $(mediaContent).append(startLabel).append(startQ).append(startButton);
            mediaContent.append(br);
            


            $("#pet-div").append(rowCard, separator);


          }
        }
      }
    });
  }



  function shelterFind(shelterId, id) {
    var url = "https://api.petfinder.com/shelter.get?key=2f95f51b181ddd27883e91878e922466" + "&id=" + shelterId + "&format=json";



    $.ajax({
      url: url,
      dataType: "jsonp",
      type: "GET",
      error: function () {
      },
      success: function (data) {
        console.log(data);


        console.log(data.petfinder.shelter);
        lon = data.petfinder.shelter.longitude.$t;
        lat = data.petfinder.shelter.latitude.$t;
        mqQuery = lat + "," + lon;
        localStorage.setItem(id, mqQuery);
      }
    });
  }


  function mapTime(i) {

    if (geoCount < 1) {
      navigator.geolocation.getCurrentPosition(success, error);
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        current = lat + ',' + lon;
        buildMap(mqQuery);
        geoCount++;
      }
      function error() {
        console.log("not given location access by user");
        $("#start" + i).removeClass("hide");
        $("#startLabel" + i).removeClass("hide");
        $("#startBtn" + i).removeClass("hide");
        wantMap = true;
      }
    }
    else {
      buildMap(mqQuery);
    }
  }

  function buildMap(mqQuery) {

    L.mapquest.key = 'oKGNJy7554W39K4kH01ZGPwNamd85M0c';
   
    //var current = '36.0194048, -78.917632';
  
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




  function getDirections(divId) {
    if (geoCount < 1) {
      navigator.geolocation.getCurrentPosition(success, error);
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        current = lat + ',' + lon;
        geoCount++;
        printDirections(divId);
      }
      function error() {
        console.log("not given location access by user");
        $("#start" + divId).removeClass("hide");
        $("#startLabel" + divId).removeClass("hide");
        $("#startBtn" + divId).removeClass("hide");
      }
    }
    else {
      printDirections(divId);
    }

  }
  //var current = "39.750307,-104.999472"
  //var current ="2004 Elcombe Ct,Chapel Hill,NC";
  //var destination = "914 W Main St,Durham,NC";
  //var destination = "39.750907,-104.999272"
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
          //console.log(directions[i].narrative);
          dirArray.push(directions[i].narrative);
          var dir = $("<p>").text("-" + directions[i].narrative);
          $("#" + divId).append(dir);
        }
      }
      else {
        console.log("Couldn't find directions");
      }
    });
  }

  $(".delete").on("click", function () {
    $("article").addClass("hide");
  });

};