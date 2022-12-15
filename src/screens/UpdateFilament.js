import React from 'react';
import {
    Text,
    TopNavigationAction,
    TopNavigation,
    Divider,
    Icon,
    Layout,
    Modal,
    Card,
    Button,
    ButtonGroup,
    Input,
    Select,
    SelectItem,
    IndexPath,
    Datepicker,
} from '@ui-kitten/components';
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

function UpdateFilament({ navigation, route }) {
    const [visibleOne, setVisibleOne] = React.useState(false);
    const [visibleTwo, setVisibleTwo] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
    const [color, setColor] = React.useState(route.params.color);
    const [diameter, setDiameter] = React.useState(route.params.diameter);
    const [weight, setWeight] = React.useState(route.params.weight);
    const [producer, setProducer] = React.useState(route.params.producer);
    const [lastDried, setLastDried] = React.useState(route.params.lastDried);
    const [openingDate, setOpeningDate] = React.useState(route.params.openingDate);

    const BackIcon = <Icon name="arrow-back" />;

    const pushFilamentToDb = async filamentData => {
        const data = JSON.stringify({
            collection: 'stock',
            database: 'filament-management',
            dataSource: 'Cluster0',
            filter: {
                _id: route.params.tagId,
            },
            update: {
                $set: {
                    color: color,
                    diameter: +diameter,
                    weight: +weight,
                    openingDate: openingDate,
                    lastDried: lastDried,
                    producer: producer,
                },
            },
        });

        const config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/updateOne',
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

    const addFilament = async () => {
        const numberRegex = new RegExp('^[0-9]*$');

        if (color === undefined) {
            showModal('⛔ Please specify a color!', 'warning');
            return;
        }

        if (diameter === undefined) {
            showModal('⛔ Please enter a diameter!', 'warning');
            return;
        }

        if (!numberRegex.test(diameter)) {
            showModal('⛔ Please enter only numbers for the diameter!', 'warning');
            return;
        }

        if (weight === undefined) {
            showModal('⛔ Please enter a weight!', 'warning');
            return;
        }

        if (!numberRegex.test(weight)) {
            showModal('⛔ Please enter only numbers for the weight!', 'warning');
            return;
        }

        if (openingDate === undefined) {
            showModal('⛔ Please select an opening date!', 'warning');
            return;
        }
        if (lastDried === undefined) {
            showModal('⛔ Please select a date for last dried on!', 'warning');
            return;
        }

        if (producer === undefined) {
            showModal('⛔ Please select a producer!', 'warning');
            return;
        }

        try {
            await pushFilamentToDb({
                _id: route.params.tagId,
                color: color.toLowerCase(),
                diameter: +diameter,
                producer: producer,
                weight: +weight,
                lastDried: new Date(lastDried),
                openingDate: new Date(openingDate),
            });

            showModal('✅ Updated Filament!', 'success');
        } catch (error) {
            showModal('⛔ An error occured while pushing your data to the database!', 'warning');
        }
    };

    const showModal = (text, action) => {
        setModalText(text);

        switch (action) {
            case 'success': {
                setVisibleTwo(true);
                break;
            }
            case 'warning': {
                setVisibleTwo(true);
                break;
            }
        }
    };

    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    return (
        <>
            <TopNavigation title={'Update Filament'} alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <ScrollView contentContainerStyle={styles.container} endFillColor="#222B45">
                <Layout style={styles.wrapper}>
                    <Input style={styles.input} disabled={true} label="Id" value={route.params.tagId} />
                    <Input
                        style={styles.input}
                        label="Color"
                        placeholder="red"
                        value={color}
                        onChangeText={input => setColor(input)}
                    />
                    <Input
                        style={styles.input}
                        label="Diameter (in mm)"
                        placeholder="15"
                        value={diameter}
                        onChangeText={input => setDiameter(input)}
                    />
                    <Input
                        style={styles.input}
                        label="Weight (in g)"
                        placeholder="600"
                        value={weight}
                        onChangeText={input => setWeight(input)}
                    />
                    <Datepicker
                        style={styles.date}
                        label="Opened on"
                        date={openingDate}
                        onSelect={selected => setOpeningDate(selected)}
                    />
                    <Datepicker
                        style={styles.date}
                        label="Last dried on"
                        date={lastDried}
                        onSelect={selected => setLastDried(selected)}
                    />
                    <Select
                        label="Producer"
                        style={styles.select}
                        placeholder="Select a Producer"
                        value={producer._id + ' - ' + producer.emptyWeight + 'g empty spool weight'}
                        selectedIndex={selectedIndex}
                        onSelect={index => {
                            setSelectedIndex(index);
                        }}>
                        <SelectItem
                            key={producer}
                            title={producer._id + ' - ' + producer.emptyWeight + 'g empty spool weight'}
                        />
                    </Select>
                    <Button style={styles.btn} onPress={addFilament}>
                        Add
                    </Button>
                </Layout>
                <Modal
                    visible={visibleTwo}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setVisibleTwo(false)}>
                    <Card disabled={true}>
                        <Text style={styles.alertText} category="h6">
                            {modalText}
                        </Text>
                        <Button
                            style={styles.btn}
                            onPress={() => {
                                setVisibleTwo(false);
                                navigation.navigate('Home');
                            }}>
                            Back
                        </Button>
                    </Card>
                </Modal>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
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
    select: {
        marginVertical: 5,
        alignSelf: 'stretch',
    },
    date: {
        marginVertical: 5,
        alignSelf: 'stretch',
    },
});

export default UpdateFilament;
