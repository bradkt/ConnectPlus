import React, { Component } from "react";
import { Container, Header, Content, Text, ListItem, Card, CardItem, List, Title } from 'native-base';
import moment from "moment";
import Map from "../../components/Location/Map";

class PlacesSreen extends Component {

  toLocalTime = (ISOtime) => {
    let formatted = moment(ISOtime).format("dddd, MMMM D YYYY, h:mm a");
    return formatted;
  }

  createCard = (scan, id) => {
    return (
      <Card key={id}>
        <CardItem bordered>
          <List>
            <Map location={scan.location}></Map>
            <ListItem><Text>Location: {scan.location.latitude.toString() + " : " 
            + scan.location.longitude.toString()}</Text></ListItem>

            <ListItem><Text>Time: {this.toLocalTime(scan.ISOtime)}</Text></ListItem>
            <ListItem><Text>Distance: {scan.rssi < -71 ? "Near" : "Far"}</Text></ListItem>
          </List>
        </CardItem>
      </Card>
    )
    
  }

  createCards = (data) => {
    let cards = [];
    for ( let scan in data.scans ) {
      cards.push(this.createCard(data.scans[scan], scan));
    }
    return cards;
  }

  render() {
    const { navigation } = this.props;
    const scans = navigation.getParam('data', null);
    const id = navigation.getParam('id', null);

    return (
    <Container>
      <Header>
          <Title>{id.toString()} Device Details</Title>
      </Header>
      <Content padder>
      {this.createCards(scans)}
      </Content>
    </Container>
    )
  };

}

export default PlacesSreen;
