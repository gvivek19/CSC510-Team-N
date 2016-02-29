import query
import json
from twisted.internet import defer


class PostgresDatabase(object):
    def __init__(self, connection):
        self.connection = connection

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
            res.append({
                    "id": row.id
                    "course_code": row.course_code,
                    "course_name": row.name,
                    "section": row.section,
                    "term": row.term,
                    "year": row.year
            })
        defer.returnValue(res)

    @defer.inlineCallbacks
    def get_deadlines(self, user_id, course_id=None):
        assignments = None
        if course_id:
            assignments = yield self.connection.runQuery(_GET_DEADLINES_BY_COURSE, (user_id, course_id))
        else:
            assignments = yield self.connection.runQuery(_GET_DEADLINES_BY_USER, (user_id,))
        res = []
        for row in assignments:
            res.append({
                    "id": row.id,
                    "title": row.title,
                    "description": row.description,
                    "created": row.created,
                    "deadline": row.deadline,
                    "grade_max": row.grade_max,
                    "is_group": row.is_group,
                    "course_id": row.course_id
            })
        defer.returnValue(res);




