import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import InfoScreen from '../screens/InfoScreen';
import TagInfo from '../screens/TagInfo';

const { Navigator, Screen } = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Home" component={Home} />
                <Screen name="Info" component={InfoScreen} />
                <Screen name="TagInfo" component={TagInfo} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
