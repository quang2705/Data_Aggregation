import React, { Component } from "react";
import { render } from "react-dom";
import API from './Api'
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from 'react-vis';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataFile: null,
      start_datetime: '',
      end_datetime: '',
    };
  }

  componentDidMount() {
      this.filterDate();
  }

  onTextChangeHandler(event) {
      this.setState({[event.target.name]: event.target.value});
  }

  onChangeHandler(event) {
      this.setState({dataFile: event.target.files[0]});
  }

  onClickUpload(event) {
      API.upload_temperatures(this.state.dataFile);
  }

  filterDate() {
      API.get_temperatures({'datetime[gte]':this.state.start_datetime,
                            'datetime[lte]':this.state.end_datetime,})
        .then((data) => {
            this.setState({data: data});
        });
  }


  render() {
      var temp_data = this.state.data.map((temperature, index) => {
          let date_time = new Date(temperature.date_time);
          return {x: date_time.getTime(), y: temperature.temp};
      });
      temp_data.sort((a,b) => {
          if (a.x > b.x) return 1;
          if (a.x < b.x) return -1;
          return 0;
      });

    return (
        <div>
            <form>
                <input type="file" name="file" onChange={(e) => this.onChangeHandler(e)}/><br/>
                <br/>
                <input type="button" value="upload" onClick={(e) => this.onClickUpload(e)}/><br/>
                <br/>
                <label> start time<br/>
                    <input type="datetime-local" name="start_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
                </label>
                <br/>
                <br/>
                <label> end time<br/>
                    <input type="datetime-local" name="end_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
                </label>
                <br/>
                <br/>

                <input type='button' value='filter' onClick={(e) => this.filterDate()}/><br/>
                <br/>

            </form>

            <XYPlot xType="time" width={700} height={400}>
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="X Axis" />
              <YAxis title="Y Axis" />
              <LineSeries
                data={temp_data}
              />
              <LineSeries
                data={null}
              />
           </XYPlot>
        </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
