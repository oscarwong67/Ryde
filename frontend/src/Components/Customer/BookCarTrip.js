import React from 'react';
import ReactMapGL, { Marker } from "react-map-gl";
import { Grid, Icon, Label, Button, Form, GridColumn, Divider, Header } from 'semantic-ui-react'
import "../../Styles/MapStyle.css"
import history from '../../history';
const axios = require('axios');

//  thanks uber https://uber.github.io/react-map-gl/#/Examples/dynamic-styling
//  TODO: add button to add other users to the trip so you can split fare
const defaultWidth = '80vw';
const defaultHeight = '60vh';
const defaultZoom = 12;

class BookCarTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: defaultWidth,
        height: defaultHeight,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: defaultZoom
      },
      otherUser: '',
      latitude: 51.0776,
      longitude: -114.1407,
      destinationSelected: false,
      destLatitude: 51.0776,
      destLongitude: -113.95
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.updatePosition)
    }
  }
  submitCarTripRequest = () => {
    if (this.state.destinationSelected) {
      //  submit car trip request to backend
      axios.post('http://localhost:5000/api/bookCarTrip', {
        startLatitude: this.state.latitude,
        startLongitude: this.state.longitude,
        destLatitude: this.state.destLatitude,
        destLongitude: this.state.destLongitude,
        userId: localStorage.getItem('accountId'),
        otherUser: this.state.otherUser
      }).then((response) => {
        console.log(response.data);
        //  handle case of status = 'success'
        if (response.data.success) {
          alert('Successfully booked trip. Redirecting you to your dashboard.');
          history.push('/');
        } else {
          alert(response.data.message);
        }
      }).catch((error) => {
        console.error(error);
        alert('Failed to book trip. No available drivers. Please try again later.');
      });
    }
  }
  handleTextInputChange = (event) => {
    this.setState({
      otherUser: event.target.value
    })
  }
  handleUpdatePositionDefaultDestLongitude = (position) => {
    let destLongitude = this.state.destLongitude;
    if (!this.state.destinationSelected) {
      destLongitude = position.coords.longitude + 0.02;
    }
    return destLongitude;
  }
  updatePosition = (position) => {
    const viewport = this.state.viewport;
    viewport.latitude = position.coords.latitude;
    viewport.longitude = position.coords.longitude;

    let destLongitude = this.handleUpdatePositionDefaultDestLongitude(position);

    this.setState({
      viewport,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      destLongitude
    })
  }
  handleViewportChange = (viewport) => {
    viewport.width = defaultWidth;
    viewport.height = defaultHeight;
    viewport.zoom = defaultZoom;
    this.setState({
      viewport
    })
  }
  handleDestinationSelect = () => {
    this.setState({
      destinationSelected: true
    })
  }
  handleDragEnd = (event) => {
    const destLongitude = event.lngLat[0];
    const destLatitude = event.lngLat[1];
    this.setState({
      destLatitude,
      destLongitude
    })
  }
  backToDashboard = () => {
    history.push('/')
  }
  render = () => (
    <div>
      <Button
        content = 'Back to Dashboard'
        icon = 'arrow left'
        onClick = {this.backToDashboard}
      />
      <h6>   </h6>
      <Header as = 'h2'>CAR RYDE</Header>
      <Grid className="book-car-trip" padded="vertically" relaxed stretched centered container verticalAlign="middle">
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
          mapStyle="mapbox://styles/mapbox/streets-v10"
          children={this.props.children}
        >
          <Marker className="location-marker" latitude={this.state.latitude} longitude={this.state.longitude} offsetLeft={-20} offsetTop={-10}>
            <Label className="location-marker-label" pointing='below' color='red'>You are Here!</Label>
            <Icon className="location-marker-icon" name="map marker" aria-label="You are Here!" color='green' size='big' />
          </Marker>
          {
            this.state.destinationSelected ?
              <Marker className="location-marker"
                latitude={this.state.destLatitude}
                longitude={this.state.destLongitude}
                offsetLeft={-20}
                offsetTop={-10}
                draggable
                onDragEnd={this.handleDragEnd}
              >
                <Label className="location-marker-label" pointing='below'>This is where you're going!</Label>
                <Icon className="location-marker-icon" name="map marker" aria-label="You are Here!" color='red' size='big' />
              </Marker>
              : null
          }
        </ReactMapGL>
      </Grid>
      <Grid columns = {7}>
        <Grid.Column></Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <h6>   </h6>
          <Button onClick={this.handleDestinationSelect}>
            Select a Destination
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Form>
            <Form.Field>
              <label>Split the Fare:</label>
              <input fluid placeholder="Other Ryder's Email" onChange={this.handleTextInputChange} />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column>
          <h6>   </h6>
          <Button onClick={this.submitCarTripRequest}>
            Book your Ryde!
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default BookCarTrip;