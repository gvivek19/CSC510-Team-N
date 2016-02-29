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

$(document).ready(function() {
    var data = getCourses();
    if(data.status) {
        $.each(data.data, function(item) {
            var temp = data.data[item];
            var div = document.createElement("div");
            div.id = temp.id;
            $(div).html(temp.course_code + " : " + temp.course_name);
            $("#courses-list").append(div);
        });
    }
});	