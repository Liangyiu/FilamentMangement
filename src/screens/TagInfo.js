import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { Button, Input, TopNavigation, Divider, TopNavigationAction, Icon, Layout } from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

function TagInfo({ navigation, route }) {
    const [id, setId] = React.useState('none');
    const [color, setColor] = React.useState('none');
    const [diameter, setDiameter] = React.useState(0);
    const [lastDried, setLastDried] = React.useState(new Date());
    const [openingDate, setOpeningDate] = React.useState(new Date());
    const [producer, setProducer] = React.useState('none');
    const [weight, setWeight] = React.useState(0);

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
                    'api-key': '***REMOVED***',
                },
                data: data,
            };

            try {
                const response = await axios(config);

                const tagInfo = response.data.document;

                setId(tagInfo._id);
                setColor(tagInfo.color);
                setDiameter(tagInfo.diameter);
                setLastDried(new Date(tagInfo.lastDried));
                setOpeningDate(new Date(tagInfo.openingDate));
                setProducer(tagInfo.producer);
                setWeight(tagInfo.weight);
            } catch (e) {
                console.log(e);
            }
        }

        if (id === 'none' && color === 'none' && producer === 'none'){
            getData(route.params.tagId);
            console.log("call");
        }
    });

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    return (
        <>
            <TopNavigation title={'Info for filament ' + id}  alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <Layout style={styles.wrapper}>
                <Input style={styles.input} label="Id" value={id} />
                <Input style={styles.input} label="Color" value={color} />
                <Input style={styles.input} label="Diameter" value={diameter.toString() + ' mm'} />
                <Input style={styles.input} label="Producer" value={producer} />
                <Input style={styles.input} label="Weight" value={weight.toString() + ' g'} />
                <Input style={styles.input} label="Opening Date" value={openingDate.toString()} />
                <Input style={styles.input} label="Last Dried" value={lastDried.toString()} />
            </Layout>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    input : {
        marginVertical: 5,
    }
});

export default TagInfo;
