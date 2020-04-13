import React, { Component } from 'react';
import { Text, View, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { Link, Redirect } from 'react-router-native';

// Styles
import styles from '../Styles/GameListStyles';

export default class GameList extends Component {

    constructor( props ) {
        super( props );
        this.state = {

            fadeAnimationOne: new Animated.Value(1),
            currentGameLink: '',
            redirect: false,
            duration: 500,
    
            games: [

                { 
                    id: 1,
                    title: 'Egyption Rat Screw',
                    gameLink: '/EgyptionRatScrew',
                    players: '2',
                    rules: [ 
    
                        {
                            id: 1,
                            topic: 'The Deal',
                            details: 'Deal cards one at a time face down, to each player until all the cards have been dealt evenly. Without looking at any of the cards, each player squares up their hand into a neat pile in front of them.',
                        },
                        {
                            id: 2,
                            topic: 'The Play',
                            details: 'Players pull the top card off their pile and place it face-up in the middle. If the card played is a number card, the next player puts down a card, too. This continues around the table until somebody puts down a face card or an Ace ( Jack, Queen, King, or Ace ). \n\nWhen a face card or an ace is played, the next person in the sequence must play another face card or an ace in order for play to continue. \n\nIf the next person in the sequence does not play a face card or an ace within their allotted chance, the person who played the last face card or an ace wins the round and the whole pile goes to them. The winner begins the next round of play. \n\nThe only thing that overrides the face card or an ace rule is the slap rule. The first person to slap the pile of cards when the slap rule is put into effect is the winner of that round. If it cannot be determined who was the first to slap the pile, the person with the most fingers on top wins.',
                        },
                        {
                            id: 3,
                            topic: 'Slap Rules',
                            details: 'Double – When two cards of equivalent value are laid down consecutively. Ex: 5, 5 \n\nSandwich – When two cards of equivalent value are laid down consecutively, but with one card of different value between them. Ex: 5, 7, 5 \n\nYou must add one or two cards to the bottom of the pile if you slap the pile when it was not slappable. \n\nContinue playing even if you have run out of cards. As long as you dont slap at the wrong time, you are still allowed to "slap in" and get cards! Everyone should try to stay in the game until you have a single winner who obtains all the cards',
                        },
                        {
                            id: 4,
                            topic: 'How To Keep Score',
                            detials: 'The player, who has all of the cards at the end of the game, wins.'
                        }
    
                    ]
                },
            ]
    
        }
    }

    // WHEN YOU PRESS PLAY
    fadeOut = link => {

        // Set state to the game you will play
        this.setState({ currentGameLink: link })

        // Fade the page out
        Animated.timing(this.state.fadeAnimationOne, {
            toValue: 0,
            duration: this.state.duration
        }).start();

        // redirect to the game
        setTimeout( () => {
            this.setState({ redirect: true })
        } , this.state.duration )

        setTimeout( () => {
            this.props.toggleNav()
        } , this.state.duration )

    }


    // All of the games in state will be mapped
    mappedGames = () => {

        return this.state.games.map( x => {

            return (

                // FULL GAME ITEM
                <View style = { styles.game } key = {x.id}>

                    {/* GAME TITLE AND PLAYER COUNT */}
                    <View style = { styles.gameTitle }>

                        <Text style = { styles.titleItem }>{x.title}</Text> 
                        <View style = {{ flex: 0, justifyContent: 'center', flexDirection: 'row', alignContent: 'center' }}>
                            <Text style = { styles.titleItem }>{x.players}</Text>
                            <Icon name="md-person-add" underlayColor = {'black'} type="ionicon" color = 'black' size = { 30 } onPress = { this.toggleSlideAnimation }/>
                        </View>

                    </View>

                    {/* GAME RULES */}
                    { x.rules.map( o => {

                        return (

                            <View style = { styles.description , { marginBottom: 10 } } key = {o.id}>

                                <Text style = { styles.gameTitle , { fontWeight: 'bold' } }>{o.topic}</Text>
                                <Text style = { styles.gameTitle , { fontWeight: 'none' } }>{o.details}</Text>

                            </View>
                            
                        )

                    })}

                    <Text onPress={ () => { this.fadeOut( x.gameLink ) }} style = { styles.playButton }>Play</Text>

                </View>

            )

        })

    }
    
    render() {

        return (

            <View style={ styles.container }>

                <Animated.View style = {{ opacity: this.state.fadeAnimationOne }}>
                    <Text style = { styles.title }>Games</Text>
                    <View>{ this.mappedGames() }</View>
                </Animated.View>

                { this.state.redirect === true ? ( <Redirect push to= { this.state.currentGameLink } /> ) : null }


            </View>

        );

    }
}