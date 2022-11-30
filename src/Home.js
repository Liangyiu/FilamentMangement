import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';


function Home({ navigation }) {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                    navigation.navigate('Info')}>
                <Text>Show Info</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d3d3d3'
    },
    btn: {
        margin: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#000000',
    },
});

export default Home;
