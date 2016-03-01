var file = 1;
var course_id = 0;

$(document).ready(function() {
	$('#deadline').datetimepicker();
	$('.btn-group > .btn').removeClass('active')    // Remove any existing active classes
	$('.btn-group > .btn').eq(0).addClass('active')

	course_id = getParameterByName('course_id');
	
	$("#create_assignment").on("click", function() {
		save_assignment_details();
	});
});

function show_upload_files_ui(id) {
	var inp = document.createElement("input");
	$(inp).attr("class", "fileupload");
	$(inp).attr("id", "fileupload" + file);
	$(inp).attr("type", "file");
	$(inp).attr("name", "files");
	$(inp).attr("data-url", "/assignments/"+id+"/upload");
	$(inp).attr("multiple", "");
	$(inp).attr("_id", id);

	$(inp).fileupload({
        dataType: 'json',
        formData: {_id: getcookie('_id'), assignment_id : $(this).attr("_id")},
        done: function (e, data) {
        	file = file + 1;
            show_upload_files_ui($(this).attr("_id"));
        }
    });
	$("#cont", "#new_content").append(inp);
}

function save_assignment_details() {
	var date = new Date($("#deadline").data().date);
	$.ajax({
		url : '/assignments',
		method : 'POST',
		data : {
			_id : getcookie('_id'),
			data: JSON.stringify({
				title : $("#title").val(),
				description : $("#description").val(),
				deadline : date.getTime(),
				group : ($('.btn-group > .btn.active').html() == "Group"),
				total : $("#grade_max").val(),
				expected_files : $("#expected_files").val().split(','),
				course_id: course_id
			})
		},
		success : function(data) {
			if(data.status) {
				$("#old_content").hide();
				$("#new_content").show();
				$("#save_assignment").attr("_id", data.data.id);
				show_upload_files_ui(data.data.id);
			}
		},
		error : function(data) {

		}
	});
	return false;
}

function redirect() {
	window.location = '/assignments/' + $("#save_assignment").attr('_id');
}