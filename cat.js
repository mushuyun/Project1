//call petfinder api
//var breed;
//var sex;
//var zipcode;
//var breed = "Siamese"; Balinese
//var sex = "F";
//var zipcode = "27704";
$("#submitBtn").on("click", function(){
    var breed = $("#breed").val();
    var sex = $("#sex").val();
    var zip = $("#zip").val();
    $.ajax({
      url: "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=" + breed +"&sex=" + sex + "&location=" + zip + "&format=json",
      dataType: "jsonp",
      Method: "GET"   
    })
    .done(function(data){
      for(i = 0; i < 10; i++){
        var result1 = data.petfinder.pets.pet[i].media.photos.photo[3].$t;
        var phone1 = data.petfinder.pets.pet[i].contact.phone.$t;
        var state = data.petfinder.pets.pet[i].contact.state.$t;
        var city = data.petfinder.pets.pet[i].contact.city.$t;
        var zip = data.petfinder.pets.pet[i].contact.zip.$t;
        var email = data.petfinder.pets.pet[i].contact.email.$t;
        var address = '<br />' + city + " " + state + ", " + zip + '<br />' + "Email: " + email;
      
        var photo =  $("<img>").attr("src" , result1);
       $("#cat" + i).append(photo); 
       $("#cat" + i).append(address);
      }
          
    })
  })
  //hard code to load cat photo on webpage
  //Bombay female
  $.ajax({
    url: "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=Bombay&sex=F&location=27704&format=json",
    dataType: "jsonp",
    Method: "GET"   
  })
  .done(function(data){
        var result1 = data.petfinder.pets.pet[15].media.photos.photo[3].$t;
        var phone1 = data.petfinder.pets.pet[15].contact.phone.$t;
        var state = data.petfinder.pets.pet[15].contact.state.$t;
        var city = data.petfinder.pets.pet[15].contact.city.$t;
        var zip = data.petfinder.pets.pet[15].contact.zip.$t;
        var email = data.petfinder.pets.pet[15].contact.email.$t;
        var address =  city + " " + state + ", " + zip + '<br />' + "Email: " + email;
      //  console.log(data);
      //  console.log(address);
         
       var photo1 =  $("<img>").attr("src" , result1);
       $("#Bombay1").append(photo1);
       $("#contactBombay").append(address);
  })
  //Snowshoe male
  $.ajax({
    url: "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=Snowshoe&sex=M&location=27704&format=json",
    dataType: "jsonp",
    Method: "GET"   
  })
  .done(function(data){
    var result1 = data.petfinder.pets.pet[3].media.photos.photo[3].$t;
    var phone1 = data.petfinder.pets.pet[3].contact.phone.$t;
    var state = data.petfinder.pets.pet[3].contact.state.$t;
    var city = data.petfinder.pets.pet[3].contact.city.$t;
    var zip = data.petfinder.pets.pet[3].contact.zip.$t;
    var email = data.petfinder.pets.pet[3].contact.email.$t;
    var address =  city + " " + state + ", " + zip + '<br />' + "Email: " + email;
    var photo1 =  $("<img>").attr("src" , result1);
    $("#contactSnowshoe").append(address);
    $("#Snowshoe1").append(photo1);
  })
  //Siamese female
  $.ajax({
    url: "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=Tiger&sex=F&location=27704&format=json",
    dataType: "jsonp",
    Method: "GET"   
  })
  .done(function(data){
    var result1 = data.petfinder.pets.pet[2].media.photos.photo[3].$t;
    var phone1 = data.petfinder.pets.pet[2].contact.phone.$t;
    var state = data.petfinder.pets.pet[2].contact.state.$t;
    var city = data.petfinder.pets.pet[2].contact.city.$t;
    var zip = data.petfinder.pets.pet[2].contact.zip.$t;
    var email = data.petfinder.pets.pet[2].contact.email.$t;
    var address =  city + " "  + zip + " " + state + '<br />' + "Email: " + email;
    var photo1 =  $("<img>").attr("src" , result1);
    $("#contactTiger").append(address);
    $("#Tiger1").append(photo1);
  }) 
  //Siamese female
  $.ajax({
    url: "https://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=Siamese&sex=F&location=27704&format=json",
    dataType: "jsonp",
    Method: "GET"   
  })
  .done(function(data){
    var result1 = data.petfinder.pets.pet[19].media.photos.photo[2].$t;
    var phone1 = data.petfinder.pets.pet[19].contact.phone.$t;
    var state = data.petfinder.pets.pet[19].contact.state.$t;
    var city = data.petfinder.pets.pet[19].contact.city.$t;
    var zip = data.petfinder.pets.pet[19].contact.zip.$t;
    var email = data.petfinder.pets.pet[19].contact.email.$t;
    var address =  city + " " + state + ", " + zip + '<br />' + "Email: " + email;
   
    var photo1 =  $("<img>").attr("src" , result1);
    $("#Siamese1").append(photo1);
    $("#contactSiamese").append(address);
  })