import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components/ui';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Prompt from '../components/Prompt';

function Home({ navigation }) {
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

    async function scanTag(option = 'none') {
        if (Platform.OS === 'android') {
            promptRef.current.setVisible(true);
        }

        tag = await readTagId();

        if (Platform.OS === 'android') {
            promptRef.current.setVisible(false);
        }

        if (tag && option === 'info') {
            navigation.navigate('TagInfo', { tagId: tag });
        }
    }

    return (
        <>
            <TopNavigation title="Home" alignment="center" />
            <Divider />
            <Layout level="4" style={styles.wrapper}>
                <Button
                    onPress={() => {
                        scanTag('info');
                    }}>
                    Show Info
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('NewProducer');
                    }}>
                    Add a new Filament-Producer
                </Button>
                <Prompt
                    ref={promptRef}
                    onCancelPress={() => {
                        NfcManager.cancelTechnologyRequest();
                    }}
                />
            </Layout>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        margin: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#000000',
    },
});

export default Home;
