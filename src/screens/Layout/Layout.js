import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content } from 'native-base';

class Layout extends React.Component {
    render() {
      return (
          <>
            <Header />
            {this.props.children}
          </>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
    //   flex: 1
    },
  });
  
  export default Layout;