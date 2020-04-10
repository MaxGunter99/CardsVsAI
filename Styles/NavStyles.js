import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {
  
      flex: 0,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
  
    },

    navBarContainer: {
        flex: 0,
        backgroundColor: 'black'
    },
  
    navBar: {
        
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'red',
        position: 'absolute',
  
    },

    navBarItem: {
        color: 'white',
        marginTop: 10,
        fontSize: 20,
    },

    navBarTopSection: {

        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 0,
        alignItems: 'center'

    },

    title: {

        flex: 1,
        color: 'white',
        top: 0,
        fontWeight: 'bold',
        fontSize: 25,
    },

    logo: {

        flex: 0,
        height: 50, 
        width: 50,
        alignSelf: 'center',

    },

    navBarContainerWhite: {
        flex: 0,
        paddingTop: 17,
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },

    backButton: {
        paddingLeft: 20,
    }
  
});

export default styles;