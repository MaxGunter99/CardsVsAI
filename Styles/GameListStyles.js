import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {

        flex: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: 100 

    },

    title: {

        flex: 1,
        fontSize: 30,
        padding: 20

    },

    game: {

        flex: 0,
        borderWidth: 2,
        borderColor: 'black',
        width: 400,
        padding: 10,
        marginBottom: 20 
    },

    gameTitle: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        fontWeight: 'bold'
    },

    titleItem: {
        flex: 0,
        width: 'auto',
        fontSize: 23,
        fontWeight: 'bold'
    },

    description: {

        flex: 0

    },

    playButton: {
        fontSize: 15,
        padding: 10,
        color: 'red'
    },
  
});

export default styles;