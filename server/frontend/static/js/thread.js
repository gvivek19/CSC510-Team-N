$(document).ready(function() {
	$("#create_assignment").on("click", function() {
		save_assignment_details();
	});
});

function new_thread(){
    $.ajax({
        url: '/discussion',
        method: 'POST',
        data: {
            _id: getcookie('_id'),
            data: JSON.stringify({
                title: $('#title').val(),
                description: $('#desc').val(),
                visibility: $('#visibility').val(),
            })
        },
        success: function(data){
            if(data.status){
                $
            }
        }
    })
}