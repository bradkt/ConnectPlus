import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions
} from "react-native";
import MapView from "react-native-maps";

class Map extends Component {

  render() {
    let location = {
          latitude: this.props.location.latitude,
          longitude: this.props.location.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta:
            Dimensions.get("window").width /
            Dimensions.get("window").height *
            0.0122
    };
    let marker = <MapView.Marker coordinate={location} />;
    
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={location}
          region={location}
          style={styles.map}
          ref={ref => this.map = ref}
        >
          {marker}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center"
  },
  map: {
    width: "100%",
    height: 250
  },
  button: {
    margin: 8
  }
});

export default Map;
