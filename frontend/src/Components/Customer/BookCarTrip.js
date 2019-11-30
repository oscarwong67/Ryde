import React from 'react';
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import { Grid, Icon, Label, Button } from 'semantic-ui-react'
import "../../Styles/BookCarTrip.css"

//  thanks uber https://uber.github.io/react-map-gl/#/Examples/dynamic-styling

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
    //  submit car trip request to backend
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
  render = () => (
    <Grid className="book-car-trip" padded="vertically" relaxed stretched centered container verticalAlign="middle">
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken="pk.eyJ1Ijoib3NjYXJ3b25nNjciLCJhIjoiY2l2b211cW1mMDFoZjJ5cDUyZ24zNHluYiJ9.gMJv27QqmwIhA8eacn5Qtg"
        mapStyle="mapbox://styles/mapbox/streets-v10"
        children={this.props.children}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <Marker className="user-location-marker" latitude={this.state.latitude} longitude={this.state.longitude} offsetLeft={-20} offsetTop={-10}>
          <Label className="user-location-marker-label" pointing='below' color='red'>You are Here!</Label>
          <Icon className="user-location-marker-icon" name="map marker" aria-label="You are Here!" color='green' size='big' />
        </Marker>
        {
          this.state.destinationSelected ?
            <Marker className="user-location-marker" 
              latitude={this.state.destLatitude} 
              longitude={this.state.destLongitude} 
              offsetLeft={-20} 
              offsetTop={-10}
              draggable
              onDragEnd={this.handleDragEnd}
            >
              <Label className="user-location-marker-label" pointing='below'>This is where you're going!</Label>
              <Icon className="user-location-marker-icon" name="map marker" aria-label="You are Here!" color='red' size='big' />
            </Marker>
            : null
        }
      </ReactMapGL>
      <Button onClick={this.handleDestinationSelect}>
        Select a Destination
      </Button>
      <Button onClick={this.submitCarTripRequest}>
        Book your Ryde!
      </Button>
    </Grid>
  );
}

export default BookCarTrip;