import React from 'react';
import { View, StyleSheet } from 'react-native';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import {
    Button,
    Input,
    TopNavigation,
    Divider,
    TopNavigationAction,
    Icon,
    Layout,
    Modal,
    Text,
    Card,
} from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

function NewProducer({ navigation, route }) {
    const [producerName, setProducerName] = React.useState('');
    const [emptySpoolWeight, setEmptySpoolWeight] = React.useState(0);
    const [spoolSize, setSpoolSize] = React.useState(0);
    const [visible, setVisible] = React.useState(false);
    const [visibleTwo, setVisibleTwo] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [producers, setProducers] = React.useState([]);

    React.useEffect(() => {
        async function getDataProducers() {
            const data = JSON.stringify({
                collection: 'producers',
                database: 'filament-management',
                dataSource: 'Cluster0',
                projection: {
                    _id: 0,
                },
            });

            const config = {
                method: 'post',
                url: `${route.params.mongoDb}/action/find`,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': '***REMOVED***',
                },
                data: data,
            };

            try {
                const response = await axios(config);

                setProducers(response.data.documents);
            } catch (e) {
                console.log(e);
            }
        }

        if (producers.length === 0) {
            getDataProducers();
        }
    });

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    const showModal = (text, modalNum = 1) => {
        setModalText(text);
        if (modalNum === 1) setVisible(true);
        if (modalNum === 2) setVisibleTwo(true);
    };

    const pushProducerToDb = async producerData => {
        let data = JSON.stringify({
            collection: 'producers',
            database: 'filament-management',
            dataSource: 'Cluster0',
            document: producerData,
        });

        let config = {
            method: 'post',
            url: `${route.params.mongoDb}/action/insertOne`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '***REMOVED***',
            },
            data: data,
        };

        try {
            await axios(config);
        } catch (e) {
            console.log(e);
        }

        data = JSON.stringify({
            collection: 'events',
            database: 'filament-management',
            dataSource: 'Cluster0',
            document: {
                event_type: 'added-producer',
                timestamp: new Date(),
                data: producerData,
            },
        });

        config = {
            method: 'post',
            url: `${route.params.mongoDb}/action/insertOne`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '***REMOVED***',
            },
            data: data,
        };

        try {
            await axios(config);
        } catch (e) {
            console.log(e);
        }
    };

    const producerExists = producerData => {
        if (
            producers.find(
                el =>
                    el.emptyWeight === producerData.emptyWeight &&
                    el.producerName === producerData.producerName &&
                    el.spoolSize === producerData.spoolSize,
            )
        ) {
            return true;
        } else {
            return false;
        }
    };

    const addProducer = async () => {
        const numberRegex = new RegExp('^[0-9]*$');

        if (producerName === '') {
            showModal('⛔ Please enter a producer name!');
            return;
        }

        if (emptySpoolWeight === 0) {
            showModal('⛔ Please enter a weight!');
            return;
        }

        if (!numberRegex.test(emptySpoolWeight)) {
            showModal('⛔ Please enter only numbers for the weight!');
            return;
        }

        if (spoolSize === 0) {
            showModal('⛔ Please enter a spool size!');
            return;
        }

        if (!numberRegex.test(spoolSize)) {
            showModal('⛔ Please enter only numbers for the spool size!');
            return;
        }

        if (
            producerExists({
                producerName: producerName,
                emptyWeight: +emptySpoolWeight,
                spoolSize: +spoolSize,
            })
        ) {
            showModal('⛔ A producer with the data you entered already exists!');
            return;
        }

        try {
            await pushProducerToDb({
                producerName: producerName,
                emptyWeight: +emptySpoolWeight,
                spoolSize: +spoolSize,
            });

            const newProducers = producers.push({
                producerName: producerName,
                emptyWeight: +emptySpoolWeight,
                spoolSize: +spoolSize,
            });

            showModal('✅ Added new producer!', 2);
        } catch (error) {
            showModal('⛔ An error occured while pushing your data to the database!');
        }
    };

    return (
        <>
            <TopNavigation title={'New Producer'} alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <Layout style={styles.wrapper}>
                <Input
                    style={styles.input}
                    onChangeText={input => {
                        setProducerName(input);
                    }}
                    label="Producer Name"
                    placeholder="Test Producer"
                    value={producerName}
                />
                <Input
                    style={styles.input}
                    onChangeText={input => {
                        setEmptySpoolWeight(input);
                    }}
                    label="Empty spool weight (in g)"
                    placeholder="250"
                    value={emptySpoolWeight}
                />
                <Input
                    style={styles.input}
                    onChangeText={input => {
                        setSpoolSize(input);
                    }}
                    label="Spool size (in g)"
                    placeholder="250"
                    value={spoolSize}
                />
                <Button style={styles.btn} onPress={addProducer}>
                    Add
                </Button>
            </Layout>

            <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                <Card disabled={true}>
                    <Text style={styles.alertText} category="h6">
                        {modalText}
                    </Text>
                    <Button style={styles.btn} onPress={() => setVisible(false)}>
                        Dismiss
                    </Button>
                </Card>
            </Modal>
            <Modal visible={visibleTwo} backdropStyle={styles.backdrop} onBackdropPress={() => setVisibleTwo(false)}>
                <Card disabled={true}>
                    <Text style={styles.alertText} category="h6">
                        {modalText}
                    </Text>
                    <Button
                        style={styles.btn}
                        onPress={() => {
                            setVisibleTwo(false);
                            navigateBack();
                        }}>
                        Dismiss
                    </Button>
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
        paddingHorizontal: 35,
    },
    input: {
        marginVertical: 5,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertText: {
        marginBottom: 10,
    },
    btn: {
        margin: 8,
        padding: 8,
        borderRadius: 8,
    },
});

export default NewProducer;
