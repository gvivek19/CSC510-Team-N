import query
import json
import time
from twisted.internet import defer
from datetime import datetime


class PostgresDatabase(object):
    def __init__(self, connection):
        self.connection = connection

    def serialize_user(self, user):
        return {
                "id": user.id,
                "unity_id": user.unity_id,
                "fname": user.fname,
                "lname": user.lname
        }

    def serialize_course(self, course, is_type=False):
        data = {
                "id": course.id,
                "course_code": course.course_code,
                "course_name": course.name,
                "section": course.section,
                "term": course.term,
                "year": course.year
        }
        if is_type:
            data["type"] = course.type
        return data

    def serialize_assignment(self, assignment):
        return {
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "created": assignment.created.strftime("%b %d, %Y %H:%M"),
                "deadline": assignment.deadline.strftime("%b %d, %Y %H:%M"),
                "grade_max": assignment.grade_max,
                "is_group": assignment.is_group,
                "course_id": assignment.course_id
        }

    def serialize_submissions(self, submission):
        res = {
                "id": submission.id,
                "assignment_id": submission.question_id,
                "grading_status": submission.grading_status,
                "group_id": submission.group_id,
                "grade": submission.grade
        }
        try:
            res["students"] = submission.students
        except Exception:
            pass
        return res

    def serialize_attachment(self, attachment):
        name = attachment.file_path.split("/")[-1]
        return {
                "id": attachment.id,
                "filepath": attachment.file_path,
                "name": name
        }

    def serialize_assignment_submission_files(self, attachment):
        name = attachment.file_path.split("/")[-1]
        return {
                "id": attachment.id,
                "filepath": attachment.file_path,
                "name": name
        }

    @defer.inlineCallbacks
    def serialize_feedback(self, feedback):
        data = {
                "id": feedback.id,
                "comment": feedback.comment,
                "posted_by": feedback.posted_by,
                "created": feedback.created.strftime("%b %d, %Y %H:%M"),
                "file_id": feedback.file_id
        }
        posted_by = yield self.get_user_by_id(data["posted_by"])
        data["posted_by"] = self.serialize_user(posted_by)
        defer.returnValue(data)

    @defer.inlineCallbacks
    def login_user(self, username, password):
        user = yield self.connection.runQuery(query._LOGIN_USER, (username, password))
        if user:
        	defer.returnValue(user[0])

    @defer.inlineCallbacks
    def get_user_by_id(self, user_id):
        user = yield self.connection.runQuery(query._GET_USER_BY_ID, (user_id,))
        if user:
        	defer.returnValue(user[0])

    @defer.inlineCallbacks
    def get_courses_by_user_id(self, user_id):
        courses = yield self.connection.runQuery(query._GET_USER_COURSES, (user_id,))
        res = []
        for row in courses:
            res.append(self.serialize_course(row, True))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_deadlines(self, user_id, course_id=None):
        assignments = None
        if course_id:
            assignments = yield self.connection.runQuery(query._GET_DEADLINES_BY_COURSE, (user_id, course_id))
        else:
            assignments = yield self.connection.runQuery(query._GET_DEADLINES_BY_USER, (user_id,))
        res = []
        for row in assignments:
            res.append(self.serialize_assignment(row))
        defer.returnValue(res);

    @defer.inlineCallbacks
    def get_assignment_by_id(self, assignment_id, user_id):
        assignment = yield self.connection.runQuery(query._GET_ASSIGNMENT, (assignment_id,))
        if not assignment:
            return
        assignment = self.serialize_assignment(assignment[0])
        assignment["attachments"] = yield self.get_assignment_attachments(assignment["id"])
        assignment["members"] = yield self.get_assignment_members(assignment["id"], user_id)
        assignment["submission_files"] = yield self.get_assignment_submission_files(assignment["id"], user_id)
        assignment["expected_files"] = yield self.get_expected_files(assignment["id"])
        if not assignment["submission_files"]:
            assignment["submission_id"] = 0
        else:
            subs = yield self.connection.runQuery(query._GET_SUB_ID, (assignment["id"], user_id))
            sub = subs[0]
            assignment["submission_id"] = sub.id
            assignment["submission"] = self.serialize_submissions(sub)
        defer.returnValue(assignment)

    @defer.inlineCallbacks
    def get_expected_files(self, assignment_id):
        files = yield self.connection.runQuery(query._GET_EXPECTED_FILES, (assignment_id,))
        defer.returnValue([x.file_type for x in files])

    @defer.inlineCallbacks
    def get_assignment_attachments(self, assignment_id):
        attachments = yield self.connection.runQuery(query._GET_ASSIGNMENT_ATTACHMENTS, (assignment_id,))
        res = []
        for row in attachments:
            res.append(self.serialize_attachment(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_assignment_members(self, assignment_id, user_id):
        members = yield self.connection.runQuery(query._GET_ASSIGNMENT_MEMBERS, (assignment_id, user_id))
        res = []
        for row in members:
            res.append(self.serialize_user(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_assignment_submission_files(self, assignment_id, user_id):
        members = yield self.connection.runQuery(query._GET_ASSIGNMENT_SUBMISSION_FILES, (assignment_id, user_id))
        res = []
        for row in members:
            res.append(self.serialize_assignment_submission_files(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_submissions_by_assignment_id(self, assignment_id):
        submissions = yield self.connection.runQuery(query._GET_SUBMISSIONS_BY_ASSIGNMENT_ID, (assignment_id,))
        res = []
        for row in submissions:
            res.append(self.serialize_submissions(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_submission_files(self, submission_id):
        members = yield self.connection.runQuery(query._GET_SUBMISSION_FILES, (submission_id))
        res = []
        for row in members:
            res.append(self.serialize_assignment_submission_files(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def update_grade(self, submission_id, grade, status, time_taken=0):
        data = yield self.connection.runQuery(query._UPDATE_GRADE, (status, grade, time_taken, submission_id))
        if data:
            data = data[0].id
        defer.returnValue(data)


    @defer.inlineCallbacks
    def createCourse(self, data, user_id):
        #Create the course first
        data = yield self.connection.runQuery(query._CREATE_COURSE,
                (data["code"], data["section"], data["name"], data["term"], data["year"]))
        data = data[0]
        #Add the instructor
        status = yield self.connection.runQuery(query._CREATE_COURSE_USER, (data.id, user_id, "instructor"))
        #Add TAs
        for ta in data["tas"]:
            status = yield self.connection.runQuery(query._CREATE_COURSE_USER, (data.id, ta, "ta"))
        #Add Students
        for student in data["students"]:
            status = yield self.connection.runQuery(query._CREATE_COURSE_USER, (data.id, ta, "student"))
        defer.returnValue(self.serialize_course(data))

    @defer.inlineCallbacks
    def get_assignment_stats(self, assignment_id):
        data = yield self.connection.runQuery(query._GET_STATS, (assignment_id,))
        data = data[0]
        grade = data.grade
        res = {"title": data.name,
               "grade_min": 0,
               "grade_max": data.grade_max,
               "total_students": len(grade)}
        new_grade = filter(lambda a: a!=0, grade)
        res["total_submissions"] = len(new_grade)
        res["marks"] = grade
        res["graph"] = []
        ranges = data.grade_max/10
        count = 1
        while count < data.grade_max:
            name = str(count) + "-" + str(count+ranges-1)
            cc = len(filter(lambda a: (a>=count and a<count+ranges), grade))
            res["graph"].append([name, cc])
            count += ranges
        defer.returnValue(res)
        
    @defer.inlineCallbacks
    def update_visibility(self, assignment_id, is_visible):
        data = yield self.connection.runQuery(query._UPDATE_STATS, (is_visible, assignment_id))
        defer.returnValue(data)

    @defer.inlineCallbacks
    def create_assignment(self, data):
        res = yield self.connection.runQuery(query._CREATE_ASSIGNMENT,
                (data["title"], data["description"], datetime.fromtimestamp(data["deadline"]/1000), data["group"],
                    data["total"], data["course_id"]))
        res = res[0]
        for attachment in data["expected_files"]:
            status = yield self.connection.runQuery(query._CREATE_ASSIGNMENT_FILE, (res.id, attachment))
        defer.returnValue(self.serialize_assignment(res))

    @defer.inlineCallbacks
    def create_assignment_attachment(self, assignment_id, file_path):
        res = yield self.connection.runQuery(query._CREATE_ASSIGNMENT_ATTACHMENT, (assignment_id, file_path))
        defer.returnValue({"path": file_path})

    @defer.inlineCallbacks
    def create_submission_attachment(self, submission_id, file_path):
        res = yield self.connection.runQuery(query._CREATE_SUBMISSION_ATTACHMENT, (submission_id, file_path))
        defer.returnValue({"path": file_path})

    @defer.inlineCallbacks
    def create_submission(self, assignment_id, user_id):
        group_id = yield self.connection.runQuery(query._CREATE_GROUP, (assignment_id,))
        group_id = group_id[0].id
        yield self.connection.runQuery(query._CREATE_GROUP_USER, (group_id, user_id))
        sub_id = yield self.connection.runQuery(query._CREATE_SUBMISSION, (assignment_id, group_id))
        defer.returnValue(sub_id[0].id)

    def add_pagecount(self, user_id, page):
        return self.connection.runQuery(query._PAGE_COUNT, (user_id, page))

    @defer.inlineCallbacks
    def create_feedback(self, comment, user_id, file_id):
        res = yield self.connection.runQuery(query._CREATE_FEEDBACK, (comment, user_id, file_id))
        res = res[0]
        feedback = yield self.serialize_feedback(res)
        defer.returnValue(feedback)

    @defer.inlineCallbacks
    def get_feedback(self, file_id):
        members = yield self.connection.runQuery(query._GET_FEEDBACK, (file_id,))
        res = []
        for row in members:
            feedback = yield self.serialize_feedback(row)
            res.append(feedback)
        defer.returnValue(res)






