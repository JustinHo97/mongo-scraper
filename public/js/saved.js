$(function () {
    loadSaved();
    function loadSaved() {
        $.get("/api/saved", function (data) {
            $(".articles").empty();
            for (var i = 0; i < data.length; i++) {
                console.log(data);
                var $content;
                if (data[i].notes){
                    for (var j = 0; j < data[i].notes.body.length; j++){
                        $content += `<li>${data[i].notes.body[j]}<button class="btn btn-danger note-delete" id="${j}" data-id="${data[i].id}">X</button></li>`;
                    }
                }else {
                    $notes = "<p align='center'>You have no notes</p>";
                }
                var $panel = $(`
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title"><a href="${data[i].link}">${data[i].title}</a></h3>
                            <a class="btn btn-info remove" data-id="${data[i]._id}">Remove From Saved</a>
                            <button type="button" class="btn btn-info note" data-toggle="modal" data-target="#note-${data[i]._id}">Article Notes</button>                      
                        </div>
                        <div class="panel-body">
                            ${data[i].summary}
                        </div>
                    </div>
                    <div class="modal fade" id="note-${data[i]._id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title" id="myModalLabel" align="center">Note(s) For Article ${data[i]._id}</h4>
                                </div>
                                <div class="modal-body">
                                <ul>
                                ${$content}
                                </ul>
                                <br>
                                <textarea rows="4" cols="60"></textarea>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary save-note" data-id="${data[i]._id}">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                $(".articles").append($panel);
            }
        });
    }
    $(document).on("click", ".save-note", function () {
        $.ajax({
            url: "/save/note/"+$(this).attr("data-id"),
            type:"PUT",
            data: {
                text: $(".modal-body textarea").val().trim()
            }
        }).then(function(){
            loadSaved();
        })
    });
    $(document).on("click", ".remove", function () {
        $.ajax({
            url: "/remove/save/"+$(this).attr("data-id"),
            type:"PUT"
        }).then(function(data){
            console.log(data);
            loadSaved();
        });
    });
});