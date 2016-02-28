import functools
import cyclone.web
from twisted.internet import defer


def HTTPBasic(method):
    @functools.wraps(method)
    @defer.inlineCallbacks
    def wrapper(self, *args, **kwargs):
        user_id = self.get_argument('_id', None)
        if not user_id:
            raise cyclone.web.HTTPAuthenticationRequired()
        self.user = yield self.database.get_user_by_id(user_id)
        defer.returnValue(self.method(*args, **kwargs))
    return wrapper