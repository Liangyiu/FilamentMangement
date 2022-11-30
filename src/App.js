import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import NfcManager from 'react-native-nfc-manager';
import NavStack from './NavStack';
import Home from './Home';

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

    return (
        <ApplicationProvider {...eva} theme={eva.dark}>
            <NavigationContainer>
                <NavStack />
            </NavigationContainer>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
