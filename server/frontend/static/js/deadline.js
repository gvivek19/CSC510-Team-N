
$(document).ready(function() {
	getCourses();
	getDeadlines();
	$("#deadlines-list").on("click", function() {
		deadlines_list_view(null);
	});

	$("#deadlines-cal").on("click", function() {
		deadlines_cal_view(null);
	});

	$("#deadlines-upcoming-button").on("click", function() {
		$("#deadlines-upcoming-button").addClass('active');
		$("#deadlines-past-button").removeClass('active');
		$("#deadlines-past-content").hide();
		$("#deadlines-upcoming-content").show();
	});

	$("#deadlines-past-button").on("click", function() {
		$("#deadlines-past-button").addClass('active');
		$("#deadlines-upcoming-button").removeClass('active');
		$("#deadlines-upcoming-content").hide();
		$("#deadlines-past-content").show();
	});

	$("#deadlines-cal").on("click", function() {
		deadlines_cal_view(null);
	});
});

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

function sort(data) {
	for(i = 0 ; i < data.length ; i++) {
		for(j = 0 ; j < data.length ; j++) {
			if(data[i].deadline > data[j].deadline) {
				temp = data[i];
				data[i] = data[j];
				data[j] = temp;
			}
		}
	}
	return data;
}

function deadlines_list_view(course, user_type) {
	var data = getDeadlines(course);
	$("#main-content").html("");
	if(user_type && (user_type == "ta" || user_type == "instructor")) {
		var d = document.createElement("div");
		$(d).html("<a href='./ta_create_assignment' class='btn btn-primary btn'>Create new assignment</a>");
		$("#main-content").append(d);
	}

	if(data.status) {
		data.data = sort(data.data);
		total = data.data.length;
		var i = 0;
		var time = new Date();
		time = time.getTime();

		for(i = 0 ; i < total ; i++) {
			var d = data.data[i];
			
			if(d.date < time) {
				var div = document.createElement("div");
				div.id = d.id;
				$(div).html("<div id='"+d.id+"'><b>" + d.course + "</b><span style='float:right;'>"+d.date+"</span></div><div>"+d.topic+"</div>");
				$("#deadlines-past-content").append(div);
			}
			else {
				var div = document.createElement("div");
				div.id = d.id;
				$(div).html("<div id='"+d.id+"'><b>" + d.course + "</b><span style='float:right;'>"+d.date+"</span></div><div>"+d.topic+"</div>");
				$("#deadlines-upcoming-content").append(div);
			}
		}
	}
}

function deadlines_cal_view(course) {

}