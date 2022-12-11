import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Prompt from '../components/Prompt';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { Icon, TopNavigationAction, TopNavigation, Divider, Layout, Text, Button } from '@ui-kitten/components';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

function InfoScreen({ navigation }) {
    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

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
        <>
            <TopNavigation title="Scan your Tag" alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <Layout style={styles.wrapper}>
                <Button appearance="outline" onPress={scanTag}>
                    Scan Tag
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

export default InfoScreen;
