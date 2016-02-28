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

	});

	$("#deadlines-cal").on("click", function() {
		
	})
});