import json
from cyclone_server import config
from twisted.internet import defer
from cyclone_server.db.mixin import DatabaseMixin
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


class LoginHandler(APIBase):

    @defer.inlineCallbacks
    def get(self):
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