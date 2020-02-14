
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
window.onload = function() {
  //Map display button click event
  $(document).on("click", "#mapBtn", function(event) {
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

    //animalType = $("#animalType").val();
    //console.log(animalType);
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
    //var animalType = $("#animalType").val();
    //console.log(animalType);
    //var breedType = $("#breed").val();
    //console.log(breedType);
    //var sex = $("#sex").val();
    //console.log(sex);
    //var zip = $("#zip").val();
    //console.log(zip);
    function apiCall() {
    var url = "http://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=dog" + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip + "&format=json";
    
    $.ajax({
        url: url,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
            console.log(data);
         
        for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
          var id = i;
          var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);
          var petAge = $("<p>").text("Age: " + data.petfinder.pets.pet[i].age.$t);
          var petSex = $("<p>").text("Sex: " + data.petfinder.pets.pet[i].sex.$t);
          var petCity = $("<p>").text("City: " + data.petfinder.pets.pet[i].contact.city.$t);
          var petState = $("<p>").text("State: " + data.petfinder.pets.pet[i].contact.state.$t);
          var petZip = $("<p>").text("Zip Code: " + data.petfinder.pets.pet[i].contact.zip.$t);
          var petEmail = $("<p>").text("Email: " + data.petfinder.pets.pet[i].contact.email.$t);
        //////
          var rowContainer = $("<div>");
          rowContainer.addClass("row column");
          var divColumn = $("<div>");
          divColumn.addClass("column column");
          var divCard = $("<div>");
          divCard.addClass("card is-horizontal");
          var divCardImg = $("<div>");
          divCardImg.addClass("figure-content");
          //var divMedia = $("<div>");
          //divMedia.addClass("media");
          //var divMediaLeft = $("<div>");
          //divMediaLeft.addClass("media-left");
          var figure = $("<figure>");
          figure.addClass("image is-square is-200x200");
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
        //mediaContent.addClass("media-right");
        //var br = $("<br>");
        
          p1.append(petName);
        //p1.append(br);
        
          p2.append(petAge);
          var p3 = $("<p>");
          p3.addClass("subtitle is-6");
          p3.append(petSex);
          var p4 = $("<p>");
          p4.addClass("subtitle is-6");
          p4.append(petCity);
          var p5 = $("<p>");
          p5.addClass("subtitle is-6");
          p5.append(petState);
          var p6 = $("<p>");
          p6.addClass("subtitle is-6");
          p6.append(petZip);
          var p7 = $("<p>");
          p7.addClass("subtitle is-6");
          p7.append(petEmail);

        
        
          divCard.append(mediaContent);
          mediaContent.append(p1).append(p2).append(p3).append(p4).append(p5).append(p6).append(p7);
        
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
        var anchor = $("<a>").attr("href", animalLink);
        anchor.addClass("anchor");
        anchor.text("click here to read more!");
        divCard.append(anchor);
   
        $("#pet-div").append(rowContainer);

        street =  data.petfinder.pets.pet[0].contact.address1.$t;
        city = data.petfinder.pets.pet[0].contact.city.$t;
        state = data.petfinder.pets.pet[0].contact.state.$t;
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

  function buildMap() {
        
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
        
      var queryURL = "http://www.mapquestapi.com/directions/v2/route?key=oKGNJy7554W39K4kH01ZGPwNamd85M0c&from=" + current + "&to=" + destination;
        
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

}
  




