import React, { Component } from "react";
import { Container, Header, Content, Button, Text, ListItem } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import { connect } from "react-redux";
// import PickLocation from "../../components/Location/LocationWithMap";
import Map from "../../components/Location/Map";

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


createCards = (data) => {
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
    const { navigation } = this.props;
    const deviceData = navigation.getParam('data', null);
    const deviceid = navigation.getParam('id', null);
    console.log("device: ", deviceid, " :::: ", deviceData);
    return (
      <>
        <Text>Places Screen</Text>
        <PickLocation onLocationPick={this.locationPickedHandler} />
        <Text>Locations: </Text>
        <Content>

        <FlatList
          data={deviceData}
          renderItem={({item}) => this.createCards(item)}
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
    places: state.location.location
  };
};

const mapDispatchToProps = dispatch => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesSreen);
