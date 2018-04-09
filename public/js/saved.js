$(function() {
    loadSaved();
    function loadSaved() {
        $.get("/api/saved", function(data) {
            for (var i = 0; i < data.length; i++) {
                var $panel = $(
                    `<div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title"><a href="${data[i].link}">${data[i].title}</a></h3>
                      <a class="btn btn-info remove" data-id="${data[i]._id}">Remove From Saved</a>
                      <a class="btn btn-info note" data-id="${data[i]._id}">Article Notes</a>                      
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