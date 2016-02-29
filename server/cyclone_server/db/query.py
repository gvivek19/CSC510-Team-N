_LOGIN_USER =\
    'SELECT * FROM Users WHERE unity_id=%s and password=%s'

_GET_USER_BY_ID =\
	'SELECT * FROM Users WHERE id=%s'

_GET_USER_COURSES =\
	'SELECT c.* FROM course c INNER JOIN course_user_map cu ON c.id=cu.course_id WHERE cu.user_id=%s'