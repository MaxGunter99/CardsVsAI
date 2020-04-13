import React , { Component } from 'react';
import { Text, View, Image, AsyncStorage } from 'react-native';
import { Link } from 'react-router-native';

// Styles
import styles from '../Styles/HomeStyles';

export default class Home extends Component {

    state = {
        name: null
    }

    retrieveData = async () => {
        try {

            const value = await AsyncStorage.getItem('Name');
            if (value !== null) {
                this.setState({ name: data })

            }

        } catch( err ) {
            console.log( err )

        }
    };
    
    render() {

        return (
    
            <View style = { styles.container }>

                { this.state.name === null ? (

                    <Link to = '/EgyptionRatScrew'>
                        <Text style = { styles.title }>No Data</Text>
                    </Link>

                ) : ( 

                    <Text style = { styles.title }>You Have Data</Text>
                )}
          
            </View>
        );
    }
}