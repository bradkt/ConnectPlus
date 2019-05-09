import React, { Component } from "react";
import { StyleSheet, FlatList, Text } from 'react-native';
import { Button, Container, Header, Title, Content } from 'native-base';
import { connect } from "react-redux";
import AccelerometerSensor from "../../components/InternalDevice/Accelerometer";
import { getSpeed, isNewLocation } from "../../services/Location/Coordinates";
import setLocationHandler from "../../services/Location/Coordinates";

class ProfileSreen extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        user: "",
        profileLoaded: false,
        speed: 0,
        isNewLocation: false, 
        prevCoords: {}
      }
    }

    componentDidMount = () => {
      setLocationHandler().then(coords => {
        this.setState({prevCoords: coords});
      });
    }

    componentWillUnmount = () => {
      navigator.geolocation.stopObserving();
    }

    checkSpeed = () => {
      getSpeed().then(spd => {
        console.log("profile spd: ", spd);
        this.setState({speed: spd});
      });
    }
    
    checkUpdatedLocation = () => {
      setLocationHandler().then(coords => {
        let val = isNewLocation(this.state.prevCoords, coords);
        this.setState({isNewLocation: val});
        this.setState({prevCoords: coords});
      });
    }

    render() {
        return (
          <Container>
            <Header>
                <Title>Accelerometer </Title>
            </Header>
            <Content padder>
              <AccelerometerSensor/>
              <Button onPress={this.checkSpeed}>
                  <Text>Get Speed</Text>
              </Button>
              <Text>{this.state.speed.toString()}</Text>
              <Button onPress={this.checkUpdatedLocation}>
                  <Text>Is new Location</Text>
              </Button>
              <Text>{this.state.isNewLocation.toString()}</Text>
            </Content>
          </Container>
        );
      }

}
const styles = StyleSheet.create({
    searchButtonText: {
      color: "orange",
    }
  });
  
  const mapStateToProps = state => {
    return {
    //   profile: state.profile
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
    //   localname: () => dispatch(callaction())

    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProfileSreen);
  