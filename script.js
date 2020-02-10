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
  url: "http://api.petfinder.com/pet.find?key=2f95f51b181ddd27883e91878e922466&animal=cat&breed=" + breed +"&sex=" + sex + "&location=" + zip + "&format=json",
  dataType: "jsonp",
  Method: "GET"   
})

.done(function(data){

      var result1 = data.petfinder.pets.pet[19].media.photos.photo[2].$t;

      console.log(data);
      console.log(result1);
       
     var photo1 =  $("<img>").attr("src" , result1);
     photo1.css()



     $("#showPhotos").append(photo1);
})

})
