import sys, os, random, json
import opentimelineio as otio
from shutil import copyfile
from flask import Flask, render_template, request, redirect, Response
dir_path = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__)

@app.route('/')
def output():
	print("Index has been pinged!")
	return "C1 Python Endpoint"

@app.route('/sync_otio', methods = ['POST'])
def sync_otio():
	def writeOtioFile(filepath):
		timeline_name = None
		operation = None
		try:
			timeline_name = os.path.basename(filepath).split(".")[0]
			fileExtension = os.path.basename(filepath).split(".")[1]
		except:
			print("Filetype not recognized.")
			return False
		save_to = os.path.join(os.path.dirname(filepath), timeline_name)
		try:
			timeline = otio.adapters.read_from_file(filepath)
		except:
			print("No Adapter for this filetype.\nSee available Adapters here:\nhttps://github.com/PixarAnimationStudios/OpenTimelineIO\#adapters")
			return False
		if fileExtension == "xml":
			# create .otio and .json save paths
			save_otio_to = save_to + ".otio"
			save_json_to = save_to + ".json"
			# generate .otio
			otio.adapters.write_to_file(timeline, save_otio_to)
			# copy the .otio file and save as .json (for REACT app)
			copyfile(save_otio_to, save_json_to)
		elif fileExtension == "otio":
			save_to += ".xml"
			otio.adapters.write_to_file(timeline, save_to)
		print("Saved to:\n" + save_to)
		data = {otio: timeline, path : {json:save_json_to, otio: save_otio_to}}
		return data
	def writeShotLog(timeline):
		print timeline
		for each_seq in timeline.tracks:
			for each_item in each_seq:
				if isinstance(each_item, otio.schema.Clip):
					print each_item.media_reference

	#########################################################
	# read json + reply
	data = request.get_json()
	newPath = os.path.join(dir_path, "src", "OTIO", os.path.basename(data["fcpxml"]))
	timeline = writeOtioFile(newPath)
	print("sync_otio has been pinged!\n\n" + str(timeline))
	writeShotLog(timeline)
	return "synced"

if __name__ == '__main__':
	# run!
	app.run()