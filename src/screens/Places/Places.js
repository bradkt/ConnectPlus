import React, { Component } from "react";
import { Container, Header, Content, Text, ListItem, Card, CardItem, List, Title, Label, Input, Button, Grid, Col } from 'native-base';
import { Slider, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { setKnownLocation } from "../../store/actions";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import Map from "../../components/Location/Map";

class PlacesSreen extends Component {

  state = {
    locationName: "",
    uuid: ""
  }

  componentDidMount = () => {
    DeviceInfo.getMACAddress().then(mac => {
      this.setState({ uuid: mac })
    });
  }

  toLocalTime = (ISOtime) => {
    let formatted = moment(ISOtime).format("dddd, MMMM D YYYY, h:mm a");
    return formatted;
  }

  updateKnownLocation = (location) => {
    if (this.state.locationName === "") {
      return;
    }

    let data = {
      name: this.state.locationName.toLowerCase(),
      coords: location,
    }
    setKnownLocation(this.state.uuid, data);
  }

  handleLocationName = (e) => {
    this.setState({ locationName: e });
  }

  createCard = (locations) => {
    let cards = [];
    for ( let loc in locations ) {
      let location = Object.values(locations[loc][1].scans)[0].location;
      let map = <Map location={location}></Map>;
      let displayLocation = location.latitude.toString() + " : " + location.longitude.toString();
  
      return (
        <Card key={locations[loc][1]}>
        <CardItem bordered>
          <List>
            {map}
            <ListItem><Text>Location: {displayLocation}</Text></ListItem>
            <ListItem>
              <Grid>
                <Col>
                  <Input placeholder="No Name" onChangeText={(e) => this.handleLocationName(e)}/>
                </Col>
                <Col>
                  <Button onPress={() => this.updateKnownLocation(location)}><Text>Assign</Text></Button>
                </Col>
              </Grid>
            </ListItem>
          { Object.values(locations[loc][1].scans).map((scan, i) => {
              return (
                <ListItem key={"a-"+i}><Text>Time: {this.toLocalTime(scan.ISOtime)}</Text></ListItem>
              )
            })
          }
          {/* -26 = few inches & -100 40 to 50 meters */}
          { Object.values(locations[loc][1].scans).map((scan, i) => {
              return (
                <ListItem key={"b-"+i}>
                <Text>Far</Text>
                <Slider
                  style={styles.slider}
                  step={1}
                  minimumValue={-100}
                  maximumValue={-26}
                  value={scan.rssi}
                  disabled
                />
                <Text>Near</Text>
              </ListItem>
              )
            })
          }
          </List>
        </CardItem>
      </Card>
      );
    }
    return cards;
  }

  render() {
    const { navigation } = this.props;
    const locations = navigation.getParam('data', []);
    const id = navigation.getParam('id', null);
    let idEL = id != null ? <Title>{id.toString()} Details</Title> : <Title>Please Select a Device</Title>
    console.log(locations);
    return (
    <Container>
      <Header>
          {idEL}
      </Header>
      <Content padder>
        {this.createCard(locations)}
      </Content>
    </Container>
    )
  };

}

const styles = StyleSheet.create({
  slider: {
    width: 200,
  },
});


const mapStateToProps = state => {
  return {
  //   profile: state.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setKnownLocation: (uuid, data) => dispatch(setKnownLocation(uuid, data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesSreen);