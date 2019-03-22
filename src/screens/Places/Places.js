import React, { Component } from "react";
import { Container, Header, Content, Button, Text, ListItem } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import { connect } from "react-redux";
import PickLocation from "../../components/Location/LocationWithMap";
import { getPlaces } from "../../store/actions/index";

class PlacesSreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      place: "",
      placesLoaded: false,
      location: []
    }
  }

 locationPickedHandler = data => {
  console.log(data);
  let location = {
    location: {latitude: data.latitude, longitude: data.longitude},
    valid: true,
    key: Math.random().toString()
  }
  
  this.setState(prevState => ({
    location: [...prevState.location, location]
  }))

};


locationDataEl = (data) => {
  console.log(data);
  return (
    <>
      <ListItem>
        <Text>latitude: {data.location.latitude}</Text>
      </ListItem>
      <ListItem>
        <Text>longitude: {data.location.longitude}</Text>
      </ListItem>
    </>
  );
}

  render() {
    return (
      <>
        <Text>Places Screen</Text>
        <PickLocation onLocationPick={this.locationPickedHandler} />
        <Text>Locations: </Text>
        <Content>

        <FlatList
          data={this.state.location}
          renderItem={({item}) => this.locationDataEl(item)}
        />
        </Content>
      </>
    );
  }
}

const styles = StyleSheet.create({
  searchButtonText: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 26
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadPlaces: () => dispatch(getPlaces())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesSreen);
