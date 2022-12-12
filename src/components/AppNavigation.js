import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TagInfo from '../screens/TagInfo';
import NewProducer from '../screens/NewProducer';

const { Navigator, Screen } = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Home" component={Home} />
                <Screen name="TagInfo" component={TagInfo} />
                <Screen name="NewProducer" component={NewProducer} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
