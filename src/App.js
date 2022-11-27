import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import Game from './Game';

function App(props) {
    const [hasNfc, setHasNfc] = React.useState(null);
    const [enabled, setEnabled] = React.useState(null);

    React.useEffect(() => {
        async function checkNfc() {
            const supported = await NfcManager.isSupported();
            if (supported) {
                await NfcManager.start();
                setEnabled(await NfcManager.isEnabled());
            }
            setHasNfc(supported);
        }

        checkNfc();
    }, []);

    if (hasNfc === null) {
        return null;
    } else if (!hasNfc) {
        return (
            <View style={styles.wrapper}>
                <Text>Your device does not support NFC!</Text>
            </View>
        );
    } else if (!enabled) {
        return (
            <View style={styles.wrapper}>
                <Text>NFC is disabled!</Text>

                <TouchableOpacity
                    onPress={() => {
                        NfcManager.goToNfcSetting();
                    }}>
                    <Text>Go to Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        setEnabled(await NfcManager.isEnabled());
                    }}>
                    <Text>Check again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <Game />;
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
