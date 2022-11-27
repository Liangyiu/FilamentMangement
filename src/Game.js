import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import Prompt from './Prompt';

function Game(props) {
    const [start, setStart] = React.useState(null);
    const [duration, setDuration] = React.useState(0);
    const promptRef = React.useRef();

    React.useEffect(() => {
        let count = 5;

        NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
            count--;

            if (Platform.OS === 'android') {
                promptRef.current.setHintText(`${count}...`);
            }

            if (count <= 0) {
                NfcManager.unregisterTagEvent().catch(() => 0);
                setDuration(new Date().getTime() - start.getTime());

                if (Platform.OS === 'android') {
                    promptRef.current.setVisible(false);
                }
            }
        });

        return () => {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        };
    }, [start]);

    async function scanTag() {
        NfcManager.registerTagEvent();
        if (Platform.OS === 'android') {
            promptRef.current.setVisible(true);
        }

        setStart(new Date());
        setDuration(0);
    }

    return (
        <View style={styles.wrapper}>
            <Text>NFC-Game</Text>
            {duration > 0 && <Text>{duration} ms</Text>}
            <TouchableOpacity style={styles.btn} onPress={scanTag}>
                <Text>Start</Text>
            </TouchableOpacity>
            <Prompt ref={promptRef} onCancelPress={() => {
                NfcManager.unregisterTagEvent().catch(() => 0);
            }} />
        </View>
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

export default Game;
