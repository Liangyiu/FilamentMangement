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
    const [selectedIndexProducer, setSelectedIndexProducer] = React.useState(route.params.selectedIndexProducer);
    const [selectedValueProducer, setSelectedValueProducer] = React.useState(route.params.selectedValueProducer);
    const [selectedIndexDiameter, setSelectedIndexDiameter] = React.useState(route.params.selectedIndexDiameter);
    const [selectedValueDiameter, setSelectedValueDiameter] = React.useState(route.params.selectedValueDiameter);
    const [selectedIndexMaterial, setSelectedIndexMaterial] = React.useState(route.params.selectedIndexMaterial);
    const [selectedValueMaterial, setSelectedValueMaterial] = React.useState(route.params.selectedValueMaterial);
    const [selectedIndexColor, setSelectedIndexColor] = React.useState(route.params.selectedIndexColor);
    const [selectedValueColor, setSelectedValueColor] = React.useState(route.params.selectedValueColor);
    const [color, setColor] = React.useState(route.params.color);
    const [diameter, setDiameter] = React.useState(route.params.diameter);
    const [material, setMaterial] = React.useState(route.params.material);
    const [weight, setWeight] = React.useState(route.params.weight);
    const [producers, setProducers] = React.useState(route.params.producers);
    const [lastDried, setLastDried] = React.useState(new Date(route.params.lastDried));
    const [openingDate, setOpeningDate] = React.useState(new Date(route.params.openingDate));
    const [producer, setProducer] = React.useState(route.params.producer);

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
                    material: material,
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

        if (material === undefined) {
            showModal('⛔ Please enter a material!', 'warning');
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
                color: color,
                diameter: +diameter,
                material: material,
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
                setVisibleOne(true);
                break;
            }
        }
    };

    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    const renderOptionsProducer = producerData => (
        <SelectItem
            key={producerData}
            title={producerData._id + ' - ' + producerData.emptyWeight + 'g empty spool weight'}
        />
    );

    const diameterData = [1.75, 3];
    const renderOptionsDiameter = diameterData => <SelectItem key={diameterData} title={diameterData + ' mm'} />;

    const materialData = [
        'ABS Pro Flame Retardant',
        'ApolloX',
        'ASA',
        'PETG',
        'PLA',
        'TPU (92 Shore A)',
        'ABS',
        'Nylon',
        'PC',
        'Peek',
    ];
    const renderOptionsMaterial = materialData => <SelectItem key={materialData} title={materialData} />;

    const colorData = ['Black', 'White', 'Gray', 'Silver', 'Natural', 'Red', 'Green', 'Blue', 'Yellow', 'Orange'];
    const renderOptionsColor = colorData => <SelectItem key={colorData} title={colorData} />;

    return (
        <>
            <TopNavigation title={'Update Filament'} alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <ScrollView contentContainerStyle={styles.container} endFillColor="#222B45">
                <Layout style={styles.wrapper}>
                    <Input style={styles.input} disabled={true} label="Id" value={route.params.tagId} />
                    <Select
                        label="Color"
                        style={styles.select}
                        placeholder="Select a Color"
                        value={selectedValueColor}
                        selectedIndex={selectedIndexColor}
                        onSelect={index => {
                            setSelectedIndexColor(index);
                            setSelectedValueColor(colorData[index.row]);
                            setColor(colorData[index.row]);
                        }}>
                        {colorData.map(renderOptionsColor)}
                    </Select>
                    <Select
                        label="Diameter"
                        style={styles.select}
                        placeholder="Select a Diameter"
                        value={selectedValueDiameter}
                        selectedIndex={selectedIndexDiameter}
                        onSelect={index => {
                            setSelectedIndexDiameter(index);
                            setSelectedValueDiameter(diameterData[index.row] + ' mm');
                            setDiameter(diameterData[index.row]);
                        }}>
                        {diameterData.map(renderOptionsDiameter)}
                    </Select>
                    <Select
                        label="Material"
                        style={styles.select}
                        placeholder="Select a Material"
                        value={selectedValueMaterial}
                        selectedIndex={selectedIndexMaterial}
                        onSelect={index => {
                            setSelectedIndexMaterial(index);
                            setSelectedValueMaterial(materialData[index.row] + ' mm');
                            setMaterial(materialData[index.row]);
                        }}>
                        {materialData.map(renderOptionsMaterial)}
                    </Select>
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
                        value={selectedValueProducer}
                        selectedIndex={selectedIndexProducer}
                        onSelect={index => {
                            setSelectedIndexProducer(index);
                            setSelectedValueProducer(
                                producers[index.row].producerName +
                                    ' - ' +
                                    producers[index.row].emptyWeight +
                                    ' g empty spool weight' +
                                    ' - Spool size: ' +
                                    producers[index.row].spoolSize +
                                    'g',
                            );
                            setProducer(producers[index.row]);
                        }}>
                        {producers.map(renderOptionsProducer)}
                    </Select>
                    <Button style={styles.btn} onPress={addFilament}>
                        Update
                    </Button>
                </Layout>
                <Modal
                    visible={visibleOne}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setVisibleOne(false)}>
                    <Card disabled={true}>
                        <Text style={styles.alertText} category="h6">
                            {modalText}
                        </Text>
                        <Button
                            style={styles.btn}
                            onPress={() => {
                                setVisibleOne(false);
                            }}>
                            Dismiss
                        </Button>
                    </Card>
                </Modal>
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
