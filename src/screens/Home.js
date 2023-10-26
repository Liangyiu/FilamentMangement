import {
    Button,
    Divider,
    Icon,
    Layout,
    TopNavigation,
    TopNavigationAction,
    Modal,
    ButtonGroup,
    Card,
    Input,
} from '@ui-kitten/components/ui';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Prompt from '../components/Prompt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsIcon = props => <Icon {...props} name="settings-2-outline" />;

function Home({ navigation }) {
    const [nfcReader, updateNfc] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [mongoDbDataApi, setMongoDbDataApi] = React.useState('');
    const [influxDbIp, setInfluxDbIp] = React.useState('');
    const [gotData, setGotData] = React.useState(false);
    const promptRef = React.useRef();
    let tag = undefined;

    React.useEffect(() => {
        async function getStoredData() {
            try {
                let value = await AsyncStorage.getItem('mongoDbDataApi');
                if (value !== null) {
                    setMongoDbDataApi(value);
                }

                value = await AsyncStorage.getItem('influxDbIp');
                if (value !== null) {
                    setInfluxDbIp(value);
                }

                setGotData(true);
            } catch (e) {
                console.log(e);
            }
        }

        if (!gotData) {
            getStoredData();
        }
    });

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
            return navigation.navigate('TagInfo', { tagId: tag, mongoDb: mongoDbDataApi, influxDb: influxDbIp });
        }

        if (tag && option === 'newFilament') {
            return navigation.navigate('NewFilament', { tagId: tag, mongoDb: mongoDbDataApi, influxDb: influxDbIp });
        }

        if (tag && option === 'updateFilament') {
            return navigation.navigate('NewFilament', { tagId: tag, mongoDb: mongoDbDataApi, influxDb: influxDbIp });
        }
    }

    const showModal = () => {
        setVisible(true);
    };

    const SettingsAction = () => <TopNavigationAction icon={SettingsIcon} onPress={showModal} />;

    const changeSettings = async () => {
        try {
            await AsyncStorage.setItem('mongoDbDataApi', mongoDbDataApi);
            await AsyncStorage.setItem('influxDbIp', influxDbIp);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <TopNavigation title="Home" alignment="center" accessoryRight={SettingsAction} />
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
                        navigation.navigate('ShowStock', { mongoDb: mongoDbDataApi, influxDb: influxDbIp });
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
            <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                <Card disabled={true}>
                    <Text style={styles.alertText} category="h4">
                        ⚙️ Settings
                    </Text>
                    <Input
                        style={styles.input}
                        label="MongoDB Data Api"
                        value={mongoDbDataApi}
                        placeholder="https://data.mongodb-api.com/app/data-abcdef"
                        onChangeText={input => setMongoDbDataApi(input)}
                    />
                    <Input
                        style={styles.input}
                        label="InfluxDB IP + Port"
                        value={influxDbIp}
                        placeholder="http://192.168.178.110:8086"
                        onChangeText={input => setInfluxDbIp(input)}
                    />
                    <ButtonGroup style={styles.btnWrapper}>
                        <Button
                            style={styles.btn}
                            onPress={() => {
                                changeSettings();
                                setVisible(false);
                            }}>
                            Save
                        </Button>
                        <Button
                            style={styles.btn}
                            onPress={() => {
                                setVisible(false);
                            }}>
                            Dismiss
                        </Button>
                    </ButtonGroup>
                </Card>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    btn: {
        margin: 8,
        padding: 8,
        borderRadius: 8,
    },
    input: {
        marginVertical: 5,
    },
    alertText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default Home;
