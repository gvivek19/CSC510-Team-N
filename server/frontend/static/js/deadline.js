
$(document).ready(function() {
	getCourses();
	getDeadlines(deadlines_list_view, null);
	$("#deadlines-list").on("click", function() {
		getDeadlines(deadlines_list_view, null);
	});

	$("#deadlines-cal").on("click", function() {
		getDeadlines(deadlines_cal_view, null);
	});

	

	$("#deadlines-cal").on("click", function() {
		deadlines_cal_view(null);
	});
});

function getDeadlines(funct, course) {
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
			funct(data);
		},
		error : function(data) {
			funct({status : false});
		}
	});
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

function deadlines_list_view(data, user_type) {
	$("#main-content").html('');

	var deadlines_content_div = document.createElement("div");
	var deadlines_button_div = document.createElement("div");
	deadlines_button_div.style.textAlign = 'center';

	var upcoming_button = document.createElement("button");
	$(upcoming_button).attr("type", "button");
	$(upcoming_button).attr("id", "deadlines-upcoming-button");
	$(upcoming_button).attr("class", "btn btn-default active");
	$(upcoming_button).html('<span class="glyphicon glyphicon" aria-hidden="true">Upcoming</span>');

	var past_button = document.createElement("button");
	$(past_button).attr("type", "button");
	$(past_button).attr("id", "deadlines-past-button");
	$(past_button).attr("class", "btn btn-default");
	$(past_button).html('<span class="glyphicon glyphicon" aria-hidden="true">Past</span>');

	var deadlines_upcoming_content = document.createElement("div");
	deadlines_upcoming_content.id = "deadlines-upcoming-content";

	var deadlines_past_content = document.createElement("div");
	deadlines_upcoming_content.id = "deadlines-past-content";
	deadlines_upcoming_content.style.display = 'None';

	$(deadlines_button_div).append(upcoming_button);
	$(deadlines_button_div).append(past_button);

	$(deadlines_content_div).append(deadlines_button_div);
	$(deadlines_content_div).append(deadlines_upcoming_content);
	$(deadlines_content_div).append(deadlines_past_content);

	$("#main-content").append(deadlines_content_div);

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
			
			if(d.deadline < time) {
				var div = document.createElement("div");
				div.id = d.course_id;
				div.className = 'deadline-list-item';
				$(div).html("<div id='"+d.course_id+"'><b><a href='/assignment/"+d.id+"'>" + d.title + "</a></b><span style='float:right;'>"+d.deadline+"</span></div><div>"+d.description+"</div>");
				$("#deadlines-past-content").append(div);
			}
			else {
				var div = document.createElement("div");
				div.className = 'deadline-list-item';
				div.id = d.course_id;
				$(div).html("<div id='"+d.course_id+"'><a href='/assignment/"+d.id+"'>" + d.title + "</a><span style='float:right;'>"+d.deadline+"</span></div><div>"+d.description+"</div>");
				$("#deadlines-upcoming-content").append(div);
			}
		}
	}
}

function deadlines_cal_view(data) {

}