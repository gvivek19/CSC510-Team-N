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

    #APIs
    URLSpec(r'/login', api.LoginHandler),
    URLSpec(r'/courses', api.CoursesHandler)
])
