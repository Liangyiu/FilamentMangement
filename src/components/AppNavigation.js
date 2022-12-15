import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TagInfo from '../screens/TagInfo';
import NewProducer from '../screens/NewProducer';
import NewFilament from '../screens/NewFilament';
import UpdateFilament from '../screens/UpdateFilament';
import ShowStock from '../screens/ShowStock';

const { Navigator, Screen } = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Home" component={Home} />
                <Screen name="TagInfo" component={TagInfo} />
                <Screen name="NewProducer" component={NewProducer} />
                <Screen name="NewFilament" component={NewFilament} />
                <Screen name="UpdateFilament" component={UpdateFilament} />
                <Screen name="ShowStock" component={ShowStock} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
