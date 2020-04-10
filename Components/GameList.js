import React, { Component } from 'react';
import { Text, View, ScrollView, Button } from 'react-native';

// Styles
import styles from '../Styles/GameListStyles';

export default class GameList extends Component {

    state = {

        games: [
            { 
                title: 'Egyption Rat Screw',
                players: '2+',
                rules: 'Hi \n hi line 2\n\n\n\n\n\n hi'
            },
        ]

    }

    // All of the games in state will be mapped
    mappedGames = () => {

        return this.state.games.map( x => {

            return (

                <View style = { styles.game }>

                    <View style = { styles.gameTitle }>

                        <Text style = { styles.titleItem }>{x.title}</Text> 
                        <Text style = { styles.titleItem }>{x.players}</Text>

                    </View>


                    <View style = { styles.description }>
                        <Text style = { styles.gameTitle }>{x.rules}</Text>
                    </View>

                    <Button
                        onPress = { this.props.toggleNavBar }
                        title = 'Play'
                    />

                </View>

            );

        })

    };
    
    render() {

        return (
    
            // <ScrollView>

                <View style = { styles.container }>

                    <Text style = { styles.title }>Games</Text>

                    <View>{this.mappedGames()}</View>

                </View>
          
            // </ScrollView>
        );

    }
};