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
        AISlideAnimation: new Animated.Value( -200 ),
        AISlideDirection: -200,
        animationDuration: 500,
        sleepDuration: 1000,

        // swipe test
        statusMessage: 'Your turn ( swipe up to add a card to the deck )',

        // Face Card Dictionary
        faceCards: { 'King': 2 , 'Queen': 3 , 'Jack': 4 , 'Ace': 1 },
        numbers: { '2': 2 , '3': 3 , '4': 4 , '5':  5 , '6': 6 , '7': 7 , '8': 8 },

        // If player slaps deck
        slap: false,
        playerSlappedValid: false,

        // if you have to deal with face cards
        playerVSFaceCard: false,
        numberOfCardsToPlace: 0,
        cardsPlaced: [],
        placedCard: 0,

        // handle split up players ids
        splitPlayer: 0,
        split: false,
        playerId: 0

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
                    maximumValue={ 10 } 
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
        if ( this.state.playerVSFaceCard === true && this.state.numberOfCardsToPlace > this.state.cardsPlaced.length && this.state.playersTurn === 0 ) {
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 305,
                duration: this.state.animationDuration,
            }).start();
    
            await this.sleep( this.state.animationDuration )

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

            let chances = this.state.numberOfCardsToPlace - this.state.cardsPlaced.length
            let cardsToGo =  chances - 1
            this.state.stack.push( this.state.playersCards[ this.state.playersTurn ][0] )
            this.state.cardsPlaced.push( this.state.playersCards[ this.state.playersTurn ][0] )

            if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                this.setState({ statusMessage: `You placed a face card.`, playerVSFaceCard: false })
                this.state.playersCards[ this.state.playersTurn ].shift()
                await this.sleep( this.state.sleepDuration )

                this.setState({ 
                    statusMessage: 'Your turn' ,
                    cardsPlaced: [] 
                })

                if ( this.state.playersCards[0] === 52 ) {

                    this.setState({ statusMessage: 'Your win!' , cardsPlaced: [] })

                } else {

                    this.setState({ statusMessage: 'Your turn' , cardsPlaced: [] })
                    return this.handleFaceCard()

                }

            } else if ( this.state.playersCards[0].length === 0 ) { 

                this.setState({ statusMessage: `You ran out of cards! ${this.state.placedCard} gets the deck.` , playerVSFaceCard: false })

                for ( var i = 0; i < this.state.stack.length; i++ ) {

                    this.state.playersCards[ this.state.placedCard ].push( this.state.stack[ i ] )

                }

                this.setState({ stack: [] })

                if ( this.state.playersTurn === 0 ) {

                    this.setState({ playersTurn: this.state.playersCards.length - 1 })

                } else {

                    this.setState({ playersTurn: this.state.placedCard - 1 })

                }

                await this.sleep( this.state.sleepDuration )
                return this.AITurn()

            } else {

                if ( cardsToGo > 1 ) {

                    this.setState({ statusMessage: `You have ${ cardsToGo } chances` })

                } else {

                    this.setState({ statusMessage: `You have ${ cardsToGo } chance` })

                }

                this.state.playersCards[ 0 ].shift()

                if ( this.state.playersCards[0].length === 0 ) { 

                    this.setState({ statusMessage: `You ran out of cards! ${this.state.placedCard} gets the deck.`, playerVSFaceCard: false })
    
                    for ( var i = 0; i < this.state.stack.length; i++ ) {

                        this.state.playersCards[ this.state.placedCard ].unshift( this.state.stack[ i ] )

                    }
    
                    this.setState({ stack: [] })
                    await this.sleep( this.state.sleepDuration )
    
                    if ( this.state.playersTurn === 0 ) {

                        this.setState({ playersTurn: this.state.playersCards.length - 1 })

                    } else {

                        this.setState({ playersTurn: this.state.placedCard - 1 })

                    }
    
                    return this.AITurn()

                } else if ( this.state.numberOfCardsToPlace - this.state.cardsPlaced.length === 0 ) {

                    await this.sleep( this.state.sleepDuration )

                    this.setState({ statusMessage: `AI ${this.state.placedCard} gets the deck.` , playerVSFaceCard : false })

                    for ( var i = 0; i < this.state.stack.length; i++ ) {

                        this.state.playersCards[ this.state.placedCard ].push( this.state.stack[ i ] )

                    }

                    this.setState({ stack: [] })
                    await this.sleep( this.state.sleepDuration )

                    if ( this.state.placedCard === this.state.playersCards.length - 1 ) {

                        this.setState({ playersTurn: this.state.playersCards.length - 2 })

                    } else {

                        this.setState({ playersTurn: this.state.placedCard - 1 })

                    }

                    return this.AITurn()

                }

            }

        } else if ( this.state.playersTurn === 0 && this.state.playerVSFaceCard === false || this.state.playerSlappedValid === true ) {
    
            Animated.timing(this.state.slideUpAnimation, {
                toValue: 305,
                duration: this.state.animationDuration,
            }).start();
    
            await this.sleep( this.state.animationDuration )

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
                this.setState({ statusMessage: `You placed a ${ this.state.playersCards[0][0].number } ${ this.state.playersCards[0][0].suit }`, playerSlappedValid: false  })
                this.state.playersCards[0].shift()

                await this.sleep( this.state.sleepDuration )
    
                // Face Cards
                if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                    return this.handleFaceCard()
    
                } else {

                    return this.AITurn()
                        
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

        let cardsLeft = []

        for ( var x = 0; x < this.state.playersCards.length; x++ ) {

            if ( this.state.playersCards[ x ].length > 0 ) {

                cardsLeft.push( x )

            }

        }

        if ( cardsLeft.length === 1 ) {
            for ( var x = 0; x < this.state.stack.length; x++ ) {
                this.state.playersCards[ cardsLeft[0].push( this.state.stack[x] ) ]
            }
            this.setState({ statusMessage: `AI ${ cardsLeft[0] } wins!` , stack: [] })
            await this.sleep( 5000 )
            this.setState({ playersTurn: cardsLeft[0] })
            return

        }

        await this.returnNextPlayerMoves()
        await this.sleep( this.state.sleepDuration )
        this.setState({ statusMessage: '' })

        for ( var x = this.state.playersTurn; x < this.state.playersCards.length; x++ ) {

            if ( this.state.slap === true ) {

                await this.slapDeck()
                alert( 'BLOOP' )
      
            }
            
            if ( this.state.playerSlappedValid === true ) {
                return
            }

            if ( this.state.playersCards[ x ].length === 0 ) {

                if ( this.state.playersTurn === this.state.playersCards.length - 1 ) {

                    await this.returnNextPlayerMoves()

                } else {

                    return this.AITurn()

                }


            } else {

                const side = Math.floor( Math.random() * 2 )

                // From Left
                if ( side === 0 ) {

                    this.setState({ AISlideDirection: 0 })

                } else {

                    this.setState({ AISlideDirection: 1 })

                }

                Animated.timing(this.state.AISlideAnimation, {
                    toValue: 140,
                    duration: this.state.animationDuration,
                }).start();

                await this.sleep( this.state.animationDuration )

                Animated.timing(this.state.AISlideAnimation, {
                    toValue: -200,
                    duration: 0,
                }).start();

                this.state.stack.push( this.state.playersCards[ x ][0] )
                this.setState({ statusMessage: `AI ${ x } placed ${ this.state.playersCards[ x ][0].number } ${ this.state.playersCards[ x ][0].suit }` })
                this.state.playersCards[ x ].shift()

                // await this.sleep( Math.floor(Math.random() * 50) + 1000 )
                await this.sleep( this.state.sleepDuration )
            
                // Face Cards
                if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                    return this.handleFaceCard()

                } else {

                    this.returnNextPlayerMoves()

                }

            }
        }

        if ( this.state.playersCards[0].length === 0 ) {

            // this.setState({ statusMessage: 'You have no cards left, skipping' })
            return this.AITurn()
                
        } else {

            if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                this.setState({ 
                    playersTurn: 0,
                    playerVSFaceCard: true,
                    numberOfCardsToPlace: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ],
                    cardsPlaced: []
                })

            } else {

                this.setState({ playersTurn: 0, playerVSFaceCard: false })

            }
        }
    }

    returnNextPlayerMoves = async function() {

        if ( this.state.slap === true ) {

            await this.slapDeck()
            alert( 'BLOOP' )
            
        }
        
        if ( this.state.playerSlappedValid === true ) {
            return
        }

        if ( this.state.playersTurn === this.state.playersCards.length - 1 ) {

            this.setState({ playersTurn: 0 })

        } else {

            let next = this.state.playersTurn + 1
            this.setState({ playersTurn: next })

        }
    }

    slapDeck = async function() {

        this.setState({ slap: true })

        // Doubles
        if ( this.state.stack.length >= 2 ) {

            if ( this.state.stack[ this.state.stack.length - 1 ].number === this.state.stack[ this.state.stack.length - 2 ].number ) {
    
                this.setState({ statusMessage: 'You got a Double, You get the stack!', playerSlappedValid: true })

            } else if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.numbers && this.state.stack[ this.state.stack.length - 2 ].number in this.state.numbers ) {

                if ( this.state.numbers[ this.state.stack[ this.state.stack.length - 1 ].number ] + this.state.numbers[ this.state.stack[ this.state.stack.length - 2 ].number ] === 10 ) {

                    this.setState({ statusMessage: 'The last 2 add up to 10, You get the stack!' , playerSlappedValid: true })

                }
    
            //Sandwiches
            } else if ( this.state.stack.length >= 3 ) {

                if ( this.state.stack[ this.state.stack.length - 1 ].number === this.state.stack[ this.state.stack.length - 3 ].number ) {
    
                    this.setState({ statusMessage: 'You got a Sandwich, You get the stack!' , playerSlappedValid: true })
    
                }
    
            }

        }

        await this.sleep( this.state.sleepDuration )

        if ( this.state.playerSlappedValid === true ) {

            for( var card = 0; card < this.state.stack.length; card++ ) {

                this.state.playersCards[0].push( this.state.stack[card] )

            }

            this.setState({ stack: [] , playersTurn: 0 , statusMessage: 'Your turn' })

        } else {

            if ( this.state.playersCards[0].length > 0 ) {

                this.setState({ statusMessage: 'Invalid slap, you lose one card.' })
                this.state.stack.unshift( this.state.playersCards[0][0] )
                this.state.playersCards[0].shift()

            } else {

                this.setState({ statusMessage: 'Invalid slap.' })

            }

        }

        await this.sleep( 3000 )
        this.setState({ slap: false , splitPlayer: 0, playerId: 0 })
        return

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

        if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

            return this.handleSplit( placedCard , playsFaceCard )

        }

        const cardValue = this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ]
        const playerGetsOut = []

        // if you placed it
        if ( placedCard === 0 ) {

            const side = Math.floor( Math.random() * 2 )

            for ( var x = 0; x < cardValue; x++ ) {

                if ( this.state.slap === true ) {

                    await this.slapDeck()
                    alert( 'BLOOP' )
        
                    
                }
                
                if ( this.state.playerSlappedValid === true ) {
                    return
                }

                if ( side === 0 ) {

                    this.setState({ AISlideDirection: 0 })

                } else {

                    this.setState({ AISlideDirection: 1 })

                }

                let chances = cardValue - x
                if ( chances > 1 || chances === 0 ) {

                    this.setState({ statusMessage: `AI ${ playsFaceCard } has ${ chances } chances` })

                } else {

                    this.setState({ statusMessage: `AI ${ playsFaceCard } has ${ chances } chance` })

                }
            
                await this.sleep( this.state.sleepDuration )

                if ( playerGetsOut.length === 0 && this.state.slap === false) {

                    Animated.timing(this.state.AISlideAnimation, {
                        toValue: 140,
                        duration: this.state.animationDuration,
                    }).start();

                    await this.sleep( this.state.animationDuration )

                    Animated.timing(this.state.AISlideAnimation, {
                        toValue: -200,
                        duration: 0,
                    }).start();

                    this.state.stack.push( this.state.playersCards[ playsFaceCard ][ 0 ] )
                    this.state.playersCards[ playsFaceCard ].shift()

                    if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                        this.setState({ statusMessage: `AI ${ playsFaceCard } has no cards left, You get the deck` })
                        break
            
                    }
            
                    // if they place a face card
                    if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                        playerGetsOut.push('success')
                        break

                    }
                }
            }

            this.handleDeck( placedCard , playsFaceCard , playerGetsOut )


        // the last person placed it and you have to face it
        } else if ( placedCard === this.state.playersCards.length - 1 ) {

            this.setState({ 
                playersTurn: 0,
                playerVSFaceCard: true,
                numberOfCardsToPlace: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ],
                cardsPlaced: []
            })

            // this.state.playersCards[0] = this.state.playersCards[0].reverse()

            if ( cardValue > 1 || cardValue === 0 ) {

                this.setState({ statusMessage: `AI ${ placedCard } placed a face card. You have ${ this.state.numberOfCardsToPlace - this.state.cardsPlaced.length } chances` })

            } else {

                this.setState({ statusMessage: `AI ${ placedCard } placed a face card. You have ${ this.state.numberOfCardsToPlace - this.state.cardsPlaced.length } chance` })

            }
        
            return

        // someone random placed it
        } else {

            if ( cardValue > 1 || cardValue === 0 ) {

                this.setState({ statusMessage: `AI ${ placedCard } placed a face card. AI ${ playsFaceCard } has ${ cardValue } chances` })

            } else {

                this.setState({ statusMessage: `AI ${ placedCard } placed a face card. AI ${ playsFaceCard } has ${ cardValue } chance` })

            }

            await this.sleep( this.state.sleepDuration )

            if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                // this.setState({ statusMessage: `Player: ${ playsFaceCard } has no cards left` })
                return this.handleSplit( placedCard , playsFaceCard )

            }

            const side = Math.floor( Math.random() * 2 )

            if ( side === 0 ) {

                this.setState({ AISlideDirection: 0 })

            } else {

                this.setState({ AISlideDirection: 1 })
                
            }

            for ( var x = 0; x < cardValue; x++ ) {

                if ( this.state.slap === true ) {

                    await this.slapDeck()
                    alert( 'BLOOP' )
          
                }
                
                if ( this.state.playerSlappedValid === true ) {
                    return
                }

                // If the AI has not placed a face card yet
                if ( playerGetsOut.length === 0 ) {

                    await this.sleep( this.state.sleepDuration )

                    if ( this.state.playersCards[ playsFaceCard ].length === 0  && x > 0 && this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                        playerGetsOut.push('success')

                    } else if ( this.state.playersCards[ playsFaceCard ].length === 0 ) {

                        this.setState({ placedCard: playsFaceCard , statusMessage: `AI ${ playsFaceCard } has no cards left. AI ${ placedCard } gets the deck.` })
                        await this.sleep( this.state.sleepDuration )

                        if ( this.state.slap === true ) {

                            await this.slapDeck()
                            alert( 'BLOOP' )
                 
                        }

                        if ( this.state.playerSlappedValid === true ) {
                            return
                        }

                        for ( var x = 0; x < this.state.stack.length; x++ ) {

                            this.state.playersCards[ placedCard ].push( this.state.stack[ x ] )

                        }

                        this.setState({ stack: [] , playersTurn: placedCard - 1 })
                        return this.AITurn()
                
                    } else {

                        if ( this.state.slap === true ) {

                            await this.slapDeck()
                            alert( 'BLOOP' )
                 
                        }

                        if ( this.state.playerSlappedValid === true ) {
                            return
                        }

                        Animated.timing(this.state.AISlideAnimation, {
                            toValue: 140,
                            duration: this.state.animationDuration,
                        }).start();

                        await this.sleep( this.state.animationDuration )

                        Animated.timing(this.state.AISlideAnimation, {
                            toValue: -200,
                            duration: 0,
                        }).start();
            
                        this.state.stack.push( this.state.playersCards[ playsFaceCard ][ 0 ] )
                        let chances = cardValue - x - 1
                                    
                        if ( chances > 1 ) {

                            this.setState({ statusMessage: `AI ${ playsFaceCard } has ${ chances } chances` })

                        } else {

                            this.setState({ statusMessage: `AI ${ playsFaceCard } has ${ chances } chance` })

                        }

                        this.state.playersCards[ playsFaceCard ].shift()
                    }
            
                    // if they place a face card
                    if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                        playerGetsOut.push('success')

                    }
                }
            }

            if ( this.state.slap === true ) {

                await this.slapDeck()
                alert( 'BLOOP' )
    
            }
                    
            if ( this.state.playerSlappedValid === true ) {
                return
            }

            this.handleDeck( placedCard , playsFaceCard , playerGetsOut )

        }

        await this.sleep( this.state.sleepDuration )

    }
    
    handleSplit = async function( placedCard , playsFaceCard ) {

        this.setState({ 
            split: false,
            // statusMessage: 'Splitting it up!',
            // person who placed face card
            placedCard: placedCard , 
            // player who deals with face card
            playerId: playsFaceCard 
        })

        for ( var x = 0; x < this.state.playersCards.length; x++ ) {

            if ( this.state.slap === true ) {

                await this.slapDeck()
                alert( 'BLOOP' )
     
            }

            if ( this.state.playerSlappedValid === true ) {
                return
            }

            if ( this.state.split === false ) {

                if ( this.state.playersCards[ this.state.playerId ].length >= 1 ) {

                    this.setState({ 
                        split: true , 
                        splitPlayer: this.state.playerId , 
                        cardValue: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ],
                        playersTurn: this.state.playerId ,
                        cardsPlaced: []

                    })
                    break

                } else {

                    if ( this.state.playerId === this.state.playersCards.length - 1 ) {

                        this.setState({ playerId: 0 })

                    } else {

                        this.setState({ playerId: this.state.playerId + 1 })

                    }

                }

            }
        }

        if ( this.state.split === false) {

            await this.sleep( this.state.sleepDuration )
            this.setState({ statusMessage: `AI ${ this.state.placedCard } wins, nobody has any cards`, playersTurn: this.state.placedCard})
            return

        } else {

            this.setState({ cardsPlaced: [] })
            await this.sleep( this.state.sleepDuration )

            if ( this.state.splitPlayer === 0 ) {

                this.setState({ 
                    statusMessage: `AI ${ this.state.placedCard } placed a face card , You have ${ this.state.cardValue - this.state.cardsPlaced } chances ` , 
                    playerVSFaceCard: true,
                    playersTurn: 0,
                    numberOfCardsToPlace: this.state.faceCards[ this.state.stack[ this.state.stack.length - 1 ].number ], 
                    cardsPlaced: []
                })
                return

            } else {

                let chances = this.state.cardValue - this.state.cardsPlaced 

                if ( chances > 1  ) {

                    this.setState({ statusMessage: `AI ${ this.state.placedCard } placed a face card. AI ${ this.state.splitPlayer } has ${ chances } chances` })

                } else {

                    this.setState({ statusMessage: `AI ${ this.state.placedCard } placed a face card. AI ${ this.state.splitPlayer } has ${ chances } chance` })

                }

            }

            const side = Math.floor( Math.random() * 2 )

            if ( side === 0 ) {

                this.setState({ AISlideDirection: 0 })

            } else {

                this.setState({ AISlideDirection: 1 })

            }


            for ( var x = 0; x < this.state.cardValue; x++ ) {

                if ( this.state.slap === true ) {

                    await this.slapDeck()
                    alert( 'BLOOP' )
           
                }
                
                if ( this.state.playerSlappedValid === true ) {
                    return
                }

                if ( this.state.split === true ) {
                        
                    if ( this.state.playersCards[ this.state.splitPlayer ].length === 0 ) {
                            
                        this.setState({ statusMessage: `AI ${ this.state.splitPlayer } ran out of cards. AI ${this.state.placedCard} gets the deck` , split: false })
                        await this.sleep( this.state.sleepDuration )

                        for ( var x = 0; x < this.state.stack.length; x++ ) {

                            this.state.playersCards[ this.state.placedCard ].push( this.state.stack[ x ] )

                        }

                        this.setState({ stack: [] , playersTurn: this.state.placedCard })

                        if ( this.state.playersCards[ this.state.playersTurn ].length === 52 ) {

                            if ( this.state.placedCard === 0 ) {

                                this.setState({ statusMessage: 'You win!' })
        
                            } else {

                                this.setState({ statusMessage: `AI ${this.state.playersTurn} wins!` , playersTurn: this.state.playersTurn })

                            }

                            return

                        } else {

                            if ( this.state.placedCard === 0 ) {

                                this.setState({ statusMessage: 'Your turn' , playersTurn: 0 })
        
                            } else {

                                this.setState({ playersTurn: this.state.placedCard - 1 })
                                return this.AITurn()

                            }
                        }
                            
                    } else if ( this.state.playersCards[ this.state.splitPlayer ].length >= 1 ) {

                        Animated.timing(this.state.AISlideAnimation, {
                            toValue: 140,
                            duration: this.state.animationDuration,
                        }).start();

                        await this.sleep( this.state.animationDuration )

                        Animated.timing(this.state.AISlideAnimation, {
                            toValue: -200,
                            duration: 0,
                        }).start();
                            
                        this.state.stack.push( this.state.playersCards[ this.state.splitPlayer ][0] )
                        this.state.cardsPlaced.push( this.state.playersCards[ this.state.splitPlayer ][0] )
                            
                        if ( this.state.stack[ this.state.stack.length - 1 ].number in this.state.faceCards ) {

                            await this.sleep( this.state.sleepDuration )
                            this.state.playersCards[ this.state.splitPlayer ].shift()
                            this.setState({ statusMessage: `AI ${ this.state.splitPlayer } placed a face card!` , split: false, playersTurn: this.state.splitPlayer })
                            return this.handleFaceCard()
                            
                        } else {

                            this.state.playersCards[ this.state.splitPlayer ].shift()

                        }
                    }
                }

                await this.sleep( this.state.sleepDuration )

            }

            if ( this.state.slap === true ) {

                await this.slapDeck()
                alert( 'BLOOP' )
                
            }

            if ( this.state.playerSlappedValid === true ) {
                return
            }

            if ( this.state.playersCards[ this.state.splitPlayer ] === 0 ) {

                if ( this.state.placedCard === 0 ) {

                    this.setState({ statusMessage: `AI ${ this.state.splitPlayer } ran out of cards! You get the deck` })

                } else {

                    this.setState({ statusMessage: `AI ${ this.state.splitPlayer } ran out of cards! AI ${ this.state.placedCard } gets the deck` })

                }

                await this.sleep( this.state.sleepDuration )

                for ( x in this.state.stack ) {

                    this.state.playersCards[ this.state.placedCard ].push( this.state.stack[x] )

                }
    
                await this.sleep( this.state.sleepDuration )
    
                if ( this.state.placedCard === 0 ) {

                    this.setState({ playersTurn: 0, statusMessage: 'Your turn' })

                } else {

                    this.setState({ playersTurn: this.state.placedCard })
                    return this.AITurn()

                }

            } else {

                this.setState({ statusMessage: `AI ${ this.state.splitPlayer } does not make it out. AI ${ this.state.placedCard } gets the deck` })
                await this.sleep( this.state.sleepDuration )

                for ( x in this.state.stack ) {

                    this.state.playersCards[ this.state.placedCard ].push( this.state.stack[x] )

                }
    
                await this.sleep( this.state.sleepDuration )
                this.setState({ stack: [] , playersTurn: this.state.placedCard })
    
                if ( this.state.playersTurn === 0 ) {

                    this.setState({ statusMessage: `Your turn` })

                } else {

                    this.setState({ playersTurn: this.state.placedCard - 1 })
                    return this.AITurn()

                }             
            }
        }
    }

    handleDeck = async function( placedCard , playsFaceCard , playerGetsOut ) {

        if ( this.state.slap === true ) {

            await this.slapDeck()
            alert( 'BLOOP' )

        }

        if ( this.state.playerSlappedValid === true ) {
            return
        }

        // if player against the face card places a face card
        if ( playerGetsOut.length >= 1 ) {

            this.setState({ statusMessage: `AI ${ playsFaceCard } placed a face card!` })
            await this.sleep( this.state.sleepDuration )
            this.handleFaceCard()
                
        // if player against the face card does not put down a face card
        } else {

            if ( placedCard === 0 ) {

                this.setState({ statusMessage: `AI ${ playsFaceCard } did not make it! You get the deck!` })

            } else {

                this.setState({ statusMessage: `AI ${ playsFaceCard } did not make it! AI ${ placedCard } gets the deck!` })

            }

            await this.sleep( this.state.sleepDuration )
                
            for ( var i = 0; i < this.state.stack.length; i++ ) {

                this.state.playersCards[ placedCard ].push( this.state.stack[i] )

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
    }

    mapPlayersTurn = () => {

        let players = []

        for ( var x = 0; x < this.state.playersCards.length; x++ ) {

            players.push( x )

        }

        return players.map( (x) => {

            return (

                <View style = { styles.players }>

                    { this.state.playersTurn === x ? (

                        <>
                            { x === 0 ? (

                                <View style = { styles.activePlayer }>

                                    <Text key = {x} style = {{ fontWeight: 'bold' , marginBottom: 5 , fontSize: 16 }}>You</Text>

                                    { this.state.playersCards[x].length === 0 ? (

                                        <Text>❌</Text>

                                    ) : (

                                        <Text>🂠: {this.state.playersCards[x].length}</Text>

                                    ) }

                                </View>

                            ) : (

                                <View style = { styles.activePlayer }>

                                    <Text key = {x} style = {{ fontWeight: 'bold' , marginBottom: 5 , fontSize: 16 }}>{x}</Text>

                                    { this.state.playersCards[x].length === 0 ? (

                                        <Text>❌</Text>

                                    ) : (

                                        <Text>🂠: {this.state.playersCards[x].length}</Text>

                                    ) }

                                </View>

                            ) }

                        </>

                    ) : (

                        <>
                            { x === 0 ? (

                                <View style = { styles.player }>

                                    <Text key = { x } style = {{ fontWeight: 'bold' , marginBottom: 5 , fontSize: 16 }}>You</Text>

                                    { this.state.playersCards[x].length === 0 ? (

                                        <Text>❌</Text>

                                    ) : (

                                        <Text>🂠: {this.state.playersCards[x].length}</Text>

                                    ) }

                                </View>

                            ) : (
                                <View style = { styles.player }>

                                    <Text key = {x} style = {{ fontWeight: 'bold' , marginBottom: 5 , fontSize: 16 }}>{x}</Text>

                                    { this.state.playersCards[x].length === 0 ? (

                                        <Text>❌</Text>

                                    ) : (

                                        <Text>🂠: {this.state.playersCards[x].length}</Text>

                                    ) }

                                </View>
                            ) }

                        </>

                    )}

                </View>
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

                        {/* The Menu of players */}
                        <View style = { styles.info }>

                            <View style = {{ flex: 0 , flexDirection: 'row' , marginBottom: 50, flexWrap: 'wrap' }}>{ this.mapPlayersTurn() }</View>
                            <Text>{ this.state.statusMessage }</Text>

                        </View>

                        {/* The deck of cards on the table people have set down */}
                        <View style = { styles.stack }>

                            { this.state.stack.length === 0 ? (

                                <Text>Empty Deck</Text>

                            ) : ( 
                                <>
                                    { this.state.stack[ this.state.stack.length - 1 ].suit === 'Hearts' || this.state.stack[ this.state.stack.length - 1 ].suit === 'Diamonds' ? (

                                        <Text style = {{ fontSize: 200, color: 'red' }} onPress = { () =>  this.slapDeck() }>{ this.state.stack[ this.state.stack.length - 1 ].icon }</Text>

                                    ) : (

                                        <Text style = {{ fontSize: 200 }} onPress = { () =>  this.slapDeck() }>{ this.state.stack[ this.state.stack.length - 1 ].icon }</Text>

                                    ) }
                                </>
                            )}

                        </View>

                        {/* AI's CARD */}
                        { this.state.AISlideDirection === 0 ? (

                            <Animated.Text style = {{ fontSize: 200 , position: 'absolute', left: this.state.AISlideAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text>

                        ) : (

                           <Animated.Text style = {{ fontSize: 200 , position: 'absolute', right: this.state.AISlideAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text> 

                        ) }

                        {/* Your deck */}
                        { this.state.playersCards[0].length <= 1 ? (

                            <>
                                <Text style = {{ position: 'absolute' , bottom: 100 }}>No Cards Left</Text>
                                <Animated.Text style = {{ fontSize: 200 , position: 'absolute', bottom: this.state.slideUpAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text>
                            </>

                        ) : (
                            <>
                                <Text style = {{ fontSize: 200, position: 'absolute', bottom: 10, backgroundColor: 'white' }}>{ this.state.back }</Text> 
                                <Animated.Text style = {{ fontSize: 200 , position: 'absolute', bottom: this.state.slideUpAnimation, backgroundColor: 'white'    }}>{ this.state.back }</Animated.Text>
                            </>
                        ) }

                        {/* Gesture detector for swiping up */}
                        <GestureRecognizer
                            onSwipeUp={ () => this.onSwipeUp() }
                            config={ config }
                            style={{

                                flex: 0,
                                height: 250,
                                width: 300,
                                position: 'absolute',
                                bottom: 20,

                            }}
                        ></GestureRecognizer>

                    </View>
                    

                )}
          
            </>
        );

    }
};