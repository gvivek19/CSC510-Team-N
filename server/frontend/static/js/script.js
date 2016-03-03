courses = {};

function getcookie(key) {
	key = key + "=";
	var cookies = document.cookie.split(';');
	for(var i = 0 ; i < cookies.length ; i++) {
		var c = cookies[i];
		while(c[0] == ' ') 
			c = c.substring(1);
		if(c.indexOf(name) == 0)
			return c.substring(key.length, c.length);
	}
	return "";
}

function setcookie(key, value) {
	document.cookie = (key + "=" + value + ";");
}

function getCourses() {
	$.ajax( {
	    url : "/courses",
	    data : {
	        _id : getcookie('_id')
	    },
	    method : "GET",
	    success : function(data) {
	    	var titleDiv = document.createElement("div");
	    	titleDiv.className = 'title_1';
	    	$(titleDiv).html("Courses");
	    	$("#courses-list").append(titleDiv);

	    	var isInstr = false;
	    	if(data.status) {
	    		var total = data.data.length;
	    		for(var i = 0 ; i < total ; i++) {
	    			var temp = data.data[i];
	    			var div = document.createElement("div");
	    			div.className = 'course_element';
	    			$(div).attr("myid", temp.id);
	    			$(div).attr("utype", temp.user_type);

	    			$(div).on("click", function(id) {
	    				getDeadlines(deadlines_list_view, $(this).attr('myid'));
	    			});
	    			$(div).html('<b>' + temp.course_code + " : " + temp.course_name + "</b><br> Section : " + temp.section + "<br>" + temp.term + " " + temp.year);
	    			$("#courses-list").append(div);

	    			courses[temp.id] = temp.type;
	    			if(temp.type == "instructor") {
	    				isInstr = true;
	    			}
	    		}
	    		if(isInstr) {
	    			add_course();
	    		}
	    	}
	    },
	    error : function(data) {
	    	return {status:false};
	    }
	});
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function add_course() {
	t = $("#courses-list").parent().html();
	t = t + '<input type="button" name="add-course" value="Add course" class="btn btn-primary btn-block" id="add_course">';
	$("#courses-list").parent().html(t);

    $("#add_course").on("click", function() {
        $("#overlay").show();
        $("#add_course_div").show();
    });

    $("#add_course_btn").on("click", function() {
        var tas = $("#tas").val().split(",");
        var students = $("#students").val().split(",");

        $.ajax({
            url : "/courses/add",
            data : {
                _id : getcookie("_id"),
                code : $("#course_code"),
                name : $("#course_name"),
                tas : tas,
                students : students,
                term : $("#term"),
                year : $("#year")
            },
            success : function(data) {
                alert("Course added successfully");
                var t = window.location;
                window.location = t;
            },
            error : function(data) {
                alert("Error");
            }
        });
    });

    $("#cancel_course_btn").on("click", function() {
        $("#course_code").val("");
        $("#course_name").val("");
        $("#overlay").hide();
        $("#add_course_div").hide();
    });
}

$(function(){
	$("#user-name-welcome").parent().hide();
})