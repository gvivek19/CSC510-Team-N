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

    def write_status(self, data):
        if data:
            return self.write_json({'status': True})
        return self.write_json({'status': False})


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

    @HTTPBasic
    @defer.inlineCallbacks
    def post(self):
        data = json.loads(self.get_argument("data"))
        res = yield self.database.createCourse(data, self.user.unity_id)
        defer.returnValue(self.write_data(res))


class DeadlinesHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, course_id=None):
        assignments = yield self.database.get_deadlines(self.user.id, course_id)
        defer.returnValue(self.write_data(assignments))


class AssignmentHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, assignment_id=None):
        assignment = yield self.database.get_assignment_by_id(assignment_id, self.user.id)
        defer.returnValue(self.write_data(assignment))

    @HTTPBasic
    @defer.inlineCallbacks
    def post(self):
        assignment = yield self.database.create_assignment(json.loads(self.get_argument("data")))
        defer.returnValue(self.write_data(assignment))


class AssignmentUploadHandler(APIBase, FileUploadMixin):
    @HTTPBasic
    @defer.inlineCallbacks
    def post(self, assignment_id):
        file_path, file_size, file_type = self.save_file("assignment", assignment_id)
        res = yield self.database.create_assignment_attachment(assignment_id, file_path)
        defer.returnValue(self.write_data(res))


class SubmissionUploadHandler(APIBase, FileUploadMixin):
    @HTTPBasic
    @defer.inlineCallbacks
    def post(self, submission_id, assignment_id=None):
        if submission_id == 0 or submission_id == "0":
            submission_id = yield self.database.create_submission(assignment_id, self.user.id)
        file_path, file_size, file_type = self.save_file("submission", submission_id)
        res = yield self.database.create_submission_attachment(submission_id, file_path)
        defer.returnValue(self.write_data(res))

class EvaluationHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, assignment_id):
        submissions = yield self.database.get_submissions_by_assignment_id(assignment_id)
        defer.returnValue(self.write_data(submissions))


class EvaluationSubmissionHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, submission_id):
        files = yield self.database.get_submission_files(submission_id)
        defer.returnValue(self.write_data(files))

    @HTTPBasic
    @defer.inlineCallbacks
    def post(self, submission_id):
        grade = int(self.get_argument('total_marks', '0'))
        time_taken = int(self.get_argument('time_taken', '0'))
        data = yield self.database.update_grade(submission_id, grade, "Graded", time_taken)
        defer.returnValue(self.write_status(data))


class StatsHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, assignment_id):
        data = yield self.database.get_assignment_stats(assignment_id)
        defer.returnValue(self.write_data(data))

    @HTTPBasic
    @defer.inlineCallbacks
    def post(self, assignment_id):
        is_visible = self.get_argument('visibility', 'true')
        is_visible = (is_visible == 'true')
        data = yield self.database.update_visibility(assignment_id, is_visible)
        defer.returnValue(self.write_status(data))


class EvaluateFileHandler(APIBase):

    @HTTPBasic
    @defer.inlineCallbacks
    def get(self, file_id):
        data = yield self.database.get_feedback(file_id)
        defer.returnValue(self.write_data(data))

    @HTTPBasic
    @defer.inlineCallbacks
    def post(self, file_id):
        comment = self.get_argument("comment")
        res = yield self.database.create_feedback(comment, self.user.id, file_id)
        defer.returnValue(self.write_data(res))


