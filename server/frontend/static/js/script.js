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
	    	return data;
	    },
	    error : function(data) {
	    	return {status:false};
	    }
	});
}