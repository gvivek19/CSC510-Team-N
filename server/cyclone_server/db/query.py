_LOGIN_USER =\
    'SELECT * FROM Users WHERE unity_id=%s and password=%s'

_GET_USER_BY_ID =\
	'SELECT * FROM Users WHERE id=%s'

_GET_USER_COURSES =\
	'SELECT c.* FROM course c INNER JOIN course_user_map cu ON c.id=cu.course_id WHERE cu.user_id=%s'

_GET_DEADLINES_BY_USER =\
	'SELECT a.* FROM course c INNER JOIN course_user_map cu ON c.id=cu.course_id' \
	' INNER JOIN assignments a ON c.id=a.course_id WHERE cu.user_id=%s'

_GET_DEADLINES_BY_COURSE =\
	'SELECT a.* FROM course c INNER JOIN course_user_map cu ON c.id=cu.course_id' \
	' INNER JOIN assignments a ON c.id=a.course_id WHERE cu.user_id=%s AND c.id=%s'

_GET_ASSIGNMENT =\
	'SELECT * FROM assignments WHERE id=%s'

_GET_ASSIGNMENT_ATTACHMENTS =\
	'SELECT * FROM assignment_attachments WHERE question_id=%s'

_GET_ASSIGNMENT_MEMBERS =\
	'SELECT u.* FROM users u INNER JOIN group_student_map gsm ON gsm.student_id=u.id' \
	' WHERE gsm.group_id=(SELECT g.id FROM groups g INNER JOIN group_student_map gm' \
	' ON g.id=gm.group_id INNER JOIN users us ON gm.student_id=us.id WHERE g.assignment_id=%s and us.id=%s)'

_GET_SUBMISSION_FILES =\
	'SELECT id, file_path FROM submission_files WHERE submission_id=%s'

_GET_ASSIGNMENT_SUBMISSION_FILES =\
	'SELECT sf.id, sf.file_path FROM submission_files sf INNER JOIN submissions s' \
	' ON sf.submission_id=s.id WHERE s.group_id=(SELECT g.id FROM groups g INNER JOIN group_student_map gm' \
	' ON g.id=gm.group_id INNER JOIN users us ON gm.student_id=us.id WHERE g.assignment_id=%s and us.id=%s)'

_GET_SUBMISSIONS_BY_ASSIGNMENT_ID =\
	'SELECT s.*, array_agg(u.unity_id) as students FROM submissions s INNER JOIN group_student_map gsm' \
	' ON s.group_id=gsm.group_id INNER JOIN users u ON gsm.student_id=u.id' \
	' GROUP BY s.id,s.question_id,s.grading_status,s.group_id,s.grade HAVING s.question_id=%s'

_UPDATE_GRADE =\
	'UPDATE submissions SET grading_status=%s, grade=%s WHERE id=%s RETURNING id'

_CREATE_COURSE =\
	'INSERT INTO course(course_code, section, name, term, year) VALUES (%s,%s,%s,%s,%s) RETURNING *'

_CREATE_COURSE_USER =\
	'INSERT INTO course_user_map(course_id, user_id, type) VALUES (%s,(SELECT id FROM users WHERE unity_id=%s),%s) RETURNING *'