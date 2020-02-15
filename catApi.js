//Dog and Cat breed info and pic
var catBreed;
var breedId;
var wantedBreed;

function catSearch(catBreed) {
  var queryURL = "https://api.thecatapi.com/v1/breeds/search?q=" + catBreed + "&api_key=89916d17-0951-4678-b49b-662c62818c70";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    j = 0;
    $("#catContent").empty();
    $("#catImg").attr("src", "");
    if (!response[0]) {
    }
    else if (response.length > 1) {
      $("#catDiv").removeClass("hide");
      var choice = $("<p>").text("Choose which cat breed you wanted:");
      $("#catContent").append(choice);
      for (var i = 0; i < response.length; i++) {
        var catChoices = $("<button>").text(response[i].name).addClass("catChoiceBtn");
        $("#catContent").append(catChoices);
      }

      $(document).on("click", ".catChoiceBtn", function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        $("#catContent").empty();
        $("#catImg").attr("src", "");
        wantedBreed = $(this).text();
        for (var i = 0; i < response.length; i++) {
          if (wantedBreed == response[i].name) {
            breedId = response[i].id;

            $(".catChoiceBtn").remove();
            $(choice).remove();
            j = i;
            $("#catContent").prepend("<p>Life Span: " + response[j].life_span + "</p>");
            $("#catContent").prepend("<p>Weight: " + response[j].weight.imperial + " lbs</p>");
            $("#catContent").prepend("<p>Temperament: " + response[j].temperament + "</p>");
            $("#catContent").prepend("<h4>" + response[j].name + "</h4>");
          }
        }
        catImgSearch(breedId);
      });
    }
    else if (response.length = 1) {
      breedId = response[0].id;
      catImgSearch(breedId);
      $("#catContent").prepend("<p>Life Span: " + response[j].life_span + " years</p>");
      $("#catContent").prepend("<p>Weight: " + response[j].weight.imperial + " lbs</p>");
      $("#catContent").prepend("<p>Temperament: " + response[j].temperament + "</p>");
      $("#catContent").prepend("<h4>" + response[j].name + "</h4>");

      catImgSearch(breedId);
      $("#catDiv").removeClass("hide");
    }
  });
}



function catImgSearch(breedId) {
  queryURL = "https://api.thecatapi.com/v1/images/search?breed_id=" + breedId + "&api_key=89916d17-0951-4678-b49b-662c62818c70";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    if (response[0]) {
      $("#catImg").attr("src", response[0].url);
      $("#catImg").css("width", "300px");
    }
    else {
      $("#catContent").append("<p>[No Picture Available]</p>");
    }
  });
}

