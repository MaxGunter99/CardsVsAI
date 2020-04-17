import React, { Component } from 'react';
import { Text, View, Animated, Slider, Button } from 'react-native';
import sortedDeck from '../CardList';
import { Icon } from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';


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
        slideUpAnimation: new Animated.Value( 10 ),
        sleepDuration: 500,

        // swipe test
        statusMessage: 'waiting',

        // Face Card Dictionary
        faceCards: { 'King': 4 , 'Queen': 3 , 'Jack': 2 , 'Ace': 1 },

        // If player slaps deck
        slap: false,

        // if you have to deal with face cards
        playerVSFaceCard: false,
        numberOfCardsToPlace: 0,
        cardsPlaced: [],
        placedCard: 0,
        splitPlayer: 0,
        split: false

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

    sleep = m => new Promise( r => setTimeout( r , m ) )

    onSwipeUp = async function() {

        // if the player is swiping against a face card
        if ( this.state.playerVSFaceCard === true && this.state.numberOfCardsToPlace > this.state.cardsPlaced.length ) {

            const animationDuration = 500
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 455,
                duration: animationDuration,
            }).start();
    
            await this.sleep( animationDuration )

            if ( this.state.playersCards[0].length <= 1 ) {

                Animated.timing(this.state.slideUpAnimation, {
                    toValue: -10000,
                    duration: 0,
                }).start();

            } else {

                Animated.timing(this.state.slideUpAnimation, {
                    toValue: 10,
                    duration: 0,
                }).start();

            }



            this.state.stack.push( this.state.playersCards[0][0] )
            this.state.cardsPlaced.push( this.state.playersCards[0][0] )

            let cardsToGo = this.state.numberOfCardsToPlace - this.state.cardsPlaced.length

            if ( cardsToGo > 1 ) {
                this.setState({ statusMessage: `Player ${ this.state.placedCard } placed a face card , you have ${ cardsToGo } chances` })
            } else {
                this.setState({ statusMessage: `Player ${ this.state.placedCard} placed a face card , you have ${ cardsToGo } chance` })
            }

            this.state.playersCards[0].shift()

            if ( this.state.playersCards[0].length === 0 ) {
                this.setState({ statusMessage: `You ran out of cards! ${this.state.placedCard} gets the deck.` })

                for ( var i = 0; i < this.state.stack.length; i++ ) {
                    this.state.playersCards[ this.state.placedCard ].push( this.state.stack[ i ] )
                }

                await this.sleep( this.state.sleepDuration )
                this.setState({ stack: [] })
                this.AITurn()

            } else if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                this.setState({ statusMessage: `You placed a face card! ... Continue` })

                await this.sleep( this.state.sleepDuration )
                this.setState({ statusMessage: 'Your turn' , playerVSFaceCard: false , cardsPlaced: [] })
                this.handleFaceCard()

            } else if ( this.state.numberOfCardsToPlace - this.state.cardsPlaced.length === 0 ) {

                for ( var i = 0; i < this.state.stack.length; i++ ) {
                    this.state.playersCards[ this.state.placedCard ].push( this.state.stack[ i ] )
                }

                this.setState({ 
                    statusMessage: `You did not place a face card, player ${this.state.placedCard} gets the deck` , 
                    playerVSFaceCard: false, 
                    cardsPlaced: [],
                })
                
                await this.sleep( this.state.sleepDuration )

                this.setState({ stack:[] })

                if ( this.state.playersCards.length === 2 ) {

                    this.setState({ playersTurn: 0 })

                } else {

                    this.setState({ playersTurn: this.state.placedCard - 1 })

                }


                this.AITurn()

            }

        } else if ( this.state.playersTurn === 0 && this.state.playerVSFaceCard === false  ) {

            const animationDuration = 500
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 455,
                duration: animationDuration,
            }).start();
    
            await this.sleep( animationDuration )

            if ( this.state.playersCards[0].length <= 1 ) {

                Animated.timing(this.state.slideUpAnimation, {
                    toValue: -10000,
                    duration: 0,
                }).start();

            } else {

                Animated.timing(this.state.slideUpAnimation, {
                    toValue: 10,
                    duration: 0,
                }).start();

            }
    
            if ( this.state.playersCards[0].length >= 1 ) {
    
                this.state.stack.push( this.state.playersCards[0][0] )
                this.setState({ statusMessage: `You placed ${this.state.playersCards[0][0].number} ${this.state.playersCards[0][0].suit }` })
                this.state.playersCards[0].shift()

                await this.sleep( this.state.sleepDuration )
    
                // Face Cards
                if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                    this.handleFaceCard()
                    return
    
                } else {

                    this.AITurn()
                        
                }
    
            } else {

                this.setState({ statusMessage: `You have no cards left, skipping you but you can slap in` })
                await this.sleep( this.state.sleepDuration )
                this.AITurn()

            }
    
        } else {
    
            this.setState({ statusMessage: "It's not your turn to place a card" });
    
        }


    }

    AITurn = async function() {

        await this.returnNextPlayerMoves()

        for ( var x = this.state.playersTurn; x < this.state.playersCards.length; x++ ) {

            // await sleep( Math.floor(Math.random() * 50) + 1000 )
            await this.sleep( this.state.sleepDuration )

            while ( this.state.slap === true ) {
                await this.slapDeck()
            }

            if ( this.state.playersCards[ x ].length === 0 ) {

                this.setState({ statusMessage: `Player ${ x } has no cards :(`})
                await this.sleep( this.state.sleepDuration )
                return this.AITurn()


            } else {

                this.state.stack.push( this.state.playersCards[ x ][0] )
                this.setState({ statusMessage: `Player: ${ x } placed ${this.state.playersCards[ x ][0].number} ${this.state.playersCards[ x ][0].suit }` })
                this.state.playersCards[ x ].shift()
    
                // Face Cards
                if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {
                    return this.handleFaceCard()
                } else {
                    this.returnNextPlayerMoves()
                }

            }


        } 

        if ( this.state.playersCards[0].length === 0 ) {
            this.setState({ statusMessage: 'You have no cards left, skipping' })
            await this.sleep( this.state.sleepDuration )
            return this.AITurn()
        }

    }

    returnNextPlayerMoves = async function() {

        if ( this.state.playersTurn === this.state.playersCards.length - 1 ) {
            this.setState({ playersTurn: 0 })
        } else {
            let next = this.state.playersTurn + 1
            this.setState({ playersTurn: next })
        }
    }

    slapDeck = async function() {

        var validSlap = false

        this.setState({ slap: true })

        // Doubles
        if ( this.state.stack.length >= 2 ) {

            if ( this.state.stack[ this.state.stack.length - 1 ].number === this.state.stack[ this.state.stack.length - 2 ].number ) {
    
                this.setState({ statusMessage: 'you got a Double!' })
                validSlap = true
    
            //Sandwiches
            } else if ( this.state.stack.length >= 3 ) {

                if ( this.state.stack[ this.state.stack.length - 1 ].number === this.state.stack[ this.state.stack.length - 3 ].number ) {
    
                    this.setState({ statusMessage: 'You got a Sandwich!' })
                    validSlap = true
    
                }
    
            }

        }

        await this.sleep( this.state.sleepDuration )

        if ( validSlap === true ) {

            for( var card = 0; card < this.state.stack.length; card++ ) {
                alert( 'You get the stack!' )
                this.state.playersCards[0].push( this.state.stack[card] )
            }

            this.state.stack = []

        } else {

            this.setState({ statusMessage: 'Invalid slap, put a card in the stack' })

        }

        await this.sleep( this.state.sleepDuration )

        this.setState({ slap: false })

    }

    handleFaceCard = async function() {

        await this.returnNextPlayerMoves()

        if ( this.state.playersTurn === 0 ) {
            var placedCard = this.state.playersCards.length - 1
            this.setState({ placedCard: this.state.playersCards.length - 1 })
            var playsFaceCard = this.state.playersTurn

        } else {
            var placedCard = this.state.playersTurn - 1
            this.setState({ placedCard: this.state.playersTurn - 1 })
            var playsFaceCard = this.state.playersTurn
        }

        const cardValue = this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ]
        const playerGetsOut = []

        // if you placed it
        if ( placedCard === 0 ) {

            if ( this.state.playersCards[ 0 ].length === 0 ) {

                return this.handleSplit( placedCard , playsFaceCard )

            }

            if ( cardValue > 1 ) {
                this.setState({ statusMessage: `You placed a face card. Player: ${ playsFaceCard } has ${ cardValue } chances` })

            } else {
                this.setState({ statusMessage: `You placed a face card. Player: ${ playsFaceCard } has ${ cardValue } chance` })

            }

            await this.sleep( this.state.sleepDuration )

            for ( var x = 0; x < cardValue; x++ ) {

                if ( playerGetsOut.length === 0) {

                    if ( x > 0 ) {

                        await this.sleep( this.state.sleepDuration )

                    }

                    if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                        let count = playsFaceCard

                        this.setState({ statusMessage: `Player: ${ playsFaceCard } has no cards left, checking for the next person` })
                        return this.handleSplit( placedCard , playsFaceCard )
    
                    }

                    let chances = cardValue - x

                    this.state.stack.push( this.state.playersCards[ playsFaceCard ][ 0 ] )
                    this.state.playersCards[ playsFaceCard ].shift()
    
                    if ( cardValue > 1 ) {
                        this.setState({ statusMessage: `Player: ${ playsFaceCard } has ${ chances } chances` })
                    } else {
                        this.setState({ statusMessage: `Player: ${ playsFaceCard } has ${ chances } chance` })
                    }
    
                    // if they place a face card
                    if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {
                        playerGetsOut.push('success')
                    }

                }

        
            }

            this.handleDeck( placedCard , playsFaceCard , playerGetsOut )


        // the last person placed it and you have to face it
        } else if ( placedCard === this.state.playersCards.length - 1 ) {

            if ( this.state.playersCards[ 0 ].length === 0 ) {

                return this.handleSplit( placedCard , playsFaceCard )

            }

            this.setState({ 
                playersTurn: 0,
                playerVSFaceCard: true,
                numberOfCardsToPlace: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ],
                cardsPlaced: []
            })

            if ( cardValue > 1 ) {
                this.setState({ statusMessage: `Player: ${ placedCard } placed a face card, you have ${ this.state.numberOfCardsToPlace - this.state.cardsPlaced.length } chances` })
            } else {
                this.setState({ statusMessage: `Player: ${ placedCard } placed a face card, you have ${ this.state.numberOfCardsToPlace - this.state.cardsPlaced.length } chance` })
            }
        
            return

        // someone random placed it
        } else {

            if ( cardValue > 1 ) {
                this.setState({ statusMessage: `Player: ${ placedCard } placed a face card, player ${ playsFaceCard } has ${ cardValue } chances` })
            } else {
                this.setState({ statusMessage: `Player: ${ placedCard } placed a face card, player ${ playsFaceCard } has ${ cardValue } chance` })
            }

            await this.sleep( this.state.sleepDuration )

            if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                let count = playsFaceCard

                this.setState({ statusMessage: `Player: ${ playsFaceCard } has no cards left` })
                return this.handleSplit( placedCard , playsFaceCard )

            }

            for ( var x = 0; x < cardValue; x++ ) {

                if ( playerGetsOut.length === 0) {
    
                    await this.sleep( this.state.sleepDuration )
    
                    if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                        await this.sleep( this.state.sleepDuration )
                        this.setState({ placedCard: playsFaceCard , statusMessage: `Player ${ playsFaceCard } has no cards left , skipping to the next person` })
        
                    } else {
    
                        this.state.stack.push( this.state.playersCards[ playsFaceCard ][ 0 ] )
                        let chances = cardValue - x - 1
                            
                        if ( chances > 1 ) {
                            this.setState({ statusMessage: `Player: ${ playsFaceCard } has ${ chances } chances` })
                        } else {
                            this.setState({ statusMessage: `Player: ${ playsFaceCard } has ${ chances } chance` })
                        }

                        this.state.playersCards[ playsFaceCard ].shift()
                    }
    
                    // if they place a face card
                    if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {
                        playerGetsOut.push('success')
                    }
            
                }
            }

            this.handleDeck( placedCard , playsFaceCard , playerGetsOut )

        }

        await this.sleep( this.state.sleepDuration )

    }
    
    handleSplit = async function( placedCard , playsFaceCard ) {

        this.setState({ placedCard: placedCard })
        this.setState({ statusMessage: 'Splitting it up!' })
        await this.sleep( this.state.sleepDuration )

        const playerId = []
        playerId.push( placedCard )

        for ( var x = 0; x < this.state.playersCards.length; x++ ) {

            if ( playerId[ playerId.length - 1 ] === this.state.playersCards.length ) {
                playerId = 0

            } else {
                playerId.push( playerId[ playerId.length - 1 ] + 1 )
            }

            if ( this.state.split === false ) {
                if ( this.state.playersCards[ playerId[ playerId.length - 1 ] ].length !== 0  ) {
                    this.setState({ split: true , splitPlayer: playerId[ playerId.length - 1 ] , cardValue: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ]  })
                    break
                }
            }
        }

        await this.sleep( this.state.sleepDuration * 2 )

        this.setState({ statusMessage: `Player: ${this.state.placedCard} placed a face card , ${ this.state.splitPlayer } has to place ${ this.state.cardValue } cards ` , cardsPlaced: [] })

        for ( var x = 0; x < this.state.cardValue; x++ ) {

            if ( this.state.playersCards[ this.state.splitPlayer ].length === 0 ) {

                this.setState({ statusMessage: `Player ${ this.state.splitPlayer } ran out of cards! TODO: player ${this.state.placedCard} gets the deck` })
                break

            } else {

                this.state.stack.push( this.state.playersCards[ this.state.splitPlayer ][0] )
                this.state.cardsPlaced.push( this.state.playersCards[ this.state.splitPlayer ][0] )
                this.setState({ statusMessage: `Player: ${ this.state.splitPlayer } placed a ${ this.state.playersCards[ this.state.splitPlayer ][0].number } , ${ this.state.playersCards[ this.state.splitPlayer ][0].suit }` })
                this.state.playersCards[ this.state.splitPlayer ].shift()

            }

            await this.sleep( this.state.sleepDuration )

        }

    }

    handleDeck = async function( placedCard , playsFaceCard , playerGetsOut ) {

        // if player against the face card places a face card
        if ( playerGetsOut.length >= 1 ) {
            this.setState({ statusMessage: `Player: ${ playsFaceCard } made it out!` })
            this.handleFaceCard()
            
        // if player against the face card does not put down a face card
        } else {


            this.setState({ statusMessage: `Player: ${ playsFaceCard } did not make it! Player ${ placedCard } gets the deck!` })
            
            for ( var i = 0; i < this.state.stack.length; i++ ) {
                this.state.playersCards[ placedCard ].push( this.state.stack[0] )

            }
        
            await this.sleep( this.state.sleepDuration )
            this.setState({ stack: [] })
        
            if ( placedCard === 0 ) {
                this.setState({ playersTurn: placedCard })
                this.setState({ statusMessage: `Your turn` })

            } else {
                this.setState({ playersTurn: placedCard - 1 })
                return this.AITurn()

            }
        
        
        }
        
        await this.sleep( this.state.sleepDuration )
    }

    mapPlayersTurn = () => {

        let players = []

        for ( var x = 0; x < this.state.playersCards.length; x++ ) {
            players.push( x )
        }

        return players.map( (x) => {

            return (
                <>
                    { this.state.playersTurn === x ? (
                        <>
                            { x === 0 ? (
                                <Text key = {x} style = { styles.activePlayer }>You: {this.state.playersCards[x].length}</Text>
                            ) : (
                                <Text key = {x} style = { styles.activePlayer }>{x}: {this.state.playersCards[x].length}</Text>
                            ) }

                        </>
                    ) : (
                        <>
                            { x === 0 ? (
                                <Text key = { x } style = { styles.player }>You: {this.state.playersCards[x].length}</Text>
                            ) : (
                                <Text key = {x} style = { styles.player }>{x}: {this.state.playersCards[x].length}</Text>
                            ) }

                        </>
                    )}
                </>
            )

        })

    }
    
    render() {

        const config = {

            velocityThreshold: 0.1,
            directionalOffsetThreshold: 100

        }

        return (

            <>

                { this.state.playing === false ? (

                    <View style = { styles.container }>
                        { this.playersModal() }
                    </View>

                ) : (

                    // THE GAME
                    <View style = { styles.gameContainer }>

                        <View style = { styles.info }>
                            <View style = { styles.players }>{ this.mapPlayersTurn() }</View>
                            <Text>{ this.state.statusMessage }</Text>
                        </View>

                        <View style = { styles.stack }>

                            { this.state.stack.length === 0 ? (
                                <Text>Empty Deck</Text>
                            ) : ( 
                                <Text style = {{ fontSize: 200 }} onPress = { () =>  this.slapDeck() }>{ this.state.stack[ this.state.stack.length - 1 ].icon }</Text>
                            )}

                        </View>

                        { this.state.playersCards[0].length <= 1 ? (

                            <>
                                <Text style = {{ position: 'absolute' , bottom: 100 }}>No Cards Left</Text>
                                <Animated.Text style = {{ fontSize: 200 ,position: 'absolute', bottom: this.state.slideUpAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text>
                            </>

                        ) : (
                            <>
                                <Text style = {{ fontSize: 200, position: 'absolute', bottom: 10, backgroundColor: 'white' }}>{ this.state.back }</Text> 
                                <Animated.Text style = {{ fontSize: 200 ,position: 'absolute', bottom: this.state.slideUpAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text>
                            </>
                        ) }

                        <GestureRecognizer
                            onSwipeUp={ () => this.onSwipeUp() }
                            config={ config }
                            style={{

                                flex: 0,
                                height: 250,
                                width: 300,
                                position: 'absolute',
                                bottom: 20,
                                // backgroundColor: 'red'

                            }}
                        ></GestureRecognizer>

                    </View>
                    

                )}
          
            </>
        );

    }
};