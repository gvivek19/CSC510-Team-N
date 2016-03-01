import query
import json
from twisted.internet import defer


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

    def serialize_course(self, course):
        return {
                "id": course.id,
                "course_code": course.course_code,
                "course_name": course.name,
                "section": course.section,
                "term": course.term,
                "year": course.year
        }

    def serialize_assignment(self, assignment):
        return {
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "created": assignment.created,
                "deadline": assignment.deadline,
                "grade_max": assignment.grade_max,
                "is_group": assignment.is_group,
                "course_id": assignment.course_id
        }

    def serialize_submissions(self, submission):
        return {
                "id": submission.id,
                "assignment_id": submission.question_id,
                "grading_status": submission.grading_status,
                "group_id": submission.group_id,
                "grade": submission.grade,
                "students": submission.students
        }

    def serialize_attachment(self, attachment):
        return {
                "id": attachment.id,
                "filepath": attachment.file_path
        }

    def serialize_assignment_submission_files(self, attachment):
        return {
                "id": attachment.id,
                "filepath": attachment.file_path
        }

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
            res.append(self.serialize_course(row))
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
        defer.returnValue(assignment)

    @defer.inlineCallbacks
    def get_assignment_attachments(self, assignment_id):
        attachments = yield self.connection.runQuery(query._GET_ASSIGNMENT_ATTACHMENTS, (assignment_id,))
        res = []
        for row in attachments:
            res.append(self.serialize_attachment(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_assignment_members(assignment_id, user_id):
        members = yield self.connection.runQuery(query._GET_ASSIGNMENT_MEMBERS, (assignment_id, user_id))
        res = []
        for row in members:
            res.append(self.serialize_user(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_assignment_submission_files(assignment_id, user_id):
        members = yield self.connection.runQuery(query._GET_ASSIGNMENT_SUBMISSION_FILES, (assignment_id, user_id))
        res = []
        for row in members:
            res.append(self.serialize_assignment_submission_files(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_submissions_by_assignment_id(assignment_id):
        submissions = yield self.connection.runQuery(query._GET_SUBMISSIONS_BY_ASSIGNMENT_ID, (assignment_id,))
        res = []
        for row in members:
            res.append(self.serialize_submissions(row))
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_submission_files(submission_id):
        members = yield self.connection.runQuery(query._GET_SUBMISSION_FILES, (submission_id))
        res = []
        for row in members:
            res.append(self.serialize_assignment_submission_files(row))
        defer.returnValue(res)






