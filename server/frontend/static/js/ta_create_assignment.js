var file = 1;
var subid;

$(document).ready(function() {
	$('#deadline').datetimepicker();
	$('.btn-group > .btn').removeClass('active')    // Remove any existing active classes
	$('.btn-group > .btn').eq(0).addClass('active')

	$("#create_assignment").on("click", function() {
		save_assignment_details();
	});
});

function show_upload_files_ui(id) {
	var inp = document.createElement("input");
	$(inp).attr("class", "fileupload");
	$(inp).attr("id", "fileupload" + file);
	$(inp).attr("type", "file");
	$(inp).attr("name", "files[]");
	$(inp).attr("data-url", "/upload");
	$(inp).attr("multiple", "");

	$(inp).fileupload({
            dataType: 'json',
            formData: {_id: getcookie(), assignment_id : id},
            done: function (e, data) {
            	file = file + 1;
                show_upload_files_ui(id);
            }
        });
	$("#cont", "#new_content").append(inp);
}

function save_assignment_details() {
	$.ajax({
		url : '/assignments/',
		method : 'POST',
		data : {
			_id : getcookie('_id'),
			title : $("#title").val(),
			description : $("#description").val(),
			deadline : $("#deadline").data().date,
			group : $('.btn-group > .btn.active').html(),
			total : $("#grade_max").val(),
			expected_files : $("#expected_files").val().split(',')
		},
		success : function(data) {
			if(data.status) {
				$("#old_content").hide();
				$("#new_content").show();
				subid = data.id;
				show_upload_files_ui(data.id);
			}
		},
		error : function(data) {

		}
	});
	return false;
}

function redirect() {
	window.location = '/assignments/' + subid;
}