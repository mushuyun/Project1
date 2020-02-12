var L;
var lat;
var lon;
var animalType;
var breedType;
var sex;
var zip;
var street;
var city;
var state;
var arrayCount;
var mediaContent;
var directions;
var dirArray;
var current;
var destination;
dirArray=[];
var geoCount = 0;
var callbackCount = 0;
window.onload = function () {


  //Map display button click event
  $(document).on("click", "#mapBtn", function (event) {
    event.preventDefault();
    $("#mapID").remove();
    mapDiv = $("<div>").attr("id", "mapID");
    $(this).parent("div").prepend(mapDiv);
   

    var i = $(this).parent("div").attr("id");
    console.log(localStorage.getItem(i));
    mqQuery = localStorage.getItem(i);

    mapTime();
  });



  //Direction display button click event
  $(document).on("click", "#directionsBtn", function (event) {
    event.preventDefault();
    var divId = $(this).parent("div").attr("id");
    
    var i = $(this).parent("div").attr("id");
    console.log(localStorage.getItem(i));
    mqQuery = localStorage.getItem(i);
    getDirections(divId);
    
    
   // $(this).parent("div").append(dirDiv);
    
    
  });



  $("#submitBtn").on("click", function (event) {
    event.preventDefault();

    $("#pet-div").empty();

    animalType = $("#animalType").val();
    console.log(animalType);
    breedType = $("#breed").val();
    breedType = formatBreed(breedType);
    console.log(breedType);
    sex = $("#sex").val();
    console.log(sex);
    zip = $("#zip").val();
    console.log(zip);
    apiCall();
  });


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

        for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
          var id = i;
          var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);
          var petAge = $("<p>").text("Age: " + data.petfinder.pets.pet[i].age.$t);
          var petSex = $("<p>").text("Sex: " + data.petfinder.pets.pet[i].sex.$t);
          var petLocation = $("<p>").text("Location: " + data.petfinder.pets.pet[i].contact.city.$t + ", " + data.petfinder.pets.pet[i].contact.state.$t + ", " + data.petfinder.pets.pet[i].contact.zip.$t);
          var petEmail = $("<p>").text("Email: " + data.petfinder.pets.pet[i].contact.email.$t);
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
          figure.addClass("image is-96x96");
          var img = $("<img>");
          //console.log(i, data.petfinder.pets.pet[i].media.photos);
          if (data.petfinder.pets.pet[i].media.photos) {
            img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[1].$t);
          }
          //img.attr("width", 200);
          var separator = $("<hr>");
          var petId = data.petfinder.pets.pet[i].id.$t;
          rowCard.append(thirdCol);
          thirdCol.append(divCard);
          divCard.append(divCardContent);
          divCardContent.append(divMedia);
          divMedia.append(divMediaLeft);
          divMediaLeft.append(figure);
          figure.append(img);
          mediaContent = $("<div>");
          mediaContent.addClass("media-content").addClass("media-right").attr("id", i);
          //mediaContent.addClass("media-right");
          var br = $("<br>");

          petName.addClass("title is-4");
          petName.append(br);

          petAge.addClass("subtitle is-6");
          petSex.addClass("subtitle is-6");
          petLocation.addClass("subtitle is-6");
          petEmail.addClass("subtitle is-6");
         

          divCard.append(mediaContent);
          mediaContent.append(petName).append(separator).append(petAge).append(petSex).append(petLocation).append(petEmail);

          //add directions button if address is available
         
          
          if(data.petfinder.pets.pet[i].contact.address1.$t){
          var street = data.petfinder.pets.pet[i].contact.address1.$t;
          //filter out PO Boxes
            if(street[0] !== "P" || street[1] !== "O"){
              if(street[0] !== "P" || street[1] !== "."){
                if(street[0] !== "P" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t"  ){
                  if(street[0] !== "F" || street[1] !== "o" || street[2] !== "s" || street[3] !== "t"  ){
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

          var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
          var anchor = $("<a>").attr("href", animalLink).attr('target', '_blank');
          anchor.addClass("anchor");
          anchor.text("click here to read more!");
          divCard.append(anchor);
          var separator = $("<hr>");

          $("#pet-div").append(rowCard, separator);
          street = data.petfinder.pets.pet[i].contact.address1.$t;
          city = data.petfinder.pets.pet[i].contact.city.$t;
          state = data.petfinder.pets.pet[i].contact.state.$t;
          mqQuery = street + ", " + city + ", " + state;
          localStorage.setItem(id, mqQuery);

        }
      }
    });
  }


  function mapTime() {

    console.log(mqQuery);
    if (geoCount < 1) {
      navigator.geolocation.getCurrentPosition(success, error);
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        buildMap(mqQuery);
        geoCount++;
      }
      function error() {
        console.log("not given location access by user");
      }
    }
    else {
      buildMap(mqQuery);
    }
  }

  function buildMap(mqQuery) {

    L.mapquest.key = 'oKGNJy7554W39K4kH01ZGPwNamd85M0c';
    current = '2004 Elcombe Ct, Chapel Hill, NC 27517';
    //var current = '36.0194048, -78.917632';
    current = lat + ',' + lon;
    destination = mqQuery;

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
  }




  function getDirections(divId) {
    if (geoCount < 1) {
      navigator.geolocation.getCurrentPosition(success, error);
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        geoCount++;
        printDirections(divId);
      }
      function error() {
        console.log("not given location access by user");
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
    
    current = lat + ',' + lon;
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
        $("#"+ divId).append(dirTitle);
      
        for (var i = 0; i < directions.length; i++) {
          //console.log(directions[i].narrative);
          dirArray.push(directions[i].narrative); 
          var dir = $("<p>").text("-" + directions[i].narrative);
          $("#"+ divId).append(dir);
        }
        console.log(dirArray, divId);

        
      }
      else {
        console.log("Couldn't find directions");
      }

    });

  }
  

};