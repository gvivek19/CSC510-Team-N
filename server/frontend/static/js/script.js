function login() {
	var username = $("#username").val();
	var password = $("#password").val();
	$.ajax({
		url : "/login",
		method : "POST",
		data : {
			username : username,
			password : password
		},
		error : function(data, status, error) {
			console.log("ERROR : " + data + error);
		},
		success : function(data, status) {
			var returnedData = data.status;
			if(status == true) {
				window.url = data.redirectURL;
			}
			else {
				$("#error-div").val("Invalid username/password");
				$("#error-div").show();
			}
		}
	});
	return false;
}

$(document).ready(function() {
	$("#deadlines-list").on("click", function() {
		deadlines_list_view(null);
	});

	$("#deadlines-cal").on("click", function() {
		deadlines_cal_view(null);
	});
});

function getcookie(key) {
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
	document.cookie += (key + "=" + value + ";");
}

function getCourses() {
	$.ajax( {
	    url : "/courses",
	    data : {
	        _id : getcookie('_id')
	    },
	    method : "GET",
	    success : function(data) {
	    	return data;
	    },
	    error : function(data) {
	    	return {status:false};
	    }
	})
	return {status:false};
}

function getDeadlines(course) {
	url = "";
	if(course == null) {
		url = "/deadlines";
	}
	else {
		url = "/deadlines/" + course;
	}

	$.ajax({
		method : "GET",
		url : url,
		data : {
			_id : getcookie('_id')
		},
		success : function(data) {
			return data;
		},
		error : function(data) {
			return {status : false};
		}
	});
	return {status : false};
}

function deadlines_list_view(course) {
	var data = getDeadlines(course);
	var mainDiv = document.createElement("div");
	if(data.status) {
		$.each(data.data, function(i) {
			var d = data.data[i];
			var div = document.createElement("div");
			div.id = d.id;
			$(div).html("<div id='"+d.id+"'><b>" + d.course + "</b><span style='float:right;'>"+d.date+"</span></div><div>"+d.topic+"</div>");
			$(mainDiv).append(div);
		});
	}
	$("#deadlines-content").append(mainDiv);
}

function deadlines_cal_view(course) {

}