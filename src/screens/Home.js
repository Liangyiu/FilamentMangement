import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components/ui';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Prompt from '../components/Prompt';

function Home({ navigation }) {
    const [nfcReader, updateNfc] = React.useState(false);
    const promptRef = React.useRef();
    let tag = undefined;

    async function readTagId() {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();

            return tag.id;
        } catch (ex) {
            updateNfc(!nfcReader);
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
            return navigation.navigate('TagInfo', { tagId: tag });
        }

        if (tag && option === 'newFilament') {
            return navigation.navigate('NewFilament', { tagId: tag });
        }

        if (tag && option === 'updateFilament') {
            return navigation.navigate('NewFilament', { tagId: tag });
        }
    }

    return (
        <>
            <TopNavigation title="Home" alignment="center" />
            <Divider />
            <Layout level="4" style={styles.wrapper}>
                <Button
                    style={styles.btn}
                    onPress={() => {
                        scanTag('info');
                    }}>
                    Show Info
                </Button>
                <Button
                    style={styles.btn}
                    onPress={() => {
                        navigation.navigate('ShowStock');
                    }}>
                    Show Stock
                </Button>
                <Button
                    style={styles.btn}
                    onPress={() => {
                        scanTag('newFilament');
                    }}>
                    Add/Update Filament
                </Button>
                <Button
                    style={styles.btn}
                    onPress={() => {
                        navigation.navigate('NewProducer');
                    }}>
                    Add Filament-Producer
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
        margin: 8,
        padding: 8,
        borderRadius: 8,
    },
});

export default Home;
