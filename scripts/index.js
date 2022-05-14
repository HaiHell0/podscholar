var savedPodcast = [];
var likedPodcast = [];
console.log("index.js is being used");
function index() {
  $.ajax(`/api`, {
    type: "GET",
    dataType: "json",
    success: function (res) {
      podcastArrayToString(res, 3, savedPodcast, likedPodcast);
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}

if (window.sessionStorage.getItem("userId")) {
  axios({
    method: 'get',
    url: `/api/users/${window.sessionStorage.getItem("userId")}`,
    validateStatus: () => true
  })
    .then(function (response) {
      if (!response.data.savedPodcast) {
        savedPodcast = [];
      } else {
        savedPodcast = response.data.savedPodcast;
      }
      if (!response.data.likedPodcast) {
        likedPodcast = [];
      } else {
        likedPodcast = response.data.likedPodcast;
      }
      index();
    })
    .catch(function (error) {
      console.log(error);
    });
} else {
  index();
}
