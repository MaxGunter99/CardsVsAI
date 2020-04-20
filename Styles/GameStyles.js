import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {

        flex: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 800,

    },

    info: {
        // flex: 0,
        // flexWrap: 'wrap',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute' , 
        width: 400,
        // height: 100,
        top: 0,
        backgroundColor: 'white',
    },

    players: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 80,
    },

    player: {
        flex: 0,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 10,
    },

    activePlayer: {
        flex: 0,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'red',
        marginBottom: 10,
    },

    gameContainer: {

        flex: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 800,

    },

    modal: {
        flex: 0,
        height: 100,
        backgroundColor: 'red',
        padding: 10

    },

    modalText: {
        
        fontSize: 20
        
    },

    stack: {
        marginTop: -100,
        position: 'absolute'
    },
    
    card: {
        fontSize: 200,
        position: 'absolute',
        bottom: 0

    },

});

export default styles;