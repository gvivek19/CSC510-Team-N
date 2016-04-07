delete from feedback_thread;
delete from pagecount;
delete from submission_files;
delete from submissions;
delete from group_student_map;
delete from groups;
delete from assignment_files;
delete from assignment_attachments;
delete from assignments;
delete from course_user_map;
delete from users;
delete from course;

INSERT INTO users(id, unity_id, fname, lname, password) VALUES(1, 'vgopala2', 'Vivek', 'Gopalakrishnan', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(2, 'gjeyara', 'Gautam', 'Jeyaraman', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(3, 'amanoha2', 'Anbarasi', 'Manoharan', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(4, 'instr1', 'Instructor', '1', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(5, 'instr2', 'Instructor', '2', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(6, 'instr3', 'Instructor', '3', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(7, 'ta1', 'TA', '1', '12345678');
INSERT INTO users(id, unity_id, fname, lname, password) VALUES(8, 'ta2', 'TA', '2', '12345678');

INSERT INTO course(id, course_code, section, name, term, year) VALUES(1, 'CSC501', '001', 'Operating Systems', 'Spring', 2016);
INSERT INTO course(id, course_code, section, name, term, year) VALUES(2, 'CSC510', '001', 'Software Engineering', 'Spring', 2016);
INSERT INTO course(id, course_code, section, name, term, year) VALUES(3, 'CSC505', '001', 'Algorithms', 'Spring', 2016);

INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(1, 1, 1, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(2, 1, 2, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(3, 1, 4, 'instructor');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(4, 1, 7, 'ta');

INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(5, 2, 1, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(6, 2, 3, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(7, 2, 5, 'instructor');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(8, 2, 8, 'ta');

INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(9, 3, 2, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(10, 3, 3, 'student');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(11, 3, 6, 'instructor');
INSERT INTO course_user_map(id, course_id, user_id, type) VALUES(12, 3, 8, 'ta');

