import React, { Component } from 'react';
import { Text, View, Image, Animated, StatusBar, SafeAreaView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';

// Components
import GameList from './Components/GameList';
import Home from './Components/Home';
import { Icon } from 'react-native-elements';

// Styles
import styles from './Styles/NavStyles';

export default class App extends Component {

  state = {

    // Status of nav bar
    menu: false,
    nav: true,
    navItemColor: 'black',

    // Current page for active tab status on nav
    TextSizeHome: new Animated.Value(28),
    TextSizeGames: new Animated.Value(18),

    // All animation durations
    animationDuration: 250,

    // Toggle Menu Sliding animation value
    slideAnimation: new Animated.Value(0),

    // Fade in and out menu opacity values
    fadeAnimationOne: new Animated.Value(1),
    fadeAnimationTwo: new Animated.Value(0),
  };

  // Handles the current page
  handlePageChange = ( page ) => {

    let menuAnimationDuration = 250

    if ( page === 'Games' ) {
      Animated.timing( this.state.TextSizeGames, {
        toValue: 28,
        duration: menuAnimationDuration,
      }).start();

      Animated.timing( this.state.TextSizeHome, {
        toValue: 18,
        duration: menuAnimationDuration,
      }).start();

    } else if ( page === 'Home' ) {

      Animated.timing( this.state.TextSizeGames, {
        toValue: 18,
        duration: menuAnimationDuration,
      }).start();

      Animated.timing( this.state.TextSizeHome, {
        toValue: 28,
        duration: menuAnimationDuration,
      }).start();

    }

    setTimeout( () => {
      this.toggleSlideAnimation()
    }, menuAnimationDuration );

  };



  // Toggle open and closing menu animations
  toggleSlideAnimation = () => {

    if ( this.state.menu === false ) {

      Animated.timing( this.state.slideAnimation, {
        toValue: 100,
        duration: this.state.animationDuration,
      }).start();

      this.setState({ menu: true , navItemColor: 'white' })

    } else {

      Animated.timing( this.state.slideAnimation, {
        toValue: 0,
        duration: this.state.animationDuration,
      }).start();

      setTimeout( () => {
        this.setState({ menu: false , navItemColor: 'black' })
      }, this.state.animationDuration);

    }
  };

  // Toggle the nav 
  toggleFadeAnimation = () => {

    if ( this.state.nav === true ) {

      if ( this.state.menu === true ) {
        this.toggleSlideAnimation()
      }

      Animated.timing( this.state.fadeAnimationOne, {
        toValue: 0,
        duration: this.state.animationDuration
      }).start();

      setTimeout( () => {
        this.setState({ 
          ...this.state,
          nav: false,
          statusBarColor: 'white'
        })
      }, this.state.animationDuration);

      setTimeout( () => {
        Animated.timing( this.state.fadeAnimationTwo, {
          toValue: 1,
          duration: this.state.animationDuration
        }).start();
      }, this.state.animationDuration );

    } else {

      Animated.timing( this.state.fadeAnimationTwo, {
        toValue: 0,
        duration: this.state.animationDuration
      }).start();

      setTimeout( () => {
        this.setState({ nav: true })
      }, this.state.animationDuration );

      setTimeout( () => {
        Animated.timing( this.state.fadeAnimationOne, {
          toValue: 1,
          duration: this.state.animationDuration
        }).start();
      }, this.state.animationDuration );

    }
  };

  render() {

    return (

        <NativeRouter>

          <View style = {{ backgroundColor: 'black' }}>

            <SafeAreaView>

              { this.state.nav === true ? (

                <Animated.View style = {{ opacity: this.state.fadeAnimationOne }}>

                  <StatusBar barStyle="light-content"/>

                  <View style = { styles.navBarContainer }>

                    <View style = { styles.navBarTopSection }>

                      <Image style = { styles.logo } source = {{ uri: 'https://cdn.dribbble.com/users/97383/screenshots/1926705/waiting-cards.gif' }}/>
                      <Text style = { styles.title }>Cards Vs AI</Text>
                      <Icon name="md-menu" underlayColor = {'black'} type="ionicon" color = 'white' size = { 30 } onPress = { this.toggleSlideAnimation }/>

                    </View>

                    <Animated.View style = { styles.navBar , { height: this.state.slideAnimation, flex: 0, opacity: this.state.fadeAnimation } }>

                      <Link to="/" onPress = { () => ( this.handlePageChange( 'Home' ) ) }>
                        <Animated.Text style = {{ color: this.state.navItemColor, padding: 10, fontSize: this.state.TextSizeHome, }}>Home</Animated.Text>
                      </Link>

                      <Link to="/GameList" onPress = { () => ( this.handlePageChange( 'Games' ) ) }>
                        <Animated.Text style = {{ color: this.state.navItemColor , padding: 10, fontSize: this.state.TextSizeGames, }}>Games</Animated.Text>
                      </Link>

                    </Animated.View>

                  </View>
                    
                </Animated.View>

              ) : (

                <Animated.View style = { { opacity: this.state.fadeAnimationTwo }}>

                  {/* <StatusBar barStyle="dark-content" /> */}

                  <View style = { styles.navBarContainerWhite }>

                    <View>
                      <Link to="/GameList" style = { styles.backButton } underlayColor = {'white'} onPress = { this.toggleFadeAnimation }>
                        <Icon name="ios-arrow-back" type="ionicon" color="black" size = { 30 } />
                      </Link>
                    </View>

                  </View>

                </Animated.View>

              )}

              <Route exact path="/" component={ Home } />
              <Route exact path="/GameList" component={() => ( <GameList {...this.state} toggleNavBar = { this.toggleFadeAnimation } /> ) } />

            </SafeAreaView>

          </View>

        </NativeRouter>

    );
  }
}