$(document).on("click", "#logout", function () {
  $("#upload").remove();
  $("#account").remove();
  $("#logout").remove();
  window.sessionStorage.removeItem("userId");
  $(".navbar-nav").append(`<li id="register" class="nav-item">
  <a class="nav-link" href="register.html">Register</a>
    </li>`);
  $(".navbar-nav").append(`<li id="login" class="nav-item">
    <a class="nav-link" href="login.html">Login</a>
        </li>`);
  window.location.href = "/login";
});

function setUserDashboard(userId) {
  $("#register").remove();
  $("#login").remove();
  $(".navbar-nav").append(`<li id="upload" class="nav-item">
    <a class="nav-link" href="upload.html">Upload Podcast</a>
      </li>`);
  $(".navbar-nav").append(`<li id="account" class="nav-item">
    <a class="nav-link" href="/account">Account</a>
      </li>`);
  $(".navbar-nav").append(`<li id="logout" class="nav-item">
      <a class="nav-link" href="/logout">Logout</a>
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