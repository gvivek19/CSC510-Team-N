import json
from cyclone_server import config
from twisted.internet import defer
from cyclone_server.db.mixin import DatabaseMixin
from cyclone_server.utils import HTTPBasic, FileUploadMixin
import cyclone


class APIBase(cyclone.web.RequestHandler, DatabaseMixin):

    def get_config(self):
        path = config.config_file_path()
        settings = config.parse_config(path)
        return settings

    def prepare(self):
        self.set_header("Content-Type", "application/json")
        self.set_header("Cache-Control", "no-cache")

    def write_json(self, d):
        self.set_header("Content-Type", "application/json")
        return self.write(json.dumps(d, sort_keys=True, indent=4))

    def write_data(self, data):
        res = {}
        if data:
            res['status'] = True
            res['data'] = data
        else:
            res['status'] = False
        return self.write_json(res)


class LoginHandler(APIBase):

    @defer.inlineCallbacks
    def post(self):
        username = self.get_argument('username', None)
        password = self.get_argument('password', None)
        user = yield self.database.login_user(username, password)
        res = {}
        if user:
            res['status'] = True
            res['_id'] = user.id
        else:
            res['status'] = False
        defer.returnValue(self.write_json(res))


class CoursesHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self):
        courses = yield self.database.get_courses_by_user_id(self.user.id)
        defer.returnValue(self.write_data(courses))


class DeadlinesHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, course_id=None):
        assignments = yield self.database.get_deadlines(self.user.id, course_id)
        defer.returnValue(self.write_data(assignments))


class AssignmentHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, assignment_id):
        assignment = yield self.database.get_assignment_by_id(assignment_id, self.user.id)
        defer.returnValue(self.write_data(assignment))

