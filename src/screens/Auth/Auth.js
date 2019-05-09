import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, FlatList, ListItem, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, updateDevices } from "../../store/actions";
import BLEservice from "../../services/BlueTooth/Bluetooth";
import DeviceInfo from 'react-native-device-info';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { doesExsistInArray } from "../../utility";
import { exampleLocationDevices } from "../../assets/deviceObjExample";
import _ from "lodash/array";

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEservice();
  }

  state = {
    locationBaseScan: [],
    currentScan: [],
    ignoredDevices: [],
    isNewLocation: false,
    uuid:"",
    prevLocation: {latitude: 41.113348, longitude: -82.9966365},
    mostRecentlyUpdated: { id: "", name: "" }
  };

  componentDidMount = async () => {

    // const willBlurSubscription = this.props.navigation.addListener(
    //   'willBlur',
    //   payload => {
    //     console.debug('willBlur', payload);
    //     try {
    //       console.log("trying");
    //       await AsyncStorage.setItem("ignoredDevices", this.state.ignoredDevices);
    //     } catch (error) {
    //       console.log("Error saving data", error);
    //     }
    //   }
    // );
    // Remove the listener when you are done
    // willBlurSubscription.remove();

    DeviceInfo.getMACAddress().then(mac => {
      this.setState({ uuid: mac })
    });
  }

  localStore = async () => {
    try {
      await AsyncStorage.setItem("ignoredDevices", JSON.stringify(this.state.ignoredDevices));
    } catch (error) {
      console.log("Error saving data", error);
    }
  }

  loadLocalData = async () => {
    try {
      const ignored = await AsyncStorage.getItem('ignoredDevices');
      let parsed = JSON.parse(ignored);
      if (parsed !== null) {
        console.log("We have data: ", parsed);
        this.setState({
          ignoredDevices: parsed
        })
        
      } else {
        console.log("data was null");
      }
    } catch (error) {
      console.log("Error saving data", error);
    }
    location().then(coords => {
      this.LocationHandler(this.state.prevLocation, coords );
    })
    .catch( err => console.log(err));
    
    let scan = await this.ble.getCurrentBLEDevices();

    this.setState({ currentScan: scan });
    // this.setState({ currentScan: exampleLocationDevices });
  }

  beginProcess = async () => {
    
    await this.loadLocalData();
    
    if(this.state.isNewLocation){
      this.setState({ locationBaseScan: [] });
      console.log("new location reseting locationBaseScan");
    }

    // filter devices and updatedb
    let removeThese = [...this.state.locationBaseScan, ...this.state.ignoredDevices];
    let uniqueDevices = this.filterDevices(this.state.currentScan, removeThese);

    updateDevices(this.state.uuid, uniqueDevices, this.state.prevLocation);

    if(!this.state.isNewLocation){
      this.setState({ locationBaseScan: [...this.state.locationBaseScan, ...uniqueDevices] });
      console.log("not new location adding current to locationBaseScan");
    }
  }

  LocationHandler = (prev, curr) => {
    let isNew = isNewLocation(prev, curr);
    console.log("isNewLocation: ", isNew);
    if (isNew) {
      this.setState({ isNewLocation: true });
    } else {
      this.setState({ isNewLocation: false });
    }
    this.setState({ prevLocation: curr });
  }

  filterDevices = (currDevices, removeThese) => {
    // console.log(currDevices)
    let unique = _.differenceBy(currDevices, removeThese, 'id');
    return unique;
  }

  deviceDataEl = (data) => {
    return (
          <Card key={data.id}>
            <CardItem header bordered>
            <Grid>
              <Col><Text>{data.id}</Text></Col>
            </Grid>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Grid>
                  <Col>
                    { data.name? <Text>{data.name}</Text> :  <Text>No Name</Text> }
                  </Col>
                </Grid>
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>Distance: {data.rssi > -77 ? "Near" : "Far"}</Text>
            </CardItem>
          </Card>
      )
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.beginProcess}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Connect Plus</Title>
          </Body>
        </Header>
        <Content padder>
          {this.state.currentScan.map(el => {
            return this.deviceDataEl(el);
          })}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    devices: state.devices.devices,
    location: state.location.location,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateDevices: (uuid, scan, location) => dispatch(updateDevices(uuid, scan, location)),
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
