import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Prompt from './Prompt';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';

function InfoScreen({ navigation }) {
    const promptRef = React.useRef();
    let tag = undefined;

    async function readTagId() {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();

            return tag.id;
        } catch (ex) {
            console.warn('Oops!', ex);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    }

    async function scanTag() {
        if (Platform.OS === 'android') {
            promptRef.current.setVisible(true);
        }

        tag = await readTagId();

        if (Platform.OS === 'android') {
            promptRef.current.setVisible(false);
        }

        if (tag) {
            navigation.navigate('TagInfo', { tagId: tag });
        }
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.btn} onPress={scanTag}>
                <Text>Scan Tag</Text>
            </TouchableOpacity>
            <Prompt
                ref={promptRef}
                onCancelPress={() => {
                    NfcManager.cancelTechnologyRequest();
                }}
            />
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

export default InfoScreen;
