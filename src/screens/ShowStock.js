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
    BottomNavigation,
    BottomNavigationTab,
} from '@ui-kitten/components';
import { StyleSheet, ScrollView, View } from 'react-native';
import axios from 'axios';
import { Row, Table } from 'react-native-table-component';

function ShowStock({ navigation, route }) {
    const [stockData, setStock] = React.useState([
        {
            _id: 'dummy',
            weight: 'dummy',
            diameter: 'dummy',
            producer: {
                _id: 'dummy',
                emptyWeight: 'dummy',
            },
            openingDate: 'dummy',
            lastDried: 'dummy',
        },
    ]);
    const [selectedTab, setSelectedTab] = React.useState(1);

    const BackIcon = <Icon name="arrow-back" />;

    React.useEffect(() => {
        async function getData() {
            const data = JSON.stringify({
                collection: 'stock',
                database: 'filament-management',
                dataSource: 'Cluster0',
            });

            const config = {
                method: 'post',
                url: 'https://data.mongodb-api.com/app/data-ynvst/endpoint/data/v1/action/find',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': 'BvKSUxaAF5XdlN3ZTB1ZQoX9tMeE9pIOtezrtOzU6dWboB2HzX6obu0gcgo9u6Y2',
                },
                data: data,
            };

            try {
                const response = await axios(config);

                const stockData = response.data.documents;

                setStock(stockData);
            } catch (e) {
                console.log(e);
            }
        }

        if (stockData[0]._id === 'dummy') {
            getData();
        }
    });

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

    const tableLayout = {
        tableHead: [
            'Id',
            'Color',
            'Diameter (in mm)',
            'Weight w/o spool\n(in g)',
            'Producer',
            'Opened on',
            'Last dried on',
        ],
        widthArr: [200, 200, 200, 200, 200, 200, 200],
    };

    const switchTabContent = () => {
        if (selectedTab === 0) {
            sortData('color');
            return stockData.map(getRows);
        }

        if (selectedTab === 1) {
            sortData('default');
            return stockData.map(getRows);
        }

        if (selectedTab === 2) {
            sortData('lastDried');
            return stockData.map(getRows);
        }
    };

    const sortData = (action) => {
        if (action === 'lastDried') {
            return stockData.sort((a, b) => {
                const aTime = new Date(a.lastDried).getTime();
                const bTime = new Date(b.lastDried).getTime();
    
                if (aTime > bTime) {
                    return 1;
                }
                if (aTime < bTime) {
                    return -1;
                }
                if (aTime === bTime) {
                    return 0;
                }
            });
        }

        if (action === 'color'){
            return stockData.sort((a, b) => {
                if (a.color > b.color) {
                    return 1;
                }
                if (a.color < b.color) {
                    return -1;
                }
                if (a.color === b.color) {
                    return 0;
                }
            });
        }

        if (action === 'default') {
            return stockData.sort((a, b) => {
                if (a._id > b._id) {
                    return 1;
                }
                if (a._id < b._id) {
                    return -1;
                }
                if (a._id === b._id) {
                    return 0;
                }
            });
        }
    };

    const getRows = (data, index) => {
        const rowData = [
            data._id,
            data.color,
            data.diameter,
            data.weight - data.producer.emptyWeight,
            data.producer._id,
            new Date(data.openingDate).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                timeZone: 'Europe/Berlin',
            }),
            new Date(data.lastDried).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                timeZone: 'Europe/Berlin',
            }),
        ];

        const chooseStyle = index => {
            if (index % 2) {
                return styles.row2;
            } else {
                return styles.row;
            }
        };

        return (
            <Row
                key={index}
                data={rowData}
                widthArr={tableLayout.widthArr}
                style={chooseStyle(index)}
                textStyle={styles.text}
            />
        );
    };

    return (
        <>
            <TopNavigation title={'Stock'} alignment="center" accessoryLeft={BackAction} />
            <Divider />
            <ScrollView contentContainerStyle={styles.container} endFillColor="#222B45">
                <Layout style={styles.wrapper}>
                    <ScrollView horizontal={true}>
                        <View>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0C9' }}>
                                <Row
                                    data={tableLayout.tableHead}
                                    widthArr={tableLayout.widthArr}
                                    style={styles.header}
                                    textStyle={styles.text}
                                />
                            </Table>
                            <ScrollView style={styles.dataWrapper}>
                                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                    {switchTabContent()}
                                </Table>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </Layout>
            </ScrollView>
            <BottomNavigation
                selectedIndex={selectedTab}
                onSelect={index => {
                    sortData();
                    setSelectedTab(index);
                }}>
                <BottomNavigationTab title="Color" />
                <BottomNavigationTab title="Default" />
                <BottomNavigationTab title="Last Dried" />
            </BottomNavigation>
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
    container: { flex: 1 },
    header: {
        height: 50,
        backgroundColor: 'rgba(0,0,0, 0.25)',
    },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40 },
    row2: { height: 40, backgroundColor: 'rgba(0,0,0, 0.25)' },
});

export default ShowStock;
