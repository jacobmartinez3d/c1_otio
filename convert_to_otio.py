import sys
import os
import opentimelineio as otio
from flask import Flask, render_template, request, redirect, Response
import random, json

app = Flask(__name__)

@app.route('/')
def c1_timeline( filepath="./src/OTIO/timeline.xml" ):
    try:
        timeline_name = os.path.basename(filepath).split(".")[0]
        operation = os.path.basename(filepath).split(".")[1]
        
    except:
        nuke.message("Filetype not recognized.")
        return "False"
    save_to = os.path.dirname(filepath) + "/" + timeline_name
    try:
        timeline = otio.adapters.read_from_file(filepath)
    except:
        nuke.message("No Adapter for this filetype.\nSee available Adapters here:\nhttps://github.com/PixarAnimationStudios/OpenTimelineIO\#adapters")
    if operation == "xml":
        save_to += ".otio"
        otio.adapters.write_to_file(timeline, save_to)
    elif operation == "otio":
        save_to += ".xml"
        otio.adapters.write_to_file(timeline, save_to)
    return "jacob rulz"


@app.route('/convert', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()

	return "jacob rules"

if __name__ == '__main__':
	# run!
	app.run()