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

	    	if(data.status) {
	    		var total = data.data.length;
	    		for(var i = 0 ; i < total ; i++) {
	    			console.log(i);
	    			var temp = data.data[i];
	    			var div = document.createElement("div");
	    			div.className = 'course_element';
	    			$(div).attr("myid", temp.id);
	    			$(div).attr("utype", temp.user_type);

	    			$(div).on("click", function(id) {
	    				deadlines_list_view($(this).attr('myid'), 'ta');
	    			});
	    			$(div).html('<b>' + temp.course_code + " : " + temp.course_name + "</b><br> Section : " + temp.section + "<br>" + temp.term + " " + temp.year);
	    			$("#courses-list").append(div);
	    		}
	    	}
	    },
	    error : function(data) {
	    	return {status:false};
	    }
	});
}