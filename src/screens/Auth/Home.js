import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item, List, ListItem, Label} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, getDevices, setDeviceName, ignoreDevice } from "../../store/actions";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import _ from "lodash/array";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    mostRecentlyUpdated: {},
    uuid:"",
  };

  componentDidMount = () => {
    DeviceInfo.getMACAddress().then(mac => {
      this.props.getDevices(mac);
      this.setState({ uuid: mac })
    });

  }

  assignNameHandler = (text, id) => {
    this.setState({ mostRecentlyUpdated: { value: text, id: id } } );
  }

  assignName = () => {
    this.props.setDeviceName(this.state.uuid, this.state.mostRecentlyUpdated.id, this.state.mostRecentlyUpdated.value)
  }

  // when init marked as blocked fadeout or do something to give feedback
  ignoreDevice = (id) => {
    // call to action to ignore in DB
    console.log("ignore device", id)
    this.props.ignoreDevice(this.state.uuid, id);

    this.setLocalStore("ignoredDevices", [...this.props.ignoredDevices, id]);
   
  }

  toLocalTime = (ISOtime) => {
    let formatted = moment(ISOtime).format("dddd, MMMM D YYYY, h:mm a");
    return formatted;
  }
  
  setLocalStore = async (item, data) => {
    try {
      await AsyncStorage.setItem(item, JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data", error);
    }
    console.log("local data: ", this.props.ignoredDevices)
  }

  getDeviceDetails = (scans) => {
    console.log("setting device details");
    return (
        Object.values(scans).map((el, i) => {
          return (
            <CardItem bordered key={i}>
              <List>
                <ListItem><Text>Time: {this.toLocalTime(el.ISOtime)}</Text></ListItem>
                <ListItem><Text>Location: {el.location.latitude.toString() + " : " 
                + el.location.longitude.toString()}</Text></ListItem>
                {/* <ListItem><Text>Distance: {el.rssi > -71 ? "Near" : "Far"}</Text></ListItem> */}
                
              </List>
            </CardItem>
          );
        })
    )
  }

  createLocationItems = (locations, id) => {
    
    let scans;
    for ( let location in locations ) {
      console.log(locations[location]);
      scans = Object.values(locations[location].scans).map((scan, j) => {
        let deviceName = scan.name || scan.assignedName || "No Name";
        //let showDetails = false;
        return (
          <>
            <CardItem bordered>
            <Body>
              <Grid>
                <Col>
                  { deviceName !== "No Name" ? <Text>{deviceName}</Text> : (
                    <Item regular>
                      <Input placeholder="No Name" onChangeText={(e) => this.assignNameHandler(e, id)}/>
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
              <Text>Unique Encounters: {Object.values(locations[location]).length}</Text>
          </CardItem>
          <CardItem footer bordered>
                <Button onPress={() => {
                  // showDetails = !showDetails;
                  // this.props.navigation.navigate('Places', { data: locations[location].scans, id: id });
                  this.props.navigation.navigate('Places', { data: locations, id: id });
                }}>
                  <Text>View Details</Text>    
                </Button>
          </CardItem>
          </>
        );
      })
    }
    return scans;
  }

  getScan = (locations) => {
    let scans;
    for ( let location in locations ) {
      scans = Object.values(locations[location][1].scans);
    }
    return scans;
  }



  createCard = (data, id) => {
    let locations = Object.entries(data.locations);
    let scans = this.getScan(locations);
    let deviceName = scans[0].name || data.assignedName || "No Name";

    return (
          <Card key={id}>
            <CardItem header bordered>
            <Grid>
              <Col><Text>{id}</Text></Col>
              <Col>
                <Button onPress={() => this.ignoreDevice(id)}>
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
                      <Input placeholder="No Name" onChangeText={(e) => this.assignNameHandler(e, id)}/>
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
              <Text>Total Encounters: {scans.length}</Text>
          </CardItem>
          <CardItem footer bordered>
                <Button onPress={() => {
                  //showDetails = !showDetails;
                  // this.props.navigation.navigate('Places', { data: locations[location].scans, id: id });
                  this.props.navigation.navigate('Places', { data: locations, id: id });
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
      // let locations = Object.keys(devices[el].locations).length;
      // if (locations > 1 ) {
        cards.push(this.createCard(devices[el], el));
      // }
    }
    return cards;
  }

  render() {
    //let devices = this.props.devices[this.state.uuid];
    return (
      !this.props.isLoading ? (
      <Container>
        <Header>
            <Title>Discovered Non Unique Devices</Title>
        </Header>
        <Content padder>
          {this.createCards(this.props.devices).map(el => el)}
        </Content>
      </Container>
      ) : <Text>Loading...</Text>
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
    ignoredDevices: state.devices.ignoredDevices
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDevices: (uuid) => dispatch(getDevices(uuid)),
    ignoreDevice: (uuid, deviceId) => ignoreDevice(uuid, deviceId),
    setDeviceName: (uuid, deviceId, name) => setDeviceName(uuid, deviceId, name),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);