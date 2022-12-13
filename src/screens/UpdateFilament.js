import React from 'react';
import axios from 'axios';
import { Text } from '@ui-kitten/components';

function UpdateFilament({ route, navigation }) {
    return (
        <>
            <Text>{route.params.tagId}</Text>
        </>
    );
}

export default UpdateFilament;
