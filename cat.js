var L;
	window.onload = function () {
	  var sex, zip, street, city, state, mediaContent, directions, current, destination, breedType, animalType, lat, lon, mqQuery;
	  dirArray = [];
	  var geoCount = 0;
	  var wantMap = false;
	  var shelter = false;
	  noGeo = false;

	  $(document).ready(function(){
		$('select').formSelect();
	  });
	


	  //Submit Button click event with text formatting and user error handling
	  $("#submitBtn").on("click", function (event) {
	    event.preventDefault();
	    $("#zip").attr("style", "color: black");
	    $("#sex").attr("style", "color: black");
	    $("#pet-div").empty();
	    $("#catContent").empty();
	    
	

	    breedType = $("#breed").children("option:selected").text();
      if (breedType == "Select Breed") {
        breedType = "";
      }
	    console.log(breedType);
	    sex = $("#sex").val().toUpperCase();
	    if (sex !== "M" && sex !== "F" && sex !== "") {
	      $("#sex").val("Can only input M or F or leave blank");
	      $("#sex").attr("style", "color: red");
	    }
	    console.log(sex);
	    zip = $("#zip").val();
	    console.log(zip);
	    if (zip > 9999 && zip < 100000) { }
	    else {
	      $("#zip").val("Must be a 5 digit number");
	      $("#zip").attr("style", "color: red");
	    }
	    catSearch($("#breed").children("option:selected").text());
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
	    console.log(i);
	    mqQuery = localStorage.getItem(i);
	    $("#startBtn" + i).text("Display Map");
	

	    if (noGeo) {
	      noGeoloc(i);
	    }
	    else {
	      geoLoc(i);
	    }
	  });
	


	  //Direction display button click event
	  $(document).on("click", "#directionsBtn", function (event) {
	    event.preventDefault();
	

	    var i = $(this).parent("div").attr("id");
	    mqQuery = localStorage.getItem(i);
	    $("#startBtn" + i).text("Get Directions");
	    if (noGeo) {
	      noGeoloc(i);
	    }
	    else {
	      geoLoc(i);
	    }
      $(this).remove();

	  });
	

	

	  //Shows input box for current address when geolocation is disabled
	  function noGeoloc(i) {
	    //$("#" + i).children("#directionsBtn").addClass("hide");
	    $("#start" + i).removeClass("hide");
	    $("#startLabel" + i).removeClass("hide");
	    $("#startBtn" + i).removeClass("hide");
	    if (localStorage.getItem("current")) {
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
      var breed = $("#breed").children("option:selected").text();
	    var splitStr = breed.toLowerCase().split(' ');
	    for (var i = 0; i < splitStr.length; i++) {
	      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	    }
	    return splitStr.join(' ');
	  }
	

    //add event listener to resetBtn

  $("#resetBtn").on("click", function(){
    
    $('input[id=sex]').val('');
    $('input[id=zip]').val('');
     
    $("#breed").children("option:selected").index(0);
    
  });

	  //Takes users pet search and passes it to the Petfinder Api to get info on the closest 25 animals that match their criteria
	  function apiCall() {
	    var url = "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat" + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip + "&format=json";
	    //var url = "http://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466" +"&animal=" + animalType + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip +"&format=json";
	

	    $.ajax({
	      url: url,
	      dataType: "jsonp",
	      type: "GET",
	      error: function () {
	        $(".notification").removeClass("hide");
	      },
	      success: function (data) {
	        console.log(data);
	

	        if (!data.petfinder.pets || !data.petfinder.pets.pet) {
	          $(".notification").removeClass("hide");
	        }
	        else {
	          $(".notification").addClass("hide");
	          for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
	            if (data.petfinder.pets.pet[i].media.photos) {
	              var id = i;
	              var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);
	

	              var breeds = [];
	              if (data.petfinder.pets.pet[i].breeds.breed.$t) {
	                breeds.push(data.petfinder.pets.pet[i].breeds.breed.$t)
	              }
	              for (var j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++) {
	                if (data.petfinder.pets.pet[i].breeds.breed[j].$t) {
	                  breeds.push(data.petfinder.pets.pet[i].breeds.breed[j].$t);
	                }
	              }
	              console.log(breeds);
	              var breedsList = $("<p>").text("Breed: " + breeds);
	

	

	              var petAge = $("<p>").text("Age: " + data.petfinder.pets.pet[i].age.$t);
	              var petSex = $("<p>").text("Sex: " + data.petfinder.pets.pet[i].sex.$t);
	              var petLocation = $("<p>").text("Location: " + data.petfinder.pets.pet[i].contact.city.$t + ", " + data.petfinder.pets.pet[i].contact.state.$t + ", " + data.petfinder.pets.pet[i].contact.zip.$t);
	              var petEmail = $("<a id='lol'>").attr("href", "mailto:" + data.petfinder.pets.pet[i].contact.email.$t).text("Email: " + data.petfinder.pets.pet[i].contact.email.$t);
	

	              // var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
	              // var anchor = $("<a>").attr("href", animalLink).attr('target', '_blank');
	

	              // anchor.text("- [Click here to read more about " + data.petfinder.pets.pet[i].name.$t + "!]");
	              // var separator = $("<hr>");
	              /////
	

	              var rowContainer = $("<div>");
	              rowContainer.addClass("row column");
	              var divColumn = $("<div>");
	              divColumn.addClass("column column");
	              var divCard = $("<div>");
	              divCard.addClass("card is-horizontal");
	              var divCardImg = $("<div>");
	              divCardImg.addClass("figure-content");
	

	              var figure = $("<div>");
	              figure.addClass("card-image");
	              var img = $("<img>");
	              img.addClass("img-size");
	              img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[2].$t);
	              img.attr("alt", "dog and cat pictures");
	

	              if (data.petfinder.pets.pet[i].media.photos) {
	                img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[2].$t);
	              }
	

	              var divCardStacked = $("<div>");
	              divCardStacked.addClass("card-stacked");
	              var divCardContent = $("<div>");
	              divCardContent.addClass("card-content");
	              var divMediaContent = $("<div>");
	              divMediaContent.addClass("media-content");
	              // p tags //
	              var p1 = $("<p>");
	              p1.addClass("title is-4 no-padding");
	              var p2 = $("<p>");
	              p2.addClass("subtitle is-6");
	

	              var petId = data.petfinder.pets.pet[i].id.$t;
	              rowContainer.append(divColumn);
	              divColumn.append(divCard);
	              divCard.append(divCardImg);
	              divCardImg.append(figure);
	              figure.append(img);
	              ///
	              //// mediaContent holds all the text info
	              var mediaContent = $("<div>");
	              mediaContent.addClass("media-content").addClass("media-right").attr("id", i);
	

	              p1.append(petName);
	              //p1.append(br);
	

	              p2.append(breedsList);
	              var p3 = $("<p>");
	              p3.addClass("subtitle is-6");
	              p3.append(petSex);
	              var p4 = $("<p>");
	              p4.addClass("subtitle is-6");
	              p4.append(petAge);
	              var p5 = $("<p>");
	              p5.addClass("subtitle is-6");
	              p5.append(petLocation);
	              var p6 = $("<p>");
	              p6.addClass("subtitle is-6");
	              p6.append(petEmail);
	              var p7 = $("<p>");
	

	

	

	

	              divCard.append(mediaContent);
	              mediaContent.append(p1).append(p2).append(p3).append(p4).append(p5).append(p6);
	

	              // var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
	              // var anchor = $("<a>").attr("href", animalLink);
	              // anchor.addClass("anchor");
	              // anchor.text("click here to read more!");
	              // divCard.append(anchor);
	

	

	              var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
	              var anchor = $("<a>").attr("href", animalLink).attr('target', '_blank').addClass("anchor");
	

	              anchor.text("[Click here to read more about " + data.petfinder.pets.pet[i].name.$t + "!]");
	              //divCard.append(anchor);
	              var br = $("<br>")
	              mediaContent.append(anchor).append(br);
	

	

	              /////
	

	

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
	

	            $("#pet-div").append(rowContainer);
	

	            street = data.petfinder.pets.pet[i].contact.address1.$t;
	            city = data.petfinder.pets.pet[i].contact.city.$t;
	            state = data.petfinder.pets.pet[i].contact.state.$t;
	            mqQuery = street + ", " + city + ", " + state;
	            localStorage.setItem(id, mqQuery);
	

	          }
	        }
	      }
	    });
	  }
	

	

	  //uses shelterId to find the location of shelter
	  function shelterFind(shelterId, id) {
	    console.log(shelterId, id)
	    var url = "https://api.petfinder.com/shelter.get?key=2f95f51b181ddd27883e91878e922466" + "&id=" + shelterId + "&format=json";
	

	    $.ajax({
	      url: url,
	      dataType: "jsonp",
	      type: "GET",
	      error: function () {
	      },
	      success: function (data) {
	        console.log(data);
	        if (data.petfinder.shelter) {
	          lon = data.petfinder.shelter.longitude.$t;
	          lat = data.petfinder.shelter.latitude.$t;
	          mqQuery = lat + "," + lon;
	          localStorage.setItem(id, mqQuery);
	        }
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
	        $("#" + divId).append("<hr>").append(dirTitle).append("<hr>");
	

	        for (var i = 0; i < directions.length; i++) {
	          //dirArray.push(directions[i].narrative);
	          if (i === directions.length - 1) {
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
	    $(".notification").addClass("hide");
	  });
	

	};















 