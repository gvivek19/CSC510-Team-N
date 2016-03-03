$(document).ready(function() {
    
});

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
                $("#assignment-topic").attr("_id", assignment.id);
                $("#assignment-topic").html(assignment.title);
                $("#assignment-description").html(assignment.description);
                $.each(assignment.attachments, function(item) {
                    var item_div = document.createElement("div");
                    $(item_div).html("<a href='"+assignment.attachments[item].filepath+"' target='_blank'>"+assignment.attachments[item].name+"</a>");
                    $("#assignment-attachments").append(item_div);
                });
                $(".value", "#assignment-details-deadline").html(assignment.deadline);
                $(".value", "#assignment-details-graded-for").html(assignment.grade_max);
                if(assignment.is_group) {
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
                if(assignment.is_group == true) {
                    for(var i=0; i<assignment.members.length; i++){
                        $("#team-members").append("<h5>"+assignment.members[i]+"</h5>");
                    }
                    $("#team-members").show();
                }

                if(assignment.submission != null) {
                    if(assignment.submission.grading_status == "Graded") {
                        $(".value", "#assignment-details-grade").html(assignment.submission.grade);
                        $("#grade").show();
                    }
                }
                
                $.each(assignment.expected_files, function(item) {
                    var expItem = assignment.expected_files[item];
                    var is_present = -1;
                    for(k = 0 ; k < assignment.submission_files.length ; k++) {
                        console.log(assignment.submission_files[k].filepath, expItem);
                        if(assignment.submission_files[k].filepath.endsWith(expItem)) {
                            is_present = k;
                            assignment.expected_files.splice(item, 1);
                            break;
                        }
                    }

                    if(is_present >= 0) {
                        var tempDiv = document.createElement("div");
                        $(tempDiv).html("<a href='"+assignment.submission_files[k].filepath+"'>"+assignment.submission_files[k].name+"</a>");
                        $("#assignment-files").append(tempDiv);
                    }
                    else {
                        var div = document.createElement("div");
                        var val = assignment.expected_files[item];
                        var inp = document.createElement("input");
                        $(inp).attr("class", "fileupload");
                        $(inp).attr("type", "file");
                        $(inp).attr("name", "files");
                        console.log(assignment.id);
                        $(inp).attr("data-url", "/submissions/"+assignment.submission_id+"/upload/"+assignment.id);
                        $(inp).attr("multiple", "");
                        $(inp).attr("_id", assignment.id);
                        $(inp).fileupload({
                            dataType: 'json',
                            formData: {_id: getcookie("_id"), assignment_id : $(this).attr("_id")},
                            done: function (e, data) {
                                temp = window.location;
                                window.location = temp;
                            }
                        });
                        $(div).html("Expected file : <b>" + val + "</b>");
                        $(div).append(inp);
                        $("#assignment-files").append(div);
                    }
                });

                if(assignment.submission != null) {
                    if(assignment.submission.grading_status == "Graded") {
                        var stats = document.createElement("div");
                        stats.id = 'assignment-stats';
                        $(stats).html("<a href='/statistics/"+assignment.id+"' class='btn btn-primary btn-block'>View Statistis</a>");
                        $("#assignment-main-div").append(stats);
                    }
                }
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