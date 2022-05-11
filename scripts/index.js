

console.log("index.js is being used");
function index() {
  $.ajax(`/api`, {
    type: "GET",
    dataType: "json",
    success: function (res) {
      podcastArrayToString(res,3)
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}
index();