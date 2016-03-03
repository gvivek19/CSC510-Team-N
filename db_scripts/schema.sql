--Function which returns UTC now
CREATE OR REPLACE FUNCTION utc_now()
RETURNS TIMESTAMP without time zone 
AS $$
    BEGIN
            RETURN now() at time zone 'UTC';
    END;
$$ LANGUAGE plpgsql VOLATILE
    COST 1;

--Table creation
CREATE TABLE Course(
	id SERIAL PRIMARY KEY,
	course_code VARCHAR(10) NOT NULL,
	section INTEGER,
	name VARCHAR(100),
	term VARCHAR(10),
	year SMALLINT
	
);

CREATE TABLE Users(
	id SERIAL PRIMARY KEY,
	unity_id VARCHAR(10) NOT NULL,
	fname VARCHAR(100),
	lname VARCHAR(100),
	password VARCHAR(20)
);

CREATE TABLE Course_User_Map(
	id SERIAL PRIMARY KEY,
	course_id INTEGER REFERENCES Course,
	user_id INTEGER REFERENCES Users,
	type VARCHAR(10)
);

CREATE TABLE Assignments(
	id SERIAL PRIMARY KEY,
	title VARCHAR(200),
	description VARCHAR(500),
	created TIMESTAMP DEFAULT utc_now(),
	deadline TIMESTAMP DEFAULT utc_now(),
	grade_max INTEGER DEFAULT 100,
	is_group BOOLEAN DEFAULT false
);

CREATE TABLE Assignment_files(
	id SERIAL PRIMARY KEY,
	assignment_id INTEGER REFERENCES Assignments,
	file_type VARCHAR(10)
);




CREATE TABLE Assignment_attachments(
	id SERIAL PRIMARY KEY,
	question_id INTEGER REFERENCES Assignments,
	file_path VARCHAR(200)
);

CREATE TABLE Groups(
	id SERIAL PRIMARY KEY,
	assignment_id INTEGER REFERENCES Assignments
);

CREATE TABLE Group_student_map(
	id SERIAL PRIMARY KEY,
	group_id INTEGER REFERENCES Groups,
	student_id INTEGER REFERENCES Users
);

CREATE TABLE Submissions(
	id SERIAL PRIMARY KEY,
	question_id INTEGER REFERENCES Assignments,
	grading_status VARCHAR(100),
	group_id INTEGER REFERENCES Groups,
	grade INTEGER DEFAULT 0		
);


CREATE TABLE Submission_files(
	id SERIAL PRIMARY KEY,
	assignment_id INTEGER REFERENCES Assignments,
	submission_id INTEGER REFERENCES Submissions,
	file_path VARCHAR(200)
);

CREATE TABLE Threads(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	description VARCHAR(500),
	posted_by INTEGER REFERENCES Users,
	created TIMESTAMP DEFAULT utc_now(),
	assignment_id INTEGER REFERENCES Assignments,
	is_anonymous BOOLEAN DEFAULT false

);

CREATE TABLE Comments(
	id SERIAL PRIMARY KEY,
	thread_id INTEGER REFERENCES Threads,
	posted_by INTEGER REFERENCES Users,
	comment VARCHAR(500),
	created TIMESTAMP DEFAULT utc_now(),
	is_anonymous BOOLEAN DEFAULT false

);

CREATE TABLE Feedback_thread(
	id SERIAL PRIMARY KEY,
	submission_id INTEGER REFERENCES Submissions,
	comment VARCHAR(500),
	posted_by INTEGER REFERENCES Users,
	created TIMESTAMP DEFAULT utc_now()
);

ALTER TABLE assignments ADD COLUMN course_id INTEGER REFERENCES course;
ALTER TABLE assignments ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;

CREATE TABLE PageCount(
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES Users,
	page VARCHAR(100),
	visited_on TIMESTAMP DEFAULT utc_now()
);

ALTER TABLE feedback_thread DROP COLUMN submission_id;
ALTER TABLE feedback_thread ADD COLUMN file_id INTEGER REFERENCES submission_files;