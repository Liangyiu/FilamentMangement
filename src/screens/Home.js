import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components/ui';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Home({ navigation }) {
    return (
        <>
            <TopNavigation title="Home" alignment="center" />
            <Divider />
            <Layout level="4" style={styles.wrapper}>
                <Button onPress={() => navigation.navigate('Info')}>Show Info</Button>
            </Layout>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        margin: 15,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#000000',
    },
});

export default Home;
