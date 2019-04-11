import React, { Component } from "react";
import { StyleSheet, FlatList, Text } from 'react-native';
import { connect } from "react-redux";
import AccelerometerSensor from "../../components/InternalDevice/Accelerometer";

class ProfileSreen extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        user: "",
        profileLoaded: false,
      }
    }


    render() {
        return (
          <>
          <Text>Accelerometer</Text>
          <AccelerometerSensor/>
          </>
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
  