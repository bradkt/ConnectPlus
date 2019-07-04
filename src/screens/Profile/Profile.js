import React, { Component } from "react";
import { StyleSheet, FlatList, Text } from 'react-native';
import { Button, Container, Header, Title, Content, Input, Item } from 'native-base';
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';

class ProfileSreen extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        profile: {},
        profileLoaded: false,
        username: "",
        password:"",
        isloggedIn: false
      }
    }

    componentDidMount = () => {
      DeviceInfo.getMACAddress().then(mac => {
        this.setState({ uuid: mac });
        this.props.getUserProfile(mac);
        this.props.getUserSettings(mac);
      });
    }

    userNameHandler = (e) => {
      console.log(e);
      this.setState({ username: e });
      // this.setState((prevState, props) => ({
      //   counter: prevState.counter + props.increment
      // }));
      
    }

    passwordHandler = (e) => {
      console.log(e);
      this.setState({ password: e });
    }

    handleLogin = () => {
      if (this.state.username !== "" && this.state.password !== "") {
        this.setState({ isloggedIn: true });
      }
    }

    render() {
        return (
          <Container>
            <Header>
                <Title>{this.state.isloggedIn ? "Welcome" : "Please Log In" }</Title>
            </Header>
           
              {!this.state.isloggedIn ? (
                 <Content padder>
                    <Text>This will be a welcome / login screen</Text>
                    <Item regular>
                      <Input placeholder="User Name" onChangeText={(e) => this.userNameHandler(e)}/>
                    </Item>
                    <Item regular>
                      <Input placeholder="Password" type="password" onChangeText={(e) => this.passwordHandler(e)}/>
                    </Item>
                    <Button style={styles.loginBtn} onPress={() => {
                        this.handleLogin()
                      }}>
                        <Text>Login In</Text>    
                    </Button>
                </Content>
              ) : (
                <Content padder>
                  <Text>Your Profile here</Text>
                </Content>
              )}
          </Container>
        );
      }

}
const styles = StyleSheet.create({
    loginBtn: {
      color: "white",
      width: 200
    }
  });
  
const mapStateToProps = state => {
  return {
  //   profile: state.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserProfile: (uuid) => dispatch(getUserProfile(uuid)),
    getUserSettings: (uuid) => dispatch(getUserSettings(uuid)),
  // onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
  // onAutoSignIn: () => dispatch(authAutoSignIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSreen);
  