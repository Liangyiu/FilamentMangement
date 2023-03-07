import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
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
    Card,
    ButtonGroup,
} from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const TrashIcon = props => <Icon {...props} name="trash-outline" />;

function TagInfo({ navigation, route }) {
    const [id, setId] = React.useState('none');
    const [color, setColor] = React.useState('none');
    const [material, setMaterial] = React.useState('none');
    const [diameter, setDiameter] = React.useState(0);
    const [lastDried, setLastDried] = React.useState(new Date());
    const [openingDate, setOpeningDate] = React.useState(new Date());
    const [producer, setProducer] = React.useState('none');
    const [weight, setWeight] = React.useState(0);
    const [spoolSize, setSpoolSize] = React.useState(0);
    const [location, setLocation] = React.useState('none');
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        async function getData(id) {
            const data = JSON.stringify({
                collection: 'stock',
                database: 'filament-management',
                dataSource: 'Cluster0',
                filter: {
                    _id: id,
                },
            });

            const config = {
                method: 'post',
                url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/findOne',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': 'BvKSUxaAF5XdlN3ZTB1ZQoX9tMeE9pIOtezrtOzU6dWboB2HzX6obu0gcgo9u6Y2',
                },
                data: data,
            };

            try {
                const response = await axios(config);

                const tagInfo = response.data.document;

                setId(tagInfo._id);
                setColor(tagInfo.color);
                setMaterial(tagInfo.material);
                setDiameter(tagInfo.diameter);
                setSpoolSize(tagInfo.producer.spoolSize);
                setLastDried(new Date(tagInfo.lastDried));
                setOpeningDate(new Date(tagInfo.openingDate));
                setProducer(tagInfo.producer.producerName);
                setWeight(tagInfo.weight - tagInfo.producer.emptyWeight);
                setLocation(tagInfo.location);
            } catch (e) {
                console.log(e);
            }
        }

        if (id === 'none' && color === 'none' && producer === 'none') {
            getData(route.params.tagId);
        }
    });

    const navigateBack = () => {
        navigation.goBack();
    };

    const deleteTagInfo = async () => {
        const data = JSON.stringify({
            collection: 'stock',
            database: 'filament-management',
            dataSource: 'Cluster0',
            filter: {
                _id: id,
            },
        });

        const config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/deleteOne',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': 'BvKSUxaAF5XdlN3ZTB1ZQoX9tMeE9pIOtezrtOzU6dWboB2HzX6obu0gcgo9u6Y2',
            },
            data: data,
        };

        try {
            return await axios(config);
        } catch (e) {
            console.log(e);
        }
    };

    const showModal = () => {
        setVisible(true);
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    const TrashAction = () => <TopNavigationAction icon={TrashIcon} onPress={showModal} />;

    return (
        <>
            <TopNavigation
                title={'Info for filament ' + id}
                alignment="center"
                accessoryLeft={BackAction}
                accessoryRight={TrashAction}
            />
            <Divider />
            <ScrollView contentContainerStyle={styles.container} endFillColor="#222B45">
                <Layout style={styles.wrapper}>
                    <Input style={styles.input} disabled={true} label="Id" value={id} />
                    <Input style={styles.input} disabled={true} label="Color" value={color} />
                    <Input style={styles.input} disabled={true} label="Diameter" value={diameter.toString() + ' mm'} />
                    <Input style={styles.input} disabled={true} label="Material" value={material} />
                    <Input style={styles.input} disabled={true} label="Location" value={location} />
                    <Input style={styles.input} disabled={true} label="Producer" value={producer} />
                    <Input
                        style={styles.input}
                        disabled={true}
                        label="Spool size"
                        value={spoolSize.toString() + ' g'}
                    />
                    <Input
                        style={styles.input}
                        disabled={true}
                        label="Weight (w/o empty spool)"
                        value={weight.toString() + ' g'}
                    />
                    <Input style={styles.input} disabled={true} label="Opening Date" value={openingDate.toString()} />
                    <Input style={styles.input} disabled={true} label="Last Dried" value={lastDried.toString()} />
                </Layout>

                <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                    <Card disabled={true}>
                        <Text style={styles.alertText} category="h6">
                            ⛔ Confirm deletion
                        </Text>
                        <ButtonGroup style={styles.wrapper}>
                            <Button
                                style={styles.btn}
                                onPress={() => {
                                    deleteTagInfo();
                                    setVisible(false);
                                    navigateBack();
                                }}>
                                Delete
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
            </ScrollView>
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
    container: {
        flexGrow: 1,
    },
    input: {
        marginVertical: 5,
    },
    btn: {
        margin: 8,
        padding: 8,
        borderRadius: 8,
    },
    alertText: {
        marginBottom: 10,
        textAlign: 'center',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default TagInfo;
