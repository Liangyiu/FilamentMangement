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
    const [mongoDbDataApiKey, setMongoDbDataApiKey] = React.useState('');
    const [influxDbIp, setInfluxDbIp] = React.useState('');
    const [influxDbToken, setInfluxDbToken] = React.useState('');
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

                value = await AsyncStorage.getItem('mongoDbDataApiKey');
                if (value !== null) {
                    setMongoDbDataApiKey(value);
                }

                value = await AsyncStorage.getItem('influxDbIp');
                if (value !== null) {
                    setInfluxDbIp(value);
                }

                value = await AsyncStorage.getItem('influxDbToken');
                if (value !== null) {
                    setInfluxDbToken(value);
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
            return navigation.navigate('TagInfo', {
                tagId: tag,
                mongoDb: mongoDbDataApi,
                mongoDbApiKey: mongoDbDataApiKey,
                influxDb: influxDbIp,
                influxDbToken: influxDbToken,
            });
        }

        if (tag && option === 'newFilament') {
            return navigation.navigate('NewFilament', {
                tagId: tag,
                mongoDb: mongoDbDataApi,
                mongoDbApiKey: mongoDbDataApiKey,
                influxDb: influxDbIp,
                influxDbToken: influxDbToken,
            });
        }

        if (tag && option === 'updateFilament') {
            return navigation.navigate('NewFilament', {
                tagId: tag,
                mongoDb: mongoDbDataApi,
                mongoDbApiKey: mongoDbDataApiKey,
                influxDb: influxDbIp,
                influxDbToken: influxDbToken,
            });
        }
    }

    const showModal = () => {
        setVisible(true);
    };

    const SettingsAction = () => <TopNavigationAction icon={SettingsIcon} onPress={showModal} />;

    const changeSettings = async () => {
        try {
            await AsyncStorage.setItem('mongoDbDataApi', mongoDbDataApi);
            await AsyncStorage.setItem('mongoDbDataApiKey', mongoDbDataApiKey);
            await AsyncStorage.setItem('influxDbIp', influxDbIp);
            await AsyncStorage.setItem('influxDbToken', influxDbToken);
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
                        navigation.navigate('ShowStock', {
                            mongoDb: mongoDbDataApi,
                            mongoDbApiKey: mongoDbDataApiKey,
                            influxDb: influxDbIp,
                            influxDbToken: influxDbToken,
                        });
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
                        navigation.navigate('NewProducer', {
                            mongoDb: mongoDbDataApi,
                            mongoDbApiKey: mongoDbDataApiKey,
                            influxDb: influxDbIp,
                            influxDbToken: influxDbToken,
                        });
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
                        label="MongoDB Data Api Endpoint"
                        value={mongoDbDataApi}
                        placeholder="https://data.mongodb-api.com/app/data-abcdef"
                        onChangeText={input => setMongoDbDataApi(input)}
                    />
                    <Input
                        style={styles.input}
                        label="MongoDB Data Api Key"
                        value={mongoDbDataApiKey}
                        placeholder="abcdf12345"
                        onChangeText={input => setMongoDbDataApiKey(input)}
                    />
                    <Input
                        style={styles.input}
                        label="InfluxDB IP + Port(if needed)"
                        value={influxDbIp}
                        placeholder="http://192.168.178.110:8086"
                        onChangeText={input => setInfluxDbIp(input)}
                    />
                    <Input
                        style={styles.input}
                        label="InfluxDB Api Token"
                        value={influxDbToken}
                        placeholder="testtoken123"
                        onChangeText={input => setInfluxDbToken(input)}
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
