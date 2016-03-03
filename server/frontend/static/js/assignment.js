function getAssignment(assignmentid) {
    $.ajax({
        url : '/assignments/' + assignmentid,
        data : {
            _id : getcookie('_id')
        },
        success : function(data) {
            var assignment = data;
            if(assignment.status) {
                assignment = assignment.data;
                $("#assignment-topic").html(assignment.title);
                $("#assignment-description").html(assignment.description);
                $.each(assignment.attachments, function(item) {
                    var item_div = document.createElement("div");
                    $(item_div).html("<a href='"+assignment.attachments[item].filepath+"' target='_blank'>"+assignment.attachments[item].name+"</a>");
                    $("#assignment-attachments").append(item_div);
                });
                $(".value", "#assignment-details-deadline").html(assignment.deadline);
                $(".value", "#assignment-details-graded-for").html(assignment.grade_max);
                if(assignment.group) {
                    $(".value", "#assignment-details-group-yn").html("Group submission");
                }
                else {
                    $(".value", "#assignment-details-group-yn").html("Individual submission");
                }
                var sub_status = "Not submitted";
                var sub_color = "danger";
                if(assignment.submission_files.length == assignment.expected_files.length){
                    sub_status = "Submitted for evaluation";
                    sub_color = "success";
                }
                $(".value", "#assignment-details-submission-status").html(sub_status)
                                                                    .parent().parent().addClass(sub_color);
                if(assignment.group == true) {
                    for(var i=0; i<assignment.members.length; i++){
                        $("#team-members").append("<h5>"+assignment.members[i]+"</h5>");
                    }
                    $("#team-members").show();
                }
                $.each(assignment.submission_files, function(item) {
                    var val = assignment.submission_files[item];
                    var inp = document.createElement("input");
                    $(inp).attr("class", "fileupload");
                    $(inp).attr("id", "fileupload" + file);
                    $(inp).attr("type", "file");
                    $(inp).attr("name", "files");
                    $(inp).attr("data-url", "/submissions/"+assignment.submission_id+"/upload");
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
    var parseUrl = window.location.href.split("/")
    var assignmentid = parseUrl[parseUrl.length-1];
    getAssignment(assignmentid);
    
});