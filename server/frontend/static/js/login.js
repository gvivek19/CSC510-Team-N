$(function(){

	$("#login_submit").click(function() {
		var username = $("#username").val().trim();
		var password = $("#password").val().trim();
		if(username.length==0 || password.length==0){
			$("#error-div").html("Text field empty");
			$("#error-div").show();
			return;
		}
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
					$("#error-div").html("Invalid username/password");
					$("#error-div").show();
				}
			}
		});
	});
});