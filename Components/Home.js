import React , { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Home extends Component {
    
    render() {

        return (
    
            <View style = { styles.container }>
                
                <Text>Home.js</Text>
          
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
});