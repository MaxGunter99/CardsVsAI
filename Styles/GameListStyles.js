import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {

        flex: 5,
        backgroundColor: 'white',
        alignItems: 'center',

    },

    title: {

        flex: 2,
        fontSize: 30,
        padding: 20

    },

    game: {

        flex:1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'black',
        width: 400,

    },

    gameTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    titleItem: {
        fontSize: 20,
        flex: 1,
        width: 100,
        justifyContent: 'space-evenly'
    },

    description: {

        flex: 1

    },

    card: {

        fontSize: 200,

    },
  
});

export default styles;