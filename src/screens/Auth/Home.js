import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item, List, ListItem} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, getDevices, setDeviceName, blockDevice } from "../../store/actions";
import DeviceInfo from 'react-native-device-info';
import {result} from "../../assets/FBDLallDevices";
import moment from "moment";
import _ from "lodash/array";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    mostRecentlyUpdated: {},
    uuid:"",
    ignoredDevices: [],
  };

  componentDidMount = () => {
    DeviceInfo.getMACAddress().then(mac => {
      this.setState({ uuid: mac })
    });
    this.local_LoadData();
    this.getDevices();
    
  }

  getDevices = () => {
    this.props.getDevices(this.state.uuid);
    // this return val = to state data obj
  }

  assignNameHandler = (text, id) => {
    this.setState({ mostRecentlyUpdated: { value: text, id: id } } );
  }

  assignName = () => {
    this.props.setDeviceName(this.state.uuid, this.state.mostRecentlyUpdated.id, this.state.mostRecentlyUpdated.value)
  }

  updateDevice = (id, updatedDeviceObj) => {
    
  }

  // when init marked as blocked fadeout or do something to give feedback
  blockDevice = (id) => {
    this.props.blockDevice(this.state.uuid, id);
    this.setState((prevState, props) => ({
      ignoredDevices: [...prevState.ignoredDevices, id]
    }), this.local_BlockDevice());
   
  }

  toLocalTime = (ISOtime) => {
    let formatted = moment(ISOtime).format("dddd, MMMM D YYYY, h:mm a");
    return formatted;
  }
  
  local_BlockDevice = () => {
    try {
      console.log("trying");
      AsyncStorage.setItem("ignoredDevices", JSON.stringify(this.state.ignoredDevices));
    } catch (error) {
      console.log("Error saving data", error);
    }
    console.log("ignoredDevices: ", this.state.ignoredDevices)
  }
  
  // do this on app load add move to redux
  local_LoadData = async () => {
    try {
      const ignored = await AsyncStorage.getItem('ignoredDevices');
      let parsed = JSON.parse(ignored);
      if (parsed !== null) {
        console.log("We have data: ", parsed);
        this.setState({ignoredDevices: parsed})
      } else {
        console.log("data was null");
      }
    } catch (error) {
      console.log("Error saving data", error);
    }
  }

  getTime = (timeStamp) => {
    // update to isoblablaa asap
    var date = new Date( timeStamp * 1000 );
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return {
      date,
      hours,
      minutes,
      seconds,
      formattedTime
    }
  }

  getDeviceDetails = (scans) => {
    console.log("setting device details")
    return (
        Object.values(scans).map((el, i) => {
          return (
            <CardItem bordered key={i}>
              <List>
                <ListItem><Text>Time: {this.toLocalTime(el.ISOtime)}</Text></ListItem>
                <ListItem><Text>Location: {el.location.latitude.toString() + " : " 
                + el.location.longitude.toString()}</Text></ListItem>
                <ListItem><Text>Distance: {el.rssi < -71 ? "Near" : "Far"}</Text></ListItem>
              </List>
            </CardItem>
          );
        })
    )
  }

  createCard = (data, el) => {
    let deviceName = data.name || data.assignedName || "No Name";
    let showDetails = false;
    // console.log(el)
    return (
          <Card key={el}>
            <CardItem header bordered>
            <Grid>
              <Col><Text>{el}</Text></Col>
              <Col>
                <Button onPress={() => this.blockDevice(el)}>
                  <Text>Ignore</Text>
                </Button>
              </Col>
            </Grid>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Grid>
                  <Col>
                    { deviceName !== "No Name" ? <Text>{deviceName}</Text> : (
                      <Item regular>
                        <Input placeholder="No Name" onChangeText={(e) => this.assignNameHandler(e, el)}/>
                      </Item>
                    ) }
                  </Col>
                  <Col>{ deviceName !== "No Name" ? null : (
                    <Button onPress={this.assignName}>
                      <Text>Assign</Text>
                    </Button>
                  ) }
                  </Col>
                </Grid>
              </Body>
            </CardItem>
            <CardItem bordered>
                <Text>Total Encounters: {Object.values(data.scans).length}</Text>
            </CardItem>
            
            <CardItem footer bordered>
                <Button onPress={() => {
                  showDetails = !showDetails;
                  this.props.navigation.navigate('Places', { data: data, id: el })
                  // can I send the device data via navigator? if not use redux
                  
                  console.log(showDetails);
                }}>
                  <Text>View Details</Text>    
                </Button>
            </CardItem>
          </Card>
      )
  };

  createCards = (devices) => {
    let cards = [];
    for ( let el in devices ) {
      
      if (Object.keys(devices[el].scans).length > 3 ) {
        cards.push(this.createCard(devices[el], el));
      }
    }
    return cards;
  }

  render() {
    let devices = this.props.devices[this.state.uuid];
    return (
      <Container>
        <Header>
          
            <Title>Discovered Non Unique Devices</Title>
          
        </Header>
        <Content padder>
          { !this.props.isLoading ? this.createCards(devices).map(el => el) : null }
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
    devices: state.devices.dbDevices,
    location: state.location.location,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDevices: (uuid) => dispatch(getDevices(uuid)),
    blockDevice: (uuid, deviceId) => blockDevice(uuid, deviceId),
    setDeviceName: (uuid, deviceId, name) => setDeviceName(uuid, deviceId, name),
    setDeviceDetails: (device) => setDeviceDetails(devices)
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);