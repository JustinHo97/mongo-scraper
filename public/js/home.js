$(function () {
    $(".scraper").on("click", function () {
        $.get("/api/scrape", function (data) {
            console.log(data);
        }).then(function (data) {
            loadArticle();
        });
    });

    $(document).on("click", ".save", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            url:"/api/save/"+id,
            type: "PUT",
         }).then(function(data) {
            console.log(data);
        });
    });

    loadArticle();

    function loadArticle() {
        $(".articles").empty();        
        $.get("/api/article", function(data) {
            for (var i = 0; i < data.length; i++) {
                var $panel = $(
                    `<div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title"><a href="${data[i].link}">${data[i].title}</a></h3>
                      <a class="btn btn-info save" data-id="${data[i]._id}">Save Article</a>
                    </div>
                    <div class="panel-body">
                      ${data[i].summary}
                    </div>
                    </div>`);
                $(".articles").append($panel);
            }
        });
    }
});