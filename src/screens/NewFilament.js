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

function NewFilament({ navigation, route }) {
    const [filamentIds, setFilamentIds] = React.useState([]);
    const [producers, setProducers] = React.useState([]);
    const [visibleOne, setVisibleOne] = React.useState(false);
    const [visibleTwo, setVisibleTwo] = React.useState(false);
    const [visibleThree, setVisibleThree] = React.useState(false);
    const [modalText, setModalText] = React.useState('');
    const [selectedIndexProducer, setSelectedIndexProducer] = React.useState();
    const [selectedValueProducer, setSelectedValueProducer] = React.useState('Select a Producer');
    const [selectedIndexDiameter, setSelectedIndexDiameter] = React.useState();
    const [selectedValueDiameter, setSelectedValueDiameter] = React.useState('Select a Diameter');
    const [selectedIndexMaterial, setSelectedIndexMaterial] = React.useState();
    const [selectedValueMaterial, setSelectedValueMaterial] = React.useState('Select a Material');
    const [selectedIndexColor, setSelectedIndexColor] = React.useState();
    const [selectedValueColor, setSelectedValueColor] = React.useState('Select a Color');
    const [color, setColor] = React.useState(undefined);
    const [diameter, setDiameter] = React.useState(undefined);
    const [material, setMaterial] = React.useState(undefined);
    const [weight, setWeight] = React.useState(undefined);
    const [producer, setProducer] = React.useState(undefined);
    const [lastDried, setLastDried] = React.useState(undefined);
    const [openingDate, setOpeningDate] = React.useState(undefined);

    const BackIcon = <Icon name="arrow-back" />;

    React.useEffect(() => {
        async function getDataProducers() {
            const data = JSON.stringify({
                collection: 'producers',
                database: 'filament-management',
                dataSource: 'Cluster0',
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

                setProducers(response.data.documents);
            } catch (e) {
                console.log(e);
            }
        }

        if (producers.length === 0) {
            getDataProducers();
        }

        async function getDataForId() {
            const data = JSON.stringify({
                collection: 'stock',
                database: 'filament-management',
                dataSource: 'Cluster0',
                filter: {
                    _id: route.params.tagId,
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

                const tagData = response.data.documents[0];

                setColor(tagData.color);
                setDiameter(tagData.diameter);
                setProducer(tagData.producer);
                setWeight(tagData.weight.toString());
                setOpeningDate(new Date(tagData.openingDate));
                setLastDried(new Date(tagData.lastDried));
                setMaterial(tagData.material);
            } catch (e) {
                console.log(e);
            }
        }

        async function getData() {
            const data = JSON.stringify({
                collection: 'stock',
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

                const ids = await response.data.documents.map(entry => {
                    return entry._id;
                });

                setFilamentIds(ids);

                if (ids.includes(route.params.tagId)) {
                    await getDataForId();
                    return showModal('⛔ Tag already in use, do you want to update the information?', 'updateEntry');
                }
            } catch (e) {
                console.log(e);
            }
        }

        if (filamentIds.length === 0) {
            getData();
        }
    });

    const pushFilamentToDb = async filamentData => {
        const data = JSON.stringify({
            collection: 'stock',
            database: 'filament-management',
            dataSource: 'Cluster0',
            document: filamentData,
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

        if (weight === undefined) {
            showModal('⛔ Please enter a weight!', 'warning');
            return;
        }

        if (material === undefined) {
            showModal('⛔ Please enter a material!', 'warning');
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

        if (filamentIds.includes(route.params.tagId)) {
            return showModal('⛔ Tag already in use, do you want to update the information?', 'updateEntry');
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

            const newIds = filamentIds.push(route.params.tagId);

            setFilamentIds(newIds);
            setColor(undefined);
            setWeight(undefined);
            setDiameter(undefined);
            setMaterial(undefined);
            setProducer(undefined);
            setLastDried(undefined);
            setOpeningDate(undefined);
            setSelectedIndexProducer(new IndexPath(0));
            setSelectedIndexColor(new IndexPath(0));
            setSelectedIndexDiameter(new IndexPath(0));
            setSelectedIndexMaterial(new IndexPath(0));

            showModal('✅ Added new Filament!', 'success');
        } catch (error) {
            showModal('⛔ An error occured while pushing your data to the database!', 'warning');
        }
    };

    const showModal = (text, action) => {
        setModalText(text);

        switch (action) {
            case 'updateEntry': {
                setVisibleOne(true);
                break;
            }
            case 'success': {
                setVisibleThree(true);
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

    const renderOptionsProducer = producerData => (
        <SelectItem
            key={producerData}
            title={
                producerData.producerName +
                ' - ' +
                producerData.emptyWeight +
                'g empty spool weight' +
                ' - Spool size: ' +
                producerData.spoolSize +
                'g'
            }
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
            <TopNavigation title={'New Filament'} alignment="center" accessoryLeft={BackAction} />
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
                        Add
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
                        <ButtonGroup style={styles.wrapper}>
                            <Button
                                style={styles.btn}
                                onPress={() => {
                                    setVisibleOne(false);
                                    navigation.navigate('UpdateFilament', {
                                        tagId: route.params.tagId,
                                        producers: producers,
                                        color: color,
                                        diameter: diameter,
                                        material: material,
                                        weight: weight,
                                        producer: producer,
                                        lastDried: lastDried.toString(),
                                        openingDate: openingDate.toString(),
                                        selectedIndexProducer: selectedIndexProducer,
                                        selectedValueProducer: selectedValueProducer,
                                        selectedIndexColor: selectedIndexColor,
                                        selectedValueColor: selectedValueColor,
                                        selectedIndexDiameter: selectedIndexDiameter,
                                        selectedValueDiameter: selectedValueDiameter,
                                        selectedIndexMaterial: selectedIndexMaterial,
                                        selectedValueMaterial: selectedValueMaterial,
                                    });
                                }}>
                                Update
                            </Button>
                            <Button
                                style={styles.btn}
                                onPress={() => {
                                    navigateBack();
                                }}>
                                Go back
                            </Button>
                        </ButtonGroup>
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
                        <Button style={styles.btn} onPress={() => setVisibleTwo(false)}>
                            Dismiss
                        </Button>
                    </Card>
                </Modal>
                <Modal
                    visible={visibleThree}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setVisibleThree(false)}>
                    <Card disabled={true}>
                        <Text style={styles.alertText} category="h6">
                            {modalText}
                        </Text>
                        <Button
                            style={styles.btn}
                            onPress={() => {
                                setVisibleThree(false);
                                navigateBack();
                            }}>
                            Dismiss
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

export default NewFilament;
