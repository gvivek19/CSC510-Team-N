
$(document).ready(function() {
	$("#deadlines-list").on("click", function() {
		deadlines_list_view(null);
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