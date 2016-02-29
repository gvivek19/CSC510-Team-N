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