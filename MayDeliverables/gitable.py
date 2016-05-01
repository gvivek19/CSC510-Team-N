#  gitabel
#  the world's smallest project management tool
#  reports relabelling times in github (time in seconds since epoch)
#  thanks to dr parnin
#  todo:
#    - ensure events sorted by time
#    - add issue id
#    - add person handle

"""
You will need to add your authorization token in the code.
Here is how you do it.
1) In terminal run the following command
curl -i -u <your_username> -d '{"scopes": ["repo", "user"], "note": "OpenSciences"}' https://api.github.com/authorizations
2) Enter ur password on prompt. You will get a JSON response. 
In that response there will be a key called "token" . 
Copy the value for that key and paste it on line marked "token" in the attached source code. 
3) Run the python file. 
     python gitable.py <Owner> <Repo>
"""
 
from __future__ import print_function
import urllib2
import json
import re,datetime,sys


token = xsss


users = dict()
count = 0

def anonymize(user):
  global users, count
  if not user:
    return "anon"
  if not user in users.keys():
    count += 1
    users[user] = "user"+str(count)
  return users[user]


def secs(d0):
  d     = datetime.datetime(*map(int, re.split('[^\d]', d0)[:-1]))
  epoch = datetime.datetime.utcfromtimestamp(0)
  delta = d - epoch
  return delta.total_seconds()

def dumpCommit(u,commits):
  request = urllib2.Request(u, headers={"Authorization" : "token "+token})
  v = urllib2.urlopen(request).read()
  w = json.loads(v)
  if not w: return False
  for commit in w:
    sha = commit['sha']
    user = commit['author']
    if not user:
      user = None
    elif 'login' in user.keys():
      user = user['login']
    else:
      user = user["name"]
    time = secs(commit['commit']['author']['date'])
    message = commit['commit']['message']
    commitObj = {"sha": sha,
                "user": anonymize(user),
                "time": time,
                "message": message}
    commits.append(commitObj)
  return True

def dumpComments(u, comments):
  request = urllib2.Request(u, headers={"Authorization" : "token "+token})
  v = urllib2.urlopen(request).read()
  w = json.loads(v)
  if not w: return False
  for comment in w:
    user = comment['user']['login']
    identifier = comment['id']
    issueid = int((comment['issue_url'].split('/'))[-1])
    comment_text = comment['body']
    created_at = secs(comment['created_at'])
    updated_at = secs(comment['updated_at'])
    commentObj = {"id": identifier,
                "issue": issueid, 
                "user": anonymize(user),
                "text": comment_text,
                "created_at": created_at,
                "updated_at": updated_at}
    comments.append(commentObj)
  return True

def dumpMilestone(u, milestones):
  request = urllib2.Request(u, headers={"Authorization" : "token "+token})
  try:
    v = urllib2.urlopen(request).read()
  except urllib2.HTTPError:
    return False
  w = json.loads(v)
  if not w or ('message' in w and w['message'] == "Not Found"): return False
  for milestone in w:
    identifier = milestone['id']
    milestone_id = milestone['number']
    milestone_title = milestone['title']
    milestone_description = milestone['description']
    created_at = secs(milestone['created_at'])
    due_at_string = milestone['due_on']
    due_at = secs(due_at_string) if due_at_string != None else due_at_string
    closed_at_string = milestone['closed_at']
    closed_at = secs(closed_at_string) if closed_at_string != None else closed_at_string
    user = milestone['creator']['login']
      
    milestoneObj = {"id": identifier,
                 "number": milestone_id,
                 "name": milestone_title,
                 "description": milestone_description,
                 "created_at": created_at,
                 "due_at": due_at,
                 "closed_at": closed_at,
                 "user": anonymize(user)}
    milestones.append(milestoneObj)
  return True

def dump1(u,issues):
  request = urllib2.Request(u, headers={"Authorization" : "token "+token})
  v = urllib2.urlopen(request).read()
  w = json.loads(v)
  if not w: return False
  for event in w:
    issue_id = event['issue']['number']
    label_name = None
    if event.get('label'):
      label_name = event['label']['name']
    created_at = secs(event['created_at'])
    action = event['event']
    user = event['actor']['login']
    milestone = event['issue']['milestone']
    if milestone != None : milestone = milestone['title']
    eventObj = {"when": created_at,
                 "action": action,
                 "what": label_name,
                 "user": anonymize(user),
                 "milestone": milestone}
    if action == 'assigned' or action == 'unassigned':
      eventObj["assignee"] = anonymize(event['assignee']['login'])
      eventObj["assigner"] = anonymize(event['assigner']['login'])
    all_events = issues.get(issue_id)
    if not all_events: all_events = []
    all_events.append(eventObj)
    issues[issue_id] = all_events
  return True

def dump(u,issues):
  try:
    return dump1(u, issues)
  except Exception as e: 
    print(e)
    print("Contact TA")
    return False


def launchDump(link, name):
  global users, count
  users = dict()
  count = 0

  page = 1
  issues = dict()
  print("Downloading issues")
  while(True):
    doNext = dump('https://api.github.com/repos/'+link+'/issues/events?page=' + str(page), issues)
    print("page "+ str(page))
    page += 1
    if not doNext : break
  print(str(len(issues.keys())) + " issues downloaded")
  open("data/"+name+"_issues.json", "w").write(json.dumps(issues))

  page = 1
  milestones = []
  print("Downloading milestones")
  while(True):
    url = 'https://api.github.com/repos/'+link+'/milestones?state=all&page=' + str(page)
    doNext = dumpMilestone(url, milestones)
    print("page "+ str(page))
    page += 1
    if not doNext : break
  print(str(len(milestones)) + " milestones downloaded")
  open("data/"+name+"_milestones.json", "w").write(json.dumps(milestones))

  page = 1
  comments = []
  print("Downloading comments")
  while(True):
    url = 'https://api.github.com/repos/'+link+'/issues/comments?page='+str(page)
    doNext = dumpComments(url, comments)
    print("page "+ str(page))
    page += 1
    if not doNext : break
  print(str(len(comments)) + " comments downloaded")
  open("data/"+name+"_comments.json", "w").write(json.dumps(comments))

  page = 1
  commits = []
  print("Downloading commits")
  while(True):
    url = 'https://api.github.com/repos/'+link+'/commits?page=' + str(page)
    doNext = dumpCommit(url, commits)
    print("page "+ str(page))
    page += 1
    if not doNext : break
  print(str(len(commits)) + " commits downloaded")
  open("data/"+name+"_commits.json", "w").write(json.dumps(commits))

  priv = dict()
  priv["name"] = name
  priv["link"] = link
  priv["users"] = users
  print(str(count) + " USERS")
  open("data/"+name+"_priv.json", "w").write(json.dumps(priv))
  print("DONE")

def run():
  links = json.loads(open("links.json", "r").read())
  for key in links.keys():
    print()
    print("Processong repo " + key)
    launchDump(links[key], key)
    print()

if __name__ == "__main__":
  run()