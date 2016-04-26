var assignment_id = 1;

function getFiles(sub_id, handler) {
    $.ajax({
        url : "/evaluate/submission/" + sub_id,
        method : "GET",
        data : {
            _id : getcookie('_id')
        },
        error : function(data, status, error) {
            console.log("ERROR : " + data + error);
        },
        success : function(data, status) {
            handler(data);
        }
    });
}

function save_feedback() {

    window.clearInterval(window.timer)
    
    subid = $("#marks_submit").attr("submission_id");
    $.ajax({
        url : "/evaluate/submission/" + subid,
        method : "POST",
        data : {
            _id : getcookie('_id'),
            total_marks : $("#marks").val(),
            time_taken: window.timing
        },
        error : function(data, status, error) {
            console.log("ERROR : " + data + error);
        },
        success : function(data, status) {
            if(data.status) {
                alert("Data saved successfully");
            }
        }
    });
}

function getSubmissions(handler) {
    assignment_id = window.location.toString().split('/').pop();
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
            handler(data);
        }
    });
}

function load_file(path, fileid) {
    if(path.endsWith("pdf")) {
        var ifr = document.createElement("iframe");
        ifr.src = "/static/html/viewer.html" + "?file="+path + "&fileid=" + fileid;
        $(ifr).attr("style", "width:100%;height:100%;");
        $("#file").html("");
        $("#file").append(ifr);
    }
}

function load_files(submission_id) {
    getFiles(submission_id, function(files) {
        if(files.status) {
            $("#files_list").html("");
            var total = files.data.length;
            for(var i = 0 ; i < total ; i++) {
                var div = document.createElement("div");
                div.className = 'files-item';
                $(div).attr("path", files.data[i].filepath);
                $(div).attr("_id", files.data[i].id);
                $(div).html(files.data[i].filepath.split('/').pop());
                $(div).on("click", function(path) {
                    load_file($(this).attr("path"), $(this).attr("_id"));
                });
                $("#files_list").append(div);
            }
            window.timing = 0;
            window.timer = setInterval(function(){window.timing += 1;}, 1000);
        }
    });
}

$(document).ready(function() {
    getSubmissions(function(submissions) {
        if(submissions.status) {
            var totalSubmissions = submissions.data.length;
            for(var i = 0 ; i < totalSubmissions ; i++) {
                var temp = submissions.data[i];
                var div = document.createElement("div");
                div.className = 'submissions-item';
                div.id = temp.id;
                $(div).html(temp.students[0]);
                $(div).on("click", function() {
                    load_files($(this).attr("id"));
                });
                $("#submissions").append(div);
            }

            $("#marks_submit").attr("submission_id", temp.id);
            $("#marks_submit").on("click", function() {
                save_feedback();
            });
        }
    });
});