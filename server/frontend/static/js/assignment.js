$(document).ready(function() {
    var course_id = 10;
    var assignmentid = 10;
    var assignment = getAssignment(assignmentid);
    if(assignment.status) {
        $("#assignment-topic").html(assignment.topic);
        $("#assignment-description").html(assignment.description);
        $.each(assignment.attachments, function(item) {
            var item_div = document.createElement("div");
            $(item_div).html("<a href='"+assignment.attachments[item].link+"'>"+assignment.attachments[item].filename+"</a>")
        }
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
            //TODO: create a d&d element for file saving and do the stuffs
        });

        //TODO: Discussion forums
    }
});