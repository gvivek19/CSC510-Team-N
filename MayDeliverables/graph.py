import matplotlib.pyplot as plt
import numpy as np


def bar_chart(y, x=None, title=None):
	N = len(y)
	if not x:
		x = range(N)
	plt.xticks(range(len(x)), x, rotation='vertical')
	plt.bar(range(len(x)), y, color="blue")
	plt.xlabel('Milestone')
	plt.ylabel('Hours')
	title = title.replace(" ", "\\ ")
	plt.title(r'$\mathrm{'+title+'}$')
	plt.show()

def multiple_lines(data, title):
	for d in data.keys():
		plt.plot(sorted(data[d]), label=d)
	plt.xlabel('Issues')
	plt.ylabel('Time gap')
	plt.legend(loc=2)
	title = title.replace(" ", "\\ ")
	plt.title(r'$\mathrm{'+title+'}$')
	plt.show()

def pie_chart(data, title):
	plt.pie(data.values(), labels=data.keys(), startangle=140, autopct='%1.1f%%')
	title = title.replace(" ", "\\ ")
	plt.title(r'$\mathrm{'+title+'}$')
	plt.show()