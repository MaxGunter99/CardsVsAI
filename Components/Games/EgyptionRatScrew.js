import React, { Component } from 'react';
import { Text, View, Animated, Slider, Button } from 'react-native';
import sortedDeck from '../CardList';
import { Icon } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


// Styles
import styles from '../../Styles/GameStyles';

export default class EgyptionRatScrew extends Component {

    state = {

        // Deck
        back: '🂠',
        deck: sortedDeck,
        shuffled: [],

        // cards on the stack
        stack: [],

        // Game Is Active
        playing: false,

        // Players Details
        players: 2,
        playersTurn: 0,
        playersCards: [],

        // Fade animation values
        fadeAnimation: new Animated.Value( 1 ),
        slideUpAnimation: new Animated.Value( 30 ),

        // swipe test
        statusMessage: 'waiting',

        // Face Card Dictionary
        faceCards: { 'King': 4 , 'Queen': 3 , 'Jack': 2 , 'Ace': 1 },

        // If player slaps deck
        slap: false

    }

    componentDidMount = () => {

        this.shuffle( this.state.deck )

    }

    shuffle = array => {
        const shuffledDeck = array.sort(() => Math.random() - 0.5);
        this.setState({ shuffled: shuffledDeck })
    }

    start = () => {

        const animationDuration = 1000

        Animated.timing(this.state.fadeAnimation, {
            toValue: 0,
            duration: animationDuration,
        }).start();

        setTimeout( () => {

            this.prepareGame()

        } , animationDuration )

    }

    playersModal = () => {

        return (

            <Animated.View style = {{ opacity: this.state.fadeAnimation }}>
    
                <View style = {{ width: 300, flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    
                    <Text style = { styles.modalText }>How many players?</Text>
                    <View style = {{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style = {{ marginRight: 10 , fontSize: 25 }}>{this.state.players}</Text>
                        <Icon name="md-person" underlayColor = {'black'} type="ionicon" color = 'black' size = { 30 } onPress = { this.toggleSlideAnimation }/>
                    </View>
    
                </View>
    
                <Slider 
                    minimumValue = { 2 } 
                    maximumValue={ 52 } 
                    step={ 0.1 } 
                    minimumTrackTintColor="#36d6d3"
                    maximumTrackTintColor="#000000"
                    value={this.state.sliderValue}
                    onValueChange={ ( value ) => this.setState({ players: Math.floor( value ) })}
                />
    
                <Button title = 'Start Game' onPress = { this.start }></Button>
    
            </Animated.View>
    
        )
    }

    prepareGame = () => {

        for ( var x = 0; x < this.state.players; x++ ) {

            this.state.playersCards.push( [] )

        }

        let count = 0

        for ( var i = 0; i < this.state.shuffled.length; i++ ) {

            let currentCard = this.state.shuffled[i]

            if ( count === this.state.players ) {
                count = 0
            }

            this.state.playersCards[ count ].push( currentCard )
            count = count + 1

        }

        this.setState({ playing: true })

    }

    deck = () => {

        return this.state.playersCards[0].map( (x) => {

            return (
                <Text key = {x.icon} style = {styles.card}>{x.icon}</Text>
            )

        })

    }

    onSwipeUp = async function() {

        if ( this.state.playersTurn === 0 ) {

            const sleep = m => new Promise( r => setTimeout( r , m ) )
            const animationDuration = 500
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 478,
                duration: animationDuration,
            }).start();
    
            await sleep( animationDuration )
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 30,
                duration: 0,
            }).start();
    
            if ( this.state.playersCards[0].length >= 1 ) {
    
                this.state.stack.push( this.state.playersCards[0][0] )
                this.setState({ statusMessage: `You placed a card! ${this.state.playersCards[0][0].number} ${this.state.playersCards[0][0].suit }`, playersTurn: 1 })
                this.state.playersCards[0].shift()
    
                if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {
    
                    alert( 'FACE CARD' )
                    return 
    
                } else {
    
                    this.AITurn()
                        
                }
    
    
            }
    
        } else {
    
            this.setState({ myText: 'its not your turn to place a card' });
    
        }


    }

    AITurn = async function() {

        const sleep = m => new Promise( r => setTimeout( r , m ) )

        for ( var x = 1; x < this.state.playersCards.length; x++ ) {

            // await sleep( Math.floor(Math.random() * 50) + 1000 )
            await sleep( 2000 )

            while ( this.state.slap === true ) {
                await this.slap()
            }

            if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {
                alert( 'FACE CARD' )
                return 
            }

            this.state.stack.push( this.state.playersCards[ x ][0] )
            this.setState({ statusMessage: `Player ${ x } placed ${this.state.playersCards[ x ][0].number} ${this.state.playersCards[ x ][0].suit }` })
            this.state.playersCards[ x ].shift()

            
            let player = this.state.playersTurn
            this.setState({ playersTurn: player + 1 })

        } 

        this.setState({ playersTurn: 0 })

    }

    slapDeck = () => {

        this.setState({ slap: true })
        alert( 'SLAPPED DECK ( check if slap is valid )' )

    }

    slap = async function() {

        const sleep = m => new Promise( r => setTimeout( r , m ) )

        await sleep( 1000 )
        this.setState({ slap: false })
        alert( 'continue' )
    }
    
    render() {

        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 100
        };

        return (

            <>

                { this.state.playing === false ? (

                    <View style = { styles.container }>{ this.playersModal() }</View>

                ) : (

                    // THE GAME
                    <View style = { styles.gameContainer }>

                        {/* <Text>Active game, playing is true. Players: { this.state.players } , you have {this.state.playersCards[0].length} cards</Text>  */}
                        <Text>{this.state.statusMessage}</Text>

                        <View style = { styles.stack }>

                            { this.state.stack.length === 0 ? (
                                <Text>Empty Deck</Text>
                            ) : ( 
                                <Text style = {{ fontSize: 200 }} onPress = { () =>  this.slapDeck() }>{ this.state.stack[ this.state.stack.length - 1 ].icon }</Text>
                            )}

                        </View>

                        <GestureRecognizer
                            onSwipeUp={ () => this.onSwipeUp() }
                            config={ config }
                            style={{

                                flex: 0,
                                height: 250,
                                width: 300,
                                position: 'absolute',
                                bottom: 20

                            }}
                        ></GestureRecognizer>

                        { this.state.playersCards[0].length === 0 ? (

                            <Text style = {{ position: 'absolute' , bottom: 100 }}>No Cards Left</Text>

                        ) : (
                            <>
                                <Text style = {{ fontSize: 200, position: 'absolute', bottom: 0, backgroundColor: 'white' }}>{ this.state.back }</Text>
                                <Animated.View style = {
                                    { 
                                        flex: 0,
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        fontSize: 200, 
                                        height: 157, 
                                        width: 122 ,
                                        position: 'absolute', 
                                        bottom: this.state.slideUpAnimation, 
                                        backgroundColor: 'white' , 
                                        borderColor: 'black' , 
                                        borderWidth: 0 
                                    }
                                }>
                                    <Text style = {{ fontSize: 200 , right: 6  }}>{ this.state.back }</Text>
                                </Animated.View>
                            </>
                        ) }

                    </View>

                )}
          
            </>
        );

    }
};