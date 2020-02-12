var L;
var lat;
var lon;
window.onload = function() {
$("#submitBtn").on("click", function(event) {
    event.preventDefault();
    
    var animalType = $("#animalType").val();
    console.log(animalType);
    var breedType = $("#breed").val();
    console.log(breedType);
    var sex = $("#sex").val();
    console.log(sex);
    var zip = $("#zip").val();
    console.log(zip);
    var url = "http://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466" +"&animal=" + animalType + "&breed=" + breedType + "&sex=" + sex + "&location=" + zip +"&format=json";
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
        for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
        var petName = $("<p>").text(data.petfinder.pets.pet[i].name.$t);
        var petAge = $("<p>").text("Age: " + data.petfinder.pets.pet[i].age.$t);
        var petSex = $("<p>").text("Sex: " + data.petfinder.pets.pet[i].sex.$t);
        var petCity = $("<p>").text("City: " + data.petfinder.pets.pet[i].contact.city.$t);
        var petState = $("<p>").text("State: " + data.petfinder.pets.pet[i].contact.state.$t);
        var petZip = $("<p>").text("Zip Code: " + data.petfinder.pets.pet[i].contact.zip.$t);
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
        img.attr("src", data.petfinder.pets.pet[i].media.photos.photo[1].$t);
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
        var mediaContent = $("<div>");
        mediaContent.addClass("media-content").addClass("media-right");
        //mediaContent.addClass("media-right");
        var br = $("<br>");
        var p1 = $("<p>");
        p1.addClass("title is-4");
        p1.append(petName);
        p1.append(br);
        var p2 = $("<p>");
        p2.addClass("subtitle is-6");
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
    
        var animalLink = "https://www.petfinder.com/search/pets-for-adoption/?id=" + petId;
        var anchor = $("<a>").attr("href", animalLink);
        anchor.addClass("anchor");
        anchor.text("click here to read more!");
        divCard.append(anchor);
        var separator = $("<hr>");
   
        $("#pet-div").append(rowCard, separator);
        var street =  data.petfinder.pets.pet[0].contact.address1.$t;
        var city = data.petfinder.pets.pet[0].contact.city.$t;
        var state = data.petfinder.pets.pet[0].contact.state.$t;
        mqQuery = street + ", " + city + ", " + state;
        console.log(mqQuery);
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
            current = '2004 Elcombe Ct, Chapel Hill, NC 27517';
            //var current = '36.0194048, -78.917632';
            var current = lat + ',' + lon;
            var destination = mqQuery;
        
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
        }
    })
    });
};