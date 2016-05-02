import read
import numpy as np
import graph
from collections import Counter, defaultdict
from datetime import datetime


files = ["1", "2", "3", "4", "5"]

# 1 = issue open time
def process_1():
	issues = {}
	for item in files:
		time_diff = []
		issue_data = read.get_issues(item)
		for issue in issue_data.keys():
			single_list = [x["when"] for x in issue_data[issue]]
			t = (max(single_list) - min(single_list)) / (60*60*24)
			if t == 0:
				continue
			time_diff.append(t)
		issues[item] = time_diff
		data = {"Less than a day": sum([1 for x in time_diff if x>=0 and x<1]),
				"2 to 5 days": sum([1 for x in time_diff if x>=1 and x<5]),
				"5 to 10 days": sum([1 for x in time_diff if x>=5 and x<10]),
				"10 days": sum([1 for x in time_diff if x>=10])
		}
		graph.pie_chart(data, "Issue open time of project "+item)
	graph.multiple_lines([issues[x] for x in issues.keys()])

# 2 = issue milestone gap
def process_2():
	neg_full = {}
	for item in files:
		milestones = read.get_milestones(item)
		milestones = {x["name"]:x["closed_at"] for x in milestones if x["closed_at"] }
		issue_data = read.get_issues(item)
		issue_diffs = []
		for issue in issue_data.keys():
			ist = max(issue_data[issue], key=lambda item:item['when'])
			if ist["milestone"] in milestones.keys():
				issue_diffs.append((milestones[ist["milestone"]] - ist["when"]) / (60*60))
		pos_diff = [x for x in issue_diffs if x>0]
		data = {"Less than an hour": sum([1 for x in pos_diff if x>=0 and x<1]),
				"2 to 5 hours": sum([1 for x in pos_diff if x>=1 and x<5]),
				"5 to 10 hours": sum([1 for x in pos_diff if x>=5 and x<10]),
				"10 hours": sum([1 for x in pos_diff if x>=10])
		}
		pos_diff_per = len(pos_diff)*100/len(issue_diffs)
		graph.pie_chart(data, str(pos_diff_per)+"\% for project "+item)
		neg_diff = [-x for x in issue_diffs if x<0]
		data = {"Less than an hour": sum([1 for x in neg_diff if x>=0 and x<1]),
				"2 to 5 hours": sum([1 for x in neg_diff if x>=1 and x<5]),
				"5 to 10 hours": sum([1 for x in neg_diff if x>=5 and x<10]),
				"10 hours": sum([1 for x in neg_diff if x>=10])
		}
		neg_diff_per = len(neg_diff)*100/len(issue_diffs)
		graph.pie_chart(data, str(neg_diff_per)+"\% for project "+item)
		neg_full["Project "+item] = neg_diff_per
	graph.pie_chart(neg_full, "Closed after milestone")

# 3 = number of issues assigned to each user
def process_3():
	for item in files:
		issue_data = read.get_issues(item)
		users = [max(issue_data[issue], key=lambda item:item['when'])["user"] for issue in issue_data.keys()]
		users = Counter(users)
		graph.pie_chart(users, "Project "+item)

# 4 = number of comments on each issue
def process_4():
	for item in files:
		issue_data = read.get_issues(item)
		comments = read.get_comments(item)
		user_dict = {}
		for comment in comments:
			if comment["issue"]:
				if comment["issue"] in user_dict.keys():
					user_dict[comment["issue"]] += 1
				else:
					user_dict[comment["issue"]] = 1
		user_dict = user_dict.values()
		print "Project " + item
		print "Total issues: " + str(len(issue_data))
		print "Commented issues: " + str(len(user_dict))
		print "Mean: " + str(np.mean(user_dict))
		print "Std: " + str(np.std(user_dict))
		print "Min: " + str(min(user_dict))
		print "Max: " + str(max(user_dict))
		print

# 5 = number of comments by each user
def process_5():
	for item in files:
		comments = read.get_comments(item)
		users = [x["user"] for x in comments]
		users = Counter(users)
		graph.pie_chart(users, "Project "+item)

# 6 = commit timeline
def process_6():
	for item in files:
		commits = read.get_commits(item)
		c_dict = {}
		for commit in commits:
			tt = datetime.fromtimestamp(commit["time"]).strftime('%m/%d')
			if tt in c_dict:
				c_dict[tt][1] += 1
			else:
				c_dict[tt] = [commit["time"], 1]
		c_dict = c_dict.items()
		c_dict = sorted(c_dict, key=lambda x:x[1][0])
		graph.bar_chart([x[1][1] for x in c_dict], [x[0] for x in c_dict], "Commit Timeline")

# 7 = number of commits by each user
def process_7():
	for item in files:
		commits = read.get_commits(item)
		users = [x["user"] for x in commits]
		users = Counter(users)
		graph.pie_chart(users, "Project "+item)

# 8 = milestones created at and due at
def process_8():
	for item in files:
		milestones = read.get_milestones(item)
		milestones = [(x["due_at"]-x["created_at"])/(60*60*24) for x in milestones if x["due_at"]]
		graph.bar_chart(milestones, title="Milestone created before due")

# 9 = short lived issues
def process_9():
	h_issues = {}
	d_issues = {}
	for item in files:
		time_diff = []
		issue_data = read.get_issues(item)
		for issue in issue_data.keys():
			single_list = [x["when"] for x in issue_data[issue]]
			t = (max(single_list) - min(single_list)) / (60*60)
			if t == 0:
				continue
			time_diff.append(t)
		h_issues[item] = sum([1 for x in time_diff if x>=0 and x<1])*100/len(issue_data.keys())
		d_issues[item] = sum([1 for x in time_diff if x>=0 and x<24])*100/len(issue_data.keys())
	graph.bar_chart(h_issues.values(), ["Project "+x for x in h_issues.keys()], "Hour long issues percent")
	graph.bar_chart(d_issues.values(), ["Project "+x for x in d_issues.keys()], "Day long issues percent")

# 11 = issue close time gap
def process_11():
	issues = {}
	for item in files:
		time_diff = []
		issue_data = read.get_issues(item)
		for issue in issue_data.keys():
			time_diff.append(max([x["when"] for x in issue_data[issue]]))
		time_diff = sorted(time_diff)
		tdd = []
		prev = 0
		for x in time_diff:
			if prev == 0:
				prev = x
				continue
			diff = (x - prev)/(60*60)
			prev = x
			tdd.append(diff)
		issues["Project "+item] = sorted(tdd)
	graph.multiple_lines(issues, "Issue time gap")

# 12 = issues with no milestones
def process_12():
	issues = {}
	for item in files:
		count = 0
		issue_data = read.get_issues(item)
		for issue in issue_data.keys():
			if(item == "1"):
				print [x["milestone"] for x in issue_data[issue]]
		
			if not any([True if x["milestone"] else False for x in issue_data[issue]]):
				count += 1
		issues["Project "+item] = count*100/len(issue_data.keys())
	graph.bar_chart(issues.values(), issues.keys(), "Issues with no milestones")

# 13 = milestones/issues
def process_13():
	for item in files:
		issues = read.get_issues(item)
		milestones = defaultdict(lambda:0)
		for i in issues.keys():
			ms = [x["milestone"] for x in issues[i] if x["milestone"]]
			if ms:
				milestones[ms[0]] += 1
		graph.bar_chart(milestones.values(), title="Issues/Milestone for project "+item)

#general count stats
def count_stats():
	issue = 0
	commit = 0
	comment = 0
	milestone = 0
	for item in files:
		print item
		issue_data = read.get_issues(item)
		issue += len(issue_data.keys())
		print "ISSUE: " + str(len(issue_data.keys()))
		milestone_data = read.get_milestones(item)
		milestone += len(milestone_data)
		print "milestone: " + str(len(milestone_data))
		comment_data = read.get_comments(item)
		comment += len(comment_data)
		print "comment: " + str(len(comment_data))
		commit_data = read.get_commits(item)
		commit += len(commit_data)
		print "commit: " + str(len(commit_data))
		print
	print "Total"
	print "ISSUE: " + str(issue)
	print "commit: " + str(commit)
	print "comment: " + str(comment)
	print "milestone: " + str(milestone)
	print

# early_detection
def early_det():
	for item in files:
		commits = read.get_commits(item)
		c_dict = {}
		r_dict = {}
		for commit in commits:
			if commit["user"] not in r_dict:
				r_dict[commit["user"]] = []
			tt = datetime.fromtimestamp(commit["time"]).strftime('%m/%d')
			if tt in c_dict:
				c_dict[tt][1].append(commit["user"])
			else:
				c_dict[tt] = [commit["time"], [commit["user"]]]

		c_dict = c_dict.items()
		c_dict = sorted(c_dict, key=lambda x:x[1][0])
		for x in c_dict:
			for u in r_dict.keys():
				c = sum([1 for y in x[1][1] if y==u])
				r_dict[u].append(c)
		graph.multiple_lines(r_dict, "Commits in project "+item, [x[0] for x in c_dict])


if __name__ == "__main__":
	early_det()
	count_stats()
	process_1()
	process_2()
	process_3()
	process_4()
	process_5()
	process_6()
	process_7()
	process_8()
	process_9()
	process_10()
	process_11()
	process_12()
	process_13()