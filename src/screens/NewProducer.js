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
    const [producerIds, setProducerIds] = React.useState([]);
    const [producerName, setProducerName] = React.useState('');
    const [emptySpoolWeight, setEmptySpoolWeight] = React.useState(0);
    const [visible, setVisible] = React.useState(false);
    const [modalText, setModalText] = React.useState('');

    React.useEffect(() => {
        async function getData() {
            const data = JSON.stringify({
                collection: 'producers',
                database: 'filament-management',
                dataSource: 'Cluster0',
                projection: {
                    _id: 1,
                },
            });

            const config = {
                method: 'post',
                url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/find',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': '***REMOVED***',
                },
                data: data,
            };

            try {
                const response = await axios(config);

                const ids = response.data.documents.map(entry => {
                    return entry._id;
                });

                setProducerIds(ids);
            } catch (e) {
                console.log(e);
            }
        }

        if (producerIds.length === 0) {
            getData();
        }
    });

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    const showModal = text => {
        setModalText(text);
        setVisible(true);
    };

    const pushProducerToDb = async producerData => {
        const data = JSON.stringify({
            collection: 'producers',
            database: 'filament-management',
            dataSource: 'Cluster0',
            document: producerData,
        });

        const config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/insertOne',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '***REMOVED***',
            },
            data: data,
        };

        try {
            return await axios(config);
        } catch (e) {
            console.log(e);
        }
    };

    const addProducer = async () => {
        const numberRegex = new RegExp('^[0-9]*$');

        if (producerName === '') {
            showModal('⛔ Please enter a producer name!');
            return;
        }

        if (producerIds.includes(producerName)) {
            showModal('⛔ Producer names must be unique!');
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

        try {
            await pushProducerToDb({
                _id: producerName,
                emptyWeight: +emptySpoolWeight,
            });
            
            const newIds = producerIds;
            newIds.push(producerName)

            setProducerIds(newIds);
            setProducerName('');
            setEmptySpoolWeight(0);

            showModal('✅ Added new producer!');
        } catch (error) {
            showModal('⛔ An error occured while pushing your data to the database!')
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
                <Button style={styles.btn} onPress={addProducer}>Add</Button>
            </Layout>

            <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                <Card disabled={true}>
                    <Text style={styles.alertText} category="h6">
                        {modalText}
                    </Text>
                    <Button style={styles.btn} onPress={() => setVisible(false)}>Dismiss</Button>
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
