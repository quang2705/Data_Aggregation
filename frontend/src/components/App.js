import React, { Component } from "react";
import { render } from "react-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from 'react-vis';

import API from './Api'
import './App.css';

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
      console.log(this.state.start_datetime);
      console.log(this.state.end_datetime);
  }

  onChangeHandler(event) {
      this.setState({dataFile: event.target.files[0]});
      document.getElementById("file-name").innerHTML = event.target.files[0].name;
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
      // <input type="file" name="file" onChange={(e) => this.onChangeHandler(e)}/><br/>
      // <input type="button" value="upload" onClick={(e) => this.onClickUpload(e)}/><br/>
      // <input type='button' value='filter' onClick={(e) => this.filterDate()}/><br/>
      // <label> start time
      //     <input type="datetime-local" name="start_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
      // </label>
      // <label> end time
      //     <input type="datetime-local" name="end_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
      // </label>
      var temp_data = this.state.data.map((temperature, index) => {
          let date_time = new Date(temperature.date_time);
          return {x: date_time.getTime(), y: temperature.temp};
      });
    return (
        <>
            <Container className="p-1">
                <Jumbotron>
                    <h1 className="header"> Data Aggregation</h1>
                    <p> This is a project that allows you to drop your data to the chart for visualization
                    </p>
                </Jumbotron>

                <Form>
                    <Form.Row>
                        <Col sm={2}>
                            <span id="file-name"></span>
                        </Col>
                        <Col sm={6}>
                            <Form.File id="data-file"
                            label="input json file"
                            custom
                            onChange={(e) => this.onChangeHandler(e)}
                            />
                        </Col>

                        <Col sm={4}>
                            <Button variant="primary" onClick={(e) => this.onClickUpload(e)}>Upload</Button>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridStartTime">
                          <Form.Label>Start time</Form.Label>
                          <Form.Control type="datetime-local" name="start_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEndTime">
                          <Form.Label>End time</Form.Label>
                          <Form.Control type="datetime-local" name="end_datetime" onChange={(e) => this.onTextChangeHandler(e)}/>
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" onClick={(e) => this.filterDate()}>Filter</Button>
                </Form>

                <XYPlot xType="time" width={700} height={400}>
                  <HorizontalGridLines />
                  <VerticalGridLines />
                  <XAxis title="X Axis" />
                  <YAxis title="Y Axis" />
                  <LineSeries
                    data={temp_data}
                  />
               </XYPlot>
            </Container>




        </>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
