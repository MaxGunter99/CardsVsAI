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
        flex: 0,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute' , 
        width: 400,
        height: 100,
        top: 50,
        backgroundColor: 'white',
    },

    players: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 400,
    },

    player: {
        padding: 10,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'black'
    },

    activePlayer: {
        padding: 10,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'black'
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
        marginTop: -300,
    },
    
    card: {
        fontSize: 200,
        position: 'absolute',
        bottom: 0

    },

});

export default styles;