var assignment_id = 1;

function getFiles(sub_id) {
    $.ajax({
        url : "/evaluate/" + sub_id,
        method : "GET",
        data : {
            _id : getcookie('_id')
        },
        error : function(data, status, error) {
            console.log("ERROR : " + data + error);
        },
        success : function(data, status) {
            return data;
        }
    });
}

function save_feedback(subid) {
    $.ajax({
        url : "/evaluate/" + assignment_id + "/" + subid,
        method : "POST",
        data : {
            _id : getcookie('_id'),
            total_marks : $("#marks")
        },
        error : function(data, status, error) {
            console.log("ERROR : " + data + error);
        },
        success : function(data, status) {
            return data;
        }
    });
}

function getSubmissions() {
    $.ajax({
        url : "/evaluate/" + assignment_id,
        method : "GET",
        data : {
            _id : getcookie('_id')
        },
        error : function(data, status, error) {
            console.log("ERROR : " + data + error);
        },
        success : function(data, status) {
            return data;
        }
    });
}

function load_file(path) {
    if(path.endsWith("pdf") || path.endsWith("jpg") || path.endsWith("jpeg")) {
        $("#file").html("<object data='"+path+"' type='application/pdf' width='100%' height='70%'></object>");
    }
}

function load_files(submission_id) {
    var files = getFiles(submission_id);
    if(files.status) {
        var total = files.files.length;
        for(var i = 0 ; i < total ; i++) {
            var div = document.createElement("div");
            $(div).html(files.files[i].filename);
            $(div).on("click", function(path) {
                load_file(path);
            }(files.files[i].path));
            $("#files_list").append(div);
        }
    }
}

$(document).ready(function() {
    var submission_id;
    var submissions = getSubmissions();
    if(submissions.status) {
        var totalSubmissions = submissions.submissions.length;
        for(var i = 0 ; i < totalSubmissions ; i++) {
            var temp = submissions.submissions[i];
            var div = document.createElement("div");
            div.id = temp.submission_id;
            $(div).html(temp.username);
            $(div).on("click", function(submissionid) {
                load_files(submissionid);
            }(temp.submission_id));
            $("#submissions").append(div);
        }
    }
    $("#marks_submit").attr("submission_id", submission_id);
    $("#marks_submit").on("click", function() {
        save_feedback();
    });
});