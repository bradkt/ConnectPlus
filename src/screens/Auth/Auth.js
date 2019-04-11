import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, FlatList, ListItem, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, updateDevices } from "../../store/actions";
import BLEservice from "../../services/BlueTooth/Bluetooth";
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import location, {isNewLocation} from "../../services/Location/Coordinates";
import { doesExsistInArray } from "../../utility";
import { exampleLocationDevices } from "../../assets/deviceObjExample";
import _ from "lodash/array";

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEservice();
    this.loadData = this.loadData.bind(this);
    this.beginProcess = this.beginProcess.bind(this);
  }

  state = {
    locationBaseScan: [],
    currentScan: [],
    ignoredDevices: [],
    isNewLocation: false,
    myMacAddy:"",
    prevLocation: {latitude: 40.113348, longitude: -82.9966365},
    mostRecentlyUpdated: { id: "", name: "" }
  };

  componentDidMount = () => {
    let _this = this;
    
    DeviceInfo.getMACAddress().then(mac => {
      _this.setState({ myMacAddy: mac })
    });

    this.setState({ currentScan: exampleLocationDevices})
  }

  async loadData() {

    location().then(coords => {
      this.LocationHandler(this.state.prevLocation, coords );
    })
    .catch( err => console.log(err));
    
    let scan = await this.ble.getCurrentBLEDevices();

    this.setState({ currentScan: scan });
  }

  async beginProcess() {
    
    await this.loadData();
    console.log("I awaited load data ;)");
    
    if(this.state.isNewLocation){
      this.setState({ locationBaseScan: [] });
      console.log("new location reseting locationBaseScan");
    }
    // filter devices and updatedb
    let removeThese = [...this.state.locationBaseScan, ...this.state.ignoredDevices];
    let uniqueDevices = this.filterDevices(this.state.currentScan, removeThese);

    // updateDevices(this.state.myMacAddy, uniqueDevices, this.state.prevLocation);

    if(!this.state.isNewLocation){
      this.setState({ locationBaseScan: [...this.state.locationBaseScan, ...uniqueDevices] });
      console.log("not new location adding current to locationBaseScan");
    }
  }

  assignNameHandler = (text, id) => {
    
    if (this.state.mostRecentlyUpdated.id === id || this.state.mostRecentlyUpdated.id === "") {
      this.setState({ mostRecentlyUpdated: { id: id, name: text } })
    } else {
      this.setState({ mostRecentlyUpdated: { id: "" } })
    }
  }

  assignName = () => {
    for (var i = 0; i < this.state.currentScan.length; i++) { 
      if (this.state.currentScan[i].id === this.state.mostRecentlyUpdated.id){
        this.state.currentScan[i].name = this.state.mostRecentlyUpdated.name;
        this.state.currentScan[i].isAssignedName = true;
        break;
      }
    }
    console.log(this.state.currentScan)
  }

  getDeviceByID = () => {

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

  // when init marked as blocked fadeout or do something to give feedback
  blockDevice = (id) => {
     for (var i = 0; i < this.state.currentScan.length; i++) { 
      if (this.state.currentScan[i].id === id){
        this.state.currentScan[i].isBlocked = true;

        this.setState(prevState => ({
          ignoredDevices: [...prevState.ignoredDevices, ...this.state.currentScan[i]]
        }))

        break;
      }
    }
  }



  deviceDataEl = (data) => {
    return (
          <Card key={data.id}>
            <CardItem header bordered>
            <Grid>
              <Col><Text>{data.id}</Text></Col>
              <Col>
                <Button onPress={() => this.blockDevice(data.id)}>
                  <Text>Ignore</Text>
                </Button>
              </Col>
            </Grid>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Grid>
                  <Col>
                    { data.name? <Text>{data.name}</Text> : (
                      <Item regular>
                        <Input placeholder="No Name" onChangeText={(e) => this.assignNameHandler(e, data.id)}/>
                      </Item>
                    ) }
                  </Col>
                  <Col>{ data.name? <Text>{data.name}</Text> : (
                    <Button onPress={this.assignName}>
                      <Text>Assign</Text>
                    </Button>
                  ) }
                  </Col>
                </Grid>
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>Distance: {data.rssi < -77 ? "Near" : "Far"}</Text>
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
            console.log(el.id);
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
