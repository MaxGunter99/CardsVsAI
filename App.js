import React, { Component } from 'react';
import { Text, View , AppRegistry } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';

// Components
import GameList from './Components/GameList';
import Home from './Components/Home';
import { Icon } from 'react-native-elements';

// Styles
import styles from './Styles/HomeStyles';

export default class App extends Component {

  render() {

    return (

      <NativeRouter>

        <View style = { styles.navbar }>

          {/* <Icon name="md-heart" type="ionicon" color="#887700" /> */}

          <Link to="/">
            <Text>Home</Text>
          </Link>

          <Link to="/GameList">
            <Text>GameList</Text>
          </Link>

        </View>

        <Route exact path="/" component={ Home } />
        <Route exact path="/GameList" component={ GameList } />

      </NativeRouter>

    );
  }
}