$("#keywords").html("");
$.ajax(`/api/keywords`, {
  type: "GET",
  dataType: "json",
  success: function (res) {
    console.log(res)
    res.forEach((keyword) => {
      $("#keywords").append(`
        <li><a href="/pages/keywordTag/${keyword._id}" class="btn link-dark rounded">${keyword._id}</a><div class="btn btn-sm btn-secondary rounded">${keyword.count}</div>
        </li>
        `)
    })
  },
  error: function (errorMessage) {
    console.log("Error" + errorMessage);
  },
});

$("#categories").html("");
$.ajax(`/api/categories`, {
  type: "GET",
  dataType: "json",
  success: function (res) {
    res.forEach((categories) => {
      $("#categories").append(`
        <li><a href="/pages/categoryTag/${categories._id}" class="btn link-dark rounded">${categories._id} </a><div class="btn btn-sm btn-secondary rounded">${categories.count}</div>
        </li>
        `)
    })
  },
  error: function (errorMessage) {
    console.log("Error" + errorMessage);
  },
});



console.log("Search.js is being used");
function search(search) {
  $("#search-results").html("");
  $.ajax(`/api/search/keyword/${search}`, {
    type: "GET",
    dataType: "json",
    success: function (res) {
      podcastArrayToString(res, 0);
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}


// $(document).on("click", "#savep", function (e) {
//   e.preventDefault();
//   e.stopPropagation();
//   var podcast_id = $(this).val();
//   if (window.sessionStorage.getItem("userId") == null) {
//     alert("You are not logged in");
//     window.location.href = "index.html";
//   }
//   $.ajax({
//     url: `${baseURL}/accounts/${window.sessionStorage.userId}`,
//     type: "GET",
//     success: function (data) {
//       list = [].concat(data.savedpcs);
//       if (!list.includes(podcast_id)) list.push(podcast_id);
//       list = { savedpcs: list };
//       $.ajax({
//         traditional: true,
//         url: `${baseURL}/accounts/${window.sessionStorage.userId}`,
//         type: "PATCH",
//         data: list,
//         dataType: "json",
//         success: function (data) {
//           console.log(data);
//         },
//       });
//     },
//   });
// });
// $(document).on("click", "#like", function (e) {
//   e.preventDefault();
//   e.stopPropagation();
//   var podcast_id = $(this).val();
//   if (window.sessionStorage.getItem("userId") == null) {
//     alert("You are not logged in");
//     window.location.href = "index.html";
//   }
//   $.ajax({
//     url: `${baseURL}/podcasts/${podcast_id}`,
//     type: "GET",
//     success: function (data) {
//       like = parseInt(data.likes) + 1;
//       temp = { likes: like }

//       $.ajax({
//         traditional: true,
//         url: `${baseURL}/podcasts/${podcast_id}`,
//         type: "PATCH",
//         data: temp,
//         dataType: "json",
//         success: function (data) {
//           console.log(data);
//         },
//       });
//     },
//   });
// });

$(document).on("click", "#savep", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var podcastId = $(this).val();
  if (window.sessionStorage.getItem("userId") == null) {
    alert("You are not logged in");
  } else if ($(this).text() == "Save") {
    axios({
      method: 'post',
      url: `/api/users/actions/save/${podcastId}`,
      validateStatus: () => true
    })
      .then(function (response) {
        console.log(response.data)
        if (response.data == "Error") {
          alert("Error. Please try later")
        } else if (response.data == "podcast saved!") {
          $("#savep").text("Saved")
        }
        //make another request to update bookmark count in the podcast
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if ($(this).text() == "Saved") {
    axios({
      method: 'post',
      url: `/api/users/actions/unsave/${podcastId}`,
      validateStatus: () => true
    })
      .then(function (response) {
        console.log(response.data)
        if (response.data == "Error") {
          alert("Error. Please try later")
        } else if (response.data == "podcast unsaved!") {
          $("#savep").text("Save")
        }
        //make another request to update bookmark count in the podcast
      })
      .catch(function (error) {
        console.log(error);
      });
  }

});
$(document).on("click", "#like", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var podcastId = $(this).val();
  if (window.sessionStorage.getItem("userId") == null) {
    alert("You are not logged in");
  } else if ($(this).text() == "Like") {
    console.log("true");
    axios({
      method: 'post',
      url: `/api/users/actions/like/${podcastId}`,
      validateStatus: () => true
    })
      .then(function (response) {
        console.log(response.data);
        if (response.data == "Error") {
          alert("Error. Please try later")
        } else if (response.data == "podcast liked!") {
          $("#like").text("Liked")
        }
        //make another request to update like count in the podcast
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if ($(this).text() == "Liked") {
    axios({
      method: 'post',
      url: `/api/users/actions/unlike/${podcastId}`,
      validateStatus: () => true
    })
      .then(function (response) {
        console.log(response.data)
        if (response.data == "Error") {
          alert("Error. Please try later")
        } else if (response.data == "podcast unliked!") {
          $("#like").text("Like")
        }
        //make another request to update bookmark count in the podcast
      })
      .catch(function (error) {
        console.log(error);
      });
  }

});
$("#search-text-field").keypress(function (event) {
  var keycode = event.keyCode || event.which;

  if (keycode == "13") {
    search($("#search-text-field").val());
  }
});
