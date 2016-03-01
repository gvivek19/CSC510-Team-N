import cyclone.web
from twisted.internet import defer
from cyclone_server.db.mixin import DatabaseMixin


class IndexHandler(cyclone.web.RequestHandler, DatabaseMixin):
    def get(self):
    	self.render("index.html")

class DeadlinesHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("main.html")

class AssignmentHandler(cyclone.web.RequestHandler, DatabaseMixin):
	def get(self):
		self.render("assignment.html")