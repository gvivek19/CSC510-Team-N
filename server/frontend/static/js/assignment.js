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
                console.log(assignment.submission_files);
                console.log(assignment.submission_files.length, assignment.expected_files.length);
                if(assignment.submission_files.length >= assignment.expected_files.length){
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
                    console.log(expItem);
                    var is_present = -1;
                    for(k = 0 ; k < assignment.submission_files.length ; k++) {
                        if(assignment.submission_files[k].filepath.endsWith(expItem)) {
                            is_present = k;
                            //assignment.expected_files.splice(item, 1);
                            break;
                        }
                    }

                    if(is_present >= 0) {
                        var tempDiv = document.createElement("div");
                        $(tempDiv).html("<a href='"+assignment.submission_files[k].filepath+"'>"+assignment.submission_files[k].name+"</a>");
                        

                        if(expItem == "pdf") {
                            if(assignment.submission != null) {
                                if(assignment.submission.grading_status == "Graded") {
                                    $(tempDiv).append("<a href='/static/html/feedback_viewer.html?file="+assignment.submission_files[k].filepath+"&fileid="+assignment.submission_files[k].id+"' style='margin-left:3%; color:#a60000;'>View Feedback</a>");
                                }
                            }
                        }
                        $("#assignment-files").append(tempDiv);
                        assignment.submission_files.splice(k, 1);
                    }
                    else {
                        var div = document.createElement("div");
                        var val = assignment.expected_files[item];
                        var inp = document.createElement("input");
                        $(inp).attr("class", "fileupload");
                        $(inp).attr("type", "file");
                        $(inp).attr("name", "files");
                        $(inp).attr("data-url", "/submissions/"+assignment.submission_id+"/upload/"+assignment.id);
                        $(inp).attr("multiple", "");
                        $(inp).attr("expected", val);
                        $(inp).attr("allowed", "false");
                        $(inp).attr("_id", assignment.id);
                        $(inp).fileupload({
                            dataType: 'json',
                            acceptFileTypes: /(\.|\/)($(this).attr("expected"))$/i,
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

                if(assignment.course_id) {
                    var type = courses[assignment.course_id];
                    if(type == "instructor" || type == "ta") {
                        $("#assignment-main-div").append("<a href='/evaluateAssignment/"+assignment.id+"' class='btn btn-primary btn-block'>Evaluate</a>")
                        $("#assignment-main-div").append("<a href='/statistics/"+assignment.id+"' class='btn btn-primary btn-block'>View Statistics</a>")
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