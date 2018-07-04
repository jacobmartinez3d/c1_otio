import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Table } from "reactstrap";
// import { CSVLink, CSVDownload } from "react-csv";
const path_to_fcpxml = "./OTIO/timeline.xml";
var sync_fcpxml, otio_json;
try {
  sync_fcpxml = require("./OTIO/timeline.xml");
  otio_json = require("./OTIO/timeline.json");
} catch (err) {
  console.warn(err)
}

class App extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      button_label: "Build Spreadsheet",
      timeline: null,
      shotLog: null,
      fcpxml: path_to_fcpxml,
      // set state to the required file to detect changes (this is the beauty of react!)
      sync_fcpxml: sync_fcpxml || "jacob"
    };
  }
  componentDidMount() {
    this.syncTimeline(this.state.fcpxml);
    // console.log("RESULT from flask:", result);
    this.setState({
      shotLog: this.createShotLog()
    });
  }
  syncTimeline(fcpxml) {
    var data = JSON.stringify({ fcpxml: fcpxml });
    var synced_otio = fetch("http://127.0.0.1:5000/sync_otio", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "no-cors",
        "Content-Length": data.length
      },
      body: data
    })
      // What are all these for?
      .then(response => {
        return response;
      })
      .then(response => response.ok && response.json())
      .then(responseJson => {})
      .catch(error => {});
    return synced_otio;
  }
  createShotLog() {
    const csvData = [];
    // Tracks
    try {
      otio_json.tracks.children.forEach((track, i) => {
        if (track.kind === "Video") {
          // console.warn(track);
          // Video Clips
          track.children.forEach((clip, j) => {
            if (clip.OTIO_SCHEMA === "Clip.1") {
              let edit_in = clip.source_range.start_time.value
              let edit_out = clip.source_range.start_time.value + clip.source_range.duration.value
              let source_duration = clip.media_reference.available_range.duration.value
              let source_framerate = clip.media_reference.available_range.duration.rate
              console.warn("clip:\n\n", clip);
              csvData.push([
                // 0: Name
                clip.name + " (" + source_framerate + "fps)",
                // 1: Edit In
                edit_in,
                // 2: Edit Out
                edit_out,
                // 3: Head
                edit_in - 240 < 0? 0:edit_in - 240,
                // 4. Tail
                edit_out + 240 > source_duration? source_duration:edit_out + 240,
                // 5: Edit Duration
                clip.source_range.duration.value,
                // 6: VFX Notes
                clip.markers.map((marker, k) => {
                  var result;
                  if (marker.name && marker.marked_range.duration.value < 1) {
                    // console.warn(marker);
                    result = "x" + marker.marked_range.start_time.value + ", ";
                  } else if (marker.name && marker.marked_range.duration.value >= 1) {
                    // console.warn(marker);
                    result =
                      "[VFX]: x" +
                      marker.marked_range.start_time.value +
                      " - x" +
                      marker.marked_range.start_time.value +
                      marker.marked_range.duration.value +
                      ", ";
                  }
                  return result;
                }),
                // 7: URL
                clip.media_reference.target_url
              ]);
            }
          });
        }
      });
    } catch (err) {
      // console.warn(err);
    }
    return csvData;
  }
  render() {
    if (!this.state.shotLog) {
      return <h1>Loading Timeline...</h1>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">C1 Timeline</h1>
        </header>
        <p>
          {this.state.synced_fcpxml && this.state.synced_fcpxml}
        </p>

        {this.state.shotLog &&
          <Table>
            <thead>
              <tr>
                <th>SHOT</th>
                <th>Edit In</th>
                <th>Edit Out</th>
                <th><i>(Head)</i></th>
                <th><i>(Tail)</i></th>
                <th>Edit Duration</th>
                <th>VFX Notes</th>
                <th>Source Url</th>
              </tr>
            </thead>
            <tbody>
              {this.state.shotLog.map((shot, i) => {
                return (
                  <tr key={i}>
                    <th>
                      {shot[0]}
                    </th>
                    <th>
                      {shot[1]}
                    </th>
                    <th>
                      {shot[2]}
                    </th>
                    <th>
                      <i>({shot[3]})</i>
                    </th>
                    <th>
                      <i>({shot[4]})</i>
                    </th>
                    <th>
                      {shot[5]}
                    </th>
                    <th>
                      {shot[6]}
                    </th>
                    <th>
                      {shot[7]}
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </Table>}
      </div>
    );
  }
}

export default App;
