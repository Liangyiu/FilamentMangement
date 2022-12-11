import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import NfcManager from 'react-native-nfc-manager';
import AppNavigation from './components/AppNavigation';
import { IconRegistry } from '@ui-kitten/components/ui';

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
                <Text style={styles.h3}>Your device does not support NFC!</Text>
            </View>
        );
    } else if (!enabled) {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.h3}>NFC is disabled!</Text>

                <Button
                    onPress={() => {
                        NfcManager.goToNfcSetting();
                    }}
                    title="Go to Settings"></Button>

                <Text style={{ marginVertical: 1.5 }}></Text>

                <Button
                    onPress={async () => {
                        setEnabled(await NfcManager.isEnabled());
                    }}
                    title="Check again"></Button>
            </View>
        );
    }

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.dark}>
                <AppNavigation />
            </ApplicationProvider>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    h3: {
        fontSize: 22,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 0,
        marginRight: 0,
        fontWeight: 'bold',
    },
    btn: {
        marginTop: 15,
        marginBottom: 15,
    },
});

export default App;
