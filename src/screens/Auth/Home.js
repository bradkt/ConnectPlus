import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, FlatList, ListItem, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn, getDevices } from "../../store/actions";
import DeviceInfo from 'react-native-device-info';
import _ from "lodash/array";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    data: [],
    mostRecentlyUpdated: { id: "", name: "" },
    myMacAddy:"",
  };

  componentDidMount = async () => {
    DeviceInfo.getMACAddress().then(mac => {
      this.setState({ myMacAddy: mac })
    });

    
  }

  trasformData =(data) => {
    let tsdata = Object.values(data[1]);
    return tsdata;
  }


  getDevices = () => {
    let _this = this;
    console.log("getting devices:::::::::")
    this.props.getDevices(this.state.myMacAddy);



    // setTimeout(() => {
    //   console.log("_this.props.devices")
    //   console.log(_this.props.devices)
    // }, 1000)

    // this return val = to state data obj
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
      if (this.state.data[i].id === this.state.mostRecentlyUpdated.id){
        this.state.data[i].name = this.state.mostRecentlyUpdated.name;
        this.state.data[i].isAssignedName = true;
        break;
      }
    }
    console.log(this.state.data)
  }

  updateDevice = (id, updatedDeviceObj) => {

  }

  // when init marked as blocked fadeout or do something to give feedback
  blockDevice = (id) => {
     for (var i = 0; i < this.state.data.length; i++) { 
      if (this.state.data[i].id === id){
        this.state.data[i].isBlocked = true;
        this.setIgnoredDevices([this.state.data[i]])
        break;
      }
    }
    console.log(this.state);
  }

  getTime = (timeStamp) => {
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

  deviceDataEl = (data) => {

    let cards = [];
    for ( let el in data ) {
     // console.log("------------------------")
     // console.log(el);
     // console.log(data[el]);

     // Need to push the cards here and loop in the card for more detailed data
      
      for ( let time in data[el] ) {
        // console.log("------------------------")
        // console.log(time);
        // console.log(data[el][time].isBlocked);
        console.log(this.getTime(data[el][time]).date);
        cards.push(
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
                    { data[el][time].name? <Text>{data[el][time].name}</Text> : (
                      <Item regular>
                        <Input placeholder="No Name" onChangeText={(e) => this.assignNameHandler(e, el)}/>
                      </Item>
                    ) }
                  </Col>
                  <Col>{ data[el][time].name? <Text>{data[el][time].name}</Text> : (
                    <Button onPress={this.assignName}>
                      <Text>Assign</Text>
                    </Button>
                  ) }
                  </Col>
                </Grid>
                <Grid>
                  <Col>
                    <Text> This will work eventually! </Text>
                   
                  </Col>
                  <Col>
                    <Text> { "Nothing here" }</Text>
                  
                  </Col>
                </Grid>
              </Body>
            </CardItem>
            <CardItem footer bordered>
              <Text>Distance: {data[el][time].rssi < -77 ? "Near" : "Far"}</Text>
            </CardItem>
          </Card>
        )
      }
    }
    return cards;   
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.getDevices}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Discovered Devices</Title>
          </Body>
        </Header>
        <Content padder>
          { this.deviceDataEl(this.props.devices[1]) }
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
    updateDevices: (uuid, scan, location) => dispatch(updateDevices(uuid, scan, location)),
    getDevices: (uuid) => dispatch(getDevices(uuid)),
    // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
