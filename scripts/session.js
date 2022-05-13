$(document).on("click", "#logout", function () {
  $("#upload").remove();
  $("#account").remove();
  $("#logout").remove();
  window.sessionStorage.removeItem("userId");
  $(".navbar-right").append(`<li id="register" class="nav-item">
  <a class="nav-link" href="/auth/signup">Register</a>
    </li>`);
  $(".navbar-right").append(`<li id="login" class="nav-item">
    <a class="nav-link" href="/auth/signin">Login</a>
        </li>`);
  window.location.href = "/pages/login";
});

function setUserDashboard(userId) {
  $("#register").remove();
  $("#login").remove();
  $(".navbar-right").append(`<li id="upload" class="nav-item">
    <a class="nav-link" href="upload.html">Upload Podcast</a>
      </li>`);
  $(".navbar-right").append(`<li id="account" class="nav-item">
      <a class="nav-link" href="/users/${userId}">Your Profile</a>
        </li>`);
  $(".navbar-right").append(`<li id="account" class="nav-item">
    <a class="nav-link" href="/account">Account</a>
      </li>`);
  $(".navbar-right").append(`<li id="logout" class="nav-item">
      <a class="nav-link" href="/auth/logout">Logout</a>
          </li>`);
}

function checkSession() {
  var session = window.sessionStorage.getItem("userId");
  if (session == null) {
    console.log("Not login");
  } else {
    setUserDashboard(session);
  }
}
checkSession();