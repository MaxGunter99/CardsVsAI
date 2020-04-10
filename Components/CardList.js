import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

// Styles
import styles from '../Styles/GameListStyles';

export default class cardList extends Component {
    
    render() {

        return (
    
            <ScrollView>

                <View style = { styles.container }>

                    <Text style = { styles.title }>Spades</Text>

                    <Text style = { styles.card }>🂠</Text>
                    <Text style = { styles.card }>🂡</Text>
                    <Text style = { styles.card }>🂢</Text>
                    <Text style = { styles.card }>🂣</Text>
                    <Text style = { styles.card }>🂤</Text>
                    <Text style = { styles.card }>🂥</Text>
                    <Text style = { styles.card }>🂦</Text>
                    <Text style = { styles.card }>🂧</Text>
                    <Text style = { styles.card }>🂨</Text>
                    <Text style = { styles.card }>🂩</Text>
                    <Text style = { styles.card }>🂪</Text>
                    <Text style = { styles.card }>🂫</Text>
                    <Text style = { styles.card }>🂭</Text>
                    <Text style = { styles.card }>🂮</Text>

                </View>

                <View style = { styles.container }>

                    <Text style = { styles.title }>Hearts</Text>

                    <Text style = { styles.card }>🂱</Text>
                    <Text style = { styles.card }>🂲</Text>
                    <Text style = { styles.card }>🂳</Text>
                    <Text style = { styles.card }>🂴</Text>
                    <Text style = { styles.card }>🂵</Text>
                    <Text style = { styles.card }>🂶</Text>
                    <Text style = { styles.card }>🂷</Text>
                    <Text style = { styles.card }>🂸</Text>
                    <Text style = { styles.card }>🂹</Text>
                    <Text style = { styles.card }>🂺</Text>
                    <Text style = { styles.card }>🂻</Text>
                    <Text style = { styles.card }>🂽</Text>
                    <Text style = { styles.card }>🂾</Text>

                </View>

                <View style = { styles.container }>

                    <Text style = { styles.title }>Diamonds</Text>

                    <Text style = { styles.card }>🃁</Text>
                    <Text style = { styles.card }>🃂</Text>
                    <Text style = { styles.card }>🃃</Text>
                    <Text style = { styles.card }>🃄</Text>
                    <Text style = { styles.card }>🃅</Text>
                    <Text style = { styles.card }>🃆</Text>
                    <Text style = { styles.card }>🃇</Text>
                    <Text style = { styles.card }>🃈</Text>
                    <Text style = { styles.card }>🃉</Text>
                    <Text style = { styles.card }>🃊</Text>
                    <Text style = { styles.card }>🃋</Text>
                    <Text style = { styles.card }>🃍</Text>
                    <Text style = { styles.card }>🃎</Text>

                </View>

                <View style = { styles.container }>

                    <Text style = { styles.title }>Clubs</Text>

                    <Text style = { styles.card }>🃑</Text>
                    <Text style = { styles.card }>🃒</Text>
                    <Text style = { styles.card }>🃓</Text>
                    <Text style = { styles.card }>🃔</Text>
                    <Text style = { styles.card }>🃕</Text>
                    <Text style = { styles.card }>🃖</Text>
                    <Text style = { styles.card }>🃗</Text>
                    <Text style = { styles.card }>🃘</Text>
                    <Text style = { styles.card }>🃙</Text>
                    <Text style = { styles.card }>🃚</Text>
                    <Text style = { styles.card }>🃛</Text>
                    <Text style = { styles.card }>🃝</Text>
                    <Text style = { styles.card }>🃞</Text>

                </View>
          
            </ScrollView>
        );

    }
};