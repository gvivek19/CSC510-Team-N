from cyclone.web import URLSpec
from cyclone_server import views
from cyclone_server import api


def munge_route_list(rl):
    new_l = []
    for item in rl:
        if isinstance(item, list):
            new_l.extend(munge_route_list(item))
        else:
            new_l.append(item)
    return new_l


routes = munge_route_list([
	#VIEWS
    URLSpec(r'/', views.IndexHandler, name='home'),
    URLSpec(r'/main', views.DeadlinesHandler, name='main'),
<<<<<<< HEAD
    URLSpec(r'/ta_create_assignment',views.newAssignmentHandler),
    URLSpec(r'/ta_stats',views.taStats),

    #APIs
    URLSpec(r'/login', api.LoginHandler)

=======
    URLSpec(r'/mainta', views.DeadlinesTAHandler, name='mainta'),
    URLSpec(r'/assignment', views.AssignmentHandler, name='assignment'),
    
    #APIs
    URLSpec(r'/login', api.LoginHandler),
    URLSpec(r'/courses', api.CoursesHandler),
    URLSpec(r'/deadlines', api.DeadlinesHandler),
    URLSpec(r'/deadlines/([0-9]+)', api.DeadlinesHandler),
    URLSpec(r'/assignments/([0-9]+)', api.AssignmentHandler),
    URLSpec(r'/evaluate/([0-9]+)', api.EvaluationHandler),
    URLSpec(r'/evaluate/submission/([0-9]+)', api.EvaluationSubmissionHandler)
>>>>>>> f676b058794b4528a23cdd2e7396e53716c36f65
])
