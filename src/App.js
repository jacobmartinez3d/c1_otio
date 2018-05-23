import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Table } from "reactstrap";
import { CSVLink, CSVDownload } from "react-csv";
const otio_json = require("./CMP_testTimeline.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      button_label: "Build Spreadsheet",
      timeline: otio_json,
      shotLog: null
    };
  }
  componentDidMount() {
    const csvData = [];
    // Tracks
    otio_json.tracks.children.forEach((track, i) => {
      if (track.kind == "Video") {
        console.warn(track);
        // Video Clips
        track.children.forEach((clip, j) => {
          if (clip.OTIO_SCHEMA == "Clip.1") {
            console.warn(clip);
            csvData.push([
              // 0: Name
              clip.name.split(".")[0],
              // 1: Source Duration
              clip.media_reference.available_range.duration.value,
              // 2: Edit Duration
              clip.source_range.duration.value,
              // 3: Edit In
              clip.source_range.start_time.value,
              // 4: Edit Out
              clip.source_range.start_time.value + clip.source_range.duration.value,
              // 5: VFX Notes
              clip.markers.map((marker, k) => {
                if (marker.name && marker.marked_range.duration.value < 1) {
                  console.warn(marker);
                  return "x" + marker.marked_range.start_time.value + ", ";
                } else if (marker.name && marker.marked_range.duration.value >= 1) {
                  console.warn(marker);
                  return (
                    "[VFX]: x" +
                    marker.marked_range.start_time.value +
                    " - x" +
                    marker.marked_range.start_time.value +
                    marker.marked_range.duration.value +
                    ", "
                  );
                }
              }),
              // 6:
              clip.media_reference.target_url
            ]);
          }
        });
      }
    });
    this.setState({
      shotLog: csvData
    });
    console.log(csvData);
  }

  render() {
    if (!this.state.shotLog) {
      return <h1>Loading TImeline...</h1>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">C1 Timeline</h1>
        </header>

        {this.state.shotLog &&
          <Table>
            <thead>
              <tr>
                <th>SHOT</th>
                <th>Source Duration</th>
                <th>Edit Duration</th>
                <th>Edit In</th>
                <th>Edit Out</th>
                <th>VFX Notes</th>
                <th>Source Url</th>
              </tr>
            </thead>
            {this.state.shotLog.map((shot, i) => {
              return (
                <tr>
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
                    {shot[3]}
                  </th>
                  <th>
                    {shot[4]}
                  </th>
                  <th>
                    {shot[5]}
                  </th>
                  <th>
                    {shot[6]}
                  </th>
                </tr>
              );
            })}
            <tbody />
          </Table>}
      </div>
    );
  }
}

export default App;
