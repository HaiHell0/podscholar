console.log("index.js is being used");
function index() {
  $.ajax(`/api/categories`, {
    type: "GET",
    dataType: "json",
    success: function (res) {
        var tags = "";
        res.forEach((tag)=>{
            tags+=`<tr><td><a href="/pages/categoryTag/${tag._id}">${tag._id}</a></td><td>${tag.count}</td></tr>`
        })
        $("#search-results").html("");
        $("#search-results").append(`
        <div class="row d-flex justify-content-center mx-auto col-6">
        <table class="table">
        <thead>
          <tr>
           
            <th scope="col">Tag</th>
            <th scope="col">Number or podcast</th>
            
          </tr>
        </thead>
        <tbody>
            ${tags}
          </tbody>
      </table>
      </div>
        `);
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}
index();