import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import SortedDeck from '../CardList';

// Styles
import styles from '../../Styles/GameListStyles';

export default class EgyptionRatScrew extends Component {

    state = {

        back: '🂠',
        deck: SortedDeck,
        shuffled: []

    }

    deck = () => {
        return this.state.shuffled.map( (x) => {
            return (
                <Text key = {x.icon} style = {styles.card}>{x.icon}</Text>
            )
        })
    }

    shuffleDeck = () => {

        for ( var x = 0; x < this.deck.length; x++ ) {

            this.state.shuffled.push( 'card' )

        }

        alert( this.state.shuffled )

    }
    
    render() {

        return (
    
            <ScrollView>

                <View style = { styles.container }>

                    { this.state.shuffled === [] ? ( <Text>{ this.shuffleDeck() }</Text> ) : ( <Text>{ this.deck() }</Text> ) }

                </View>
          
            </ScrollView>
        );

    }
};