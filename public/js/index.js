//Function to handle the movie search
function handleSearch(e) {
  e.preventDefault();

  var search = $("#search-val").val();

  $.ajax({
    method: "POST",
    url: "/search/movie",
    data: { search: search },
    success: function (data) {
      //Display results in html
      console.log(data);
    }
  });
}
//Movie Search Form Event Listener
$("#search-form").on("submit", handleSearch);


//Gets Movie Data when clicking movie poster from backend
$(".card-layout").on("click", ".movie", function (e) {
  e.preventDefault();

  var id = $(this).data("id");

  $.ajax({
    method: "GET",
    url: "/movie/" + id,
    data: { id: id },
    success: function (data) {
      console.log(data);

      $("#movie-modal .modal-title").html(data.title);

      var genres = [];
      data.genres.forEach(function (genre) {
        genres.push(genre.name);
      });

      var movieHtml = `
        <img src="https://image.tmdb.org/t/p/original${data.backdrop_path}"/ class="d-block img-fluid">
        <p class="mt-2">${data.overview}</p>

        <p class="d-flex justify-content-between align-items-center"><a href="${data.homepage}" target="_blank" class="movie-link">Movie Homepage</a><i class="far fa-heart h3 favorite" data-id="${data.id}"></i></p>

        <p class="movie-info">Released Date: ${data.release_date}</p>
        <p class="movie-info">Rating: ${data.vote_average}/10</p>
        <p class="movie-info">Minutes: ${data.runtime}</p>
        <p class="movie-info">Genres: ${genres.join()}</p>
      `;

      $("#movie-modal .modal-body").html(movieHtml);

      $("#movie-modal-btn").trigger("click");
    }
  })
});

$(".card-layout").on("click", ".favorited", function () {
  var id = $(this).data("id");

  $.ajax({
    type: "POST",
    url: "/favorite/delete",
    data: { id },
    success: function (response) {
      if (response.success) {
        console.log("success");
        location.reload();
      } else {
        console.log("false");
      }
    }
  })
});

$(".modal-body").on("click", ".favorite", function () {
  var id = $(this).data("id");
  var parent = $(this).parent();

  $.ajax({
    type: "POST",
    url: "/favorite",
    data: { id },
    success: function (response) {
      if (response.success) {
        parent.find(".favorite").remove();
        parent.append(`<i class="fas fa-heart h3 favorited" data-id="${id}"></i>`)
        console.log(response.msg);
      } else {
        console.log(response.msg);
      }
    }
  })
});

//Create User account handle

$("#createAccountForm").on("submit", function (e) {
  e.preventDefault();

  var account = {
    username: $("#createUsername").val(),
    email: $("#createEmail").val(),
    password: $("#createPassword").val()
  }

  $.ajax({
    method: "POST",
    url: "/account/create",
    data: account,
    success: function (data) {

      if (data.success) {
        window.location.href = "/account";
      }
    }
  })

});

$("#loginAccountForm").on("submit", function (e) {
  e.preventDefault();

  var account = {
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  }

  $.ajax({
    method: "POST",
    url: "/account/login",
    data: account,
    success: function (data) {
      if (data.success) {
        window.location.href = "/account";
      } else {
        console.log("login failed");
      }
    }
  })

});

$("#accountForm").on("submit", function (e) {
  e.preventDefault();

  var account = {
    username: $("#accountUsername").val(),
    email: $("#accountEmail").val(),
    password: $("#accountPassword").val()
  }

  $.ajax({
    method: "POST",
    url: "/account",
    data: account,
    success: function (data) {
      if (data.success) {
        // window.location.href = "/account";
        console.log("success");
      } else {
        console.log("login failed");
      }
    }
  })

});

$(".mood-btn").on("click", function () {

  var btnText = $(this).text();

  $.ajax({
    type: "GET",
    url: "/mood/" + btnText,
    success: function (data) {
      console.log(data);

      $(".card-layout").empty();
      data.results.forEach(function (result) {

        var overview = result.overview.substring(0, 80) + "...";


        var moodHtml = `<div class="card">
      <img src="https://image.tmdb.org/t/p/original${result.backdrop_path}" class="card-img-top" alt="...">
      <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="card-text">${overview}</p>
          <p class="card-text">Rating: ${result.vote_average}/10</p>
          <button class="btn movie-detail-btn movie" data-id=${result.id}>View Details</button>
          </div>
      </div>`;

        $(".card-layout").append(moodHtml);

      });
    }
  })
})

