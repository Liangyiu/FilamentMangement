import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';

function TagInfo({ navigation, route }) {
    return (
        <View style={styles.wrapper}>
            <Text>{route.params.tagId}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d3d3d3',
    },
    btn: {
        margin: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#000000',
    },
});

export default TagInfo;
