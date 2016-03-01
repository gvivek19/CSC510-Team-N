function getAssignment(assignmentid) {
    $.ajax({
        url : 'assignments/' + assignmentid,
        data : {
            _id : getcookie('_id')
        },
        success : function(data) {
            var assignment = data;
            if(assignment.status) {
                $("#assignment-topic").html(assignment.topic);
                $("#assignment-description").html(assignment.description);
                $.each(assignment.attachments, function(item) {
                    var item_div = document.createElement("div");
                    $(item_div).html("<a href='"+assignment.attachments[item].link+"'>"+assignment.attachments[item].filename+"</a>")
                });
                $(".value", "#assignment-details-deadline").html(assignment.deadline);
                $(".value", "#assignment-details-graded-for").html(assignment.total);
                if(assignment.group) {
                    $(".value", "#assignment-details-group-yn").html("Group submission");
                }
                else {
                    $(".value", "#assignment-details-group-yn").html("Individual submission");
                }
                $(".value", "#assignment-details-submission-status").html(assignment.status);
                if(assignment.group == true) {
                    $("#team-members").show();
                }
                $.each(assignment.submission_files, function(item) {
                    var val = assignment.submission_files[item];
                    var inp = document.createElement("input");
                    $(inp).attr("class", "fileupload");
                    $(inp).attr("id", "fileupload" + file);
                    $(inp).attr("type", "file");
                    $(inp).attr("name", "files[]");
                    $(inp).attr("data-url", "/upload");
                    $(inp).attr("multiple", "");
                    $(inp).attr("_id", id);

                    $(inp).fileupload({
                        dataType: 'json',
                        formData: {_id: getcookie(), assignment_id : $(this).attr("_id")},
                        done: function (e, data) {
                            file = file + 1;
                            show_upload_files_ui($(this).attr("_id"));
                        }
                    });
                    $("#assignment-files").append(inp);
                });

                //TODO: Discussion forums
            }
        },
        error : function(data) {
            console.log("ERROR");
        }
    });
}

$(document).ready(function() {
    var course_id = 10;
    var assignmentid = 10;
    getAssignment(assignmentid);
    
});