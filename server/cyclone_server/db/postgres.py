import query
import json


class PostgresDatabase(object):
    def __init__(self, connection):
        self.connection = connection