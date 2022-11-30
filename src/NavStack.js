import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Home";
import InfoScreen from "./InfoScreen";
import TagInfo from './TagInfo';

const Stack = createNativeStackNavigator();

function NavStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Info" component={InfoScreen} />
            <Stack.Screen name="TagInfo" component={TagInfo} />
        </Stack.Navigator>
    );
}

export default NavStack;