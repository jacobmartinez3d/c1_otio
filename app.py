import sys

from flask import Flask, render_template, request, redirect, Response
import random, json

app = Flask(__name__)

@app.route('/')
def output():
	# serve index template
	return

@app.route('/convert_to_otio', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	result = ''

	return result

if __name__ == '__main__':
	# run!
	app.run()