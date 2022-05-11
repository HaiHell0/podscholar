function podcastArrayToString(res,num){
    if (num==0) num = res.length;
    for (var i = 0; i < num; i++) {
        var podcast = res[i];
        console.log(podcast)
        var authorsString = "";
        podcast.authors.forEach((author) => {
          authorsString += `<a class="text-dark" href="author.html?index=${author}">${author}</a>\t`;
        });
        var tagString = ""; 
        podcast.keywords.forEach((tag) => {
            tagString += `<a href="#"><span class="btn btn-dark btn-sm label label-info">${tag}</span></a>`;
          });
        //console.log(authorsString)
        $("#search-results").append(
`
          <div class="item col-md-6 mx-auto m-3 p-4 bg-light">
            <p class="fs-5"><strong>${podcast.title}</strong></p>
            <div>
              <p><strong>By: </strong>${authorsString}</p>
              <p><strong>Journal: </strong>${podcast.journal}</p>
              <p><strong>DOI: ${podcast.doi}</strong></p>
              <p><strong>Date uploaded: </strong>${podcast.publishDate}</p>
            </div>
            <div>
            <button type="button" class="btn btn-dark btn-sm" value="${podcast.id}" id="like">Like</button>
            <button type="button" class="btn btn-secondary btn-sm" value="${podcast.id}" id="savep">Bookmark</button>
            </div>
            <p><br><strong>Abstract:</strong> ${podcast.abstract}</p>
            <div class="player mt-4">
              <audio
                id="player2"
                preload="none"
                controls
                style="max-width: 100%"
                class="w-100"
              >
                <source
                  src=${podcast.audio_file}
                  type="audio/mp3"
                />
              </audio>

            </div>
            <div class="row">
            <div class="span8">
                <p></p>
                <p>
                   
                    
                    ${podcast.likes} likes
                    |  ${podcast.bookmarks} bookmarks
                    | <i class="icon-tags"></i> Tags : 
                    ${tagString}
                </p>
            </div>
        </div>
          </div>
          </div>
                `
        );
      }
}