import json


def get_issues(file_no):
	return json.loads(open("data/"+file_no+"_issues.json", "r").read())

def get_milestones(file_no):
	return json.loads(open("data/"+file_no+"_milestones.json", "r").read())

def get_comments(file_no):
	return json.loads(open("data/"+file_no+"_comments.json", "r").read())

def get_commits(file_no):
	return json.loads(open("data/"+file_no+"_commits.json", "r").read())