import cyclone.web
from twisted.internet import defer
from cyclone_server.db.mixin import DatabaseMixin


class IndexHandler(cyclone.web.RequestHandler, DatabaseMixin):
    def get(self):
    	self.render("index.html")

class DeadlinesHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("main.html")

class newAssignmentHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("ta_create_assignment.html")

class taStats(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("ta_stats.html")
