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

class DeadlinesTAHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("mainta.html")

class AssignmentHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self, assignment_id=None):
		self.render("assignment.html")

class EvaluateHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self, assignment_id):
		self.render("evaluate.html")