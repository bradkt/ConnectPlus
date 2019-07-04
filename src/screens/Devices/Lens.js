import React, { Component } from "react";
import { Container, Header, Content, Button, Text, connectStyle, Card, CardItem, Body, Left, Right, Icon, Title, Input, Item} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { StyleSheet, FlatList, Slider, AsyncStorage } from 'react-native';
import BLEprocess from "../../services/BlueTooth/BLEProcess";

class LensScreen extends Component {
  constructor(props) {
    super(props);
    this.ble = new BLEprocess();
  }

  state = {
    devices: {},
    isLoading: true
  };

  componentDidMount = () => {

  }

  beginProcess = async () => {
    let devices = await this.ble.beginProcess(true);
    this.setState({ devices: devices });
    this.setState({ isLoading: false });
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
              <Text>Far</Text>
              <Slider
                  style={styles.slider}
                  step={1}
                  minimumValue={-100}
                  maximumValue={-26}
                  value={data.rssi}
                  disabled
                />
                <Text>Near</Text>
            </CardItem>
          </Card>
      )
  };

  render() {
    console.log(this.state.isLoading);
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.beginProcess}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>BLE Lens</Title>
          </Body>
        </Header>
        <Content padder>
          {!this.state.isLoading ? this.state.devices.map(el => {
            return this.deviceDataEl(el);
          }) : null}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  slider: {
    width: 200,
  },
});

export default LensScreen;
