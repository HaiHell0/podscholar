var article_title;
var journal;
var publish_date;
var DOI;
var keywords;
var audio_file;
var authors;
var abstract;
$("#upload-form").on("submit", function (e) {
  e.preventDefault();
  article_title = $("#p_article_title").val();
  journal = $("#p_journal").val();
  publish_date =$("#p_publish_date").val();
  DOI = $("#p_doi").val();
  keywords=$("#p_keyword").val().split();
  audio_file = "skip";
  abstract=$("#p_abstract").val();
  uploadPodcast(article_title, journal, publish_date, DOI, keywords, audio_file, abstract)
  
});

function uploadPodcast(article_title, journal, publish_date, DOI, keywords, audio_file, abstract) {
  $.ajax(`/api/podcast/upload`, {
    type: "POST",
    data: {
      authors:window.sessionStorage.getItem("userId"),
      title: article_title,
      journal:journal,
      publish_date: publish_date,
      doi: DOI,
      keywords:keywords,
      audio_file:audio_file,
      abstract:abstract,
      audio_file:"https://www.mboxdrive.com/Patrick10.mp3",
      likes:0,
      bookmarks:0
      
    }, // data to submit
    success: function () {
      console.log("success");
      alert("Uploaded")
      $("#manuscript").html(`
        <div><h1 class="text-center mt-4">Your podcast had been uplaoded</h1>
        <h3 class="text-center mt-4">Your podcast ${article_title} has been uploaded</h3>
        </div>`
      )
     
    },
    error: function (errorMessage) {
      alert("Something went wrong")
      console.log("Error" + errorMessage);
    },
  });
}

function checkSession() {
  if (window.sessionStorage.getItem("userId") == null) {
    alert("You are not logged in")
    window.location.href = "index.ejs";
  }
}
checkSession();

