
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import LensScreen from "../../screens/Devices/Lens";
import PlacesScreen from "../../screens/Places/Places";
import DevicesScreen from "../../screens/Devices/Devices";
import ProfileScreen from "../../screens/Profile/Profile";
import HomeScreen from "../../screens/Auth/Home";


const TabNavigator = createBottomTabNavigator({
    Profile : ProfileScreen,
    Lens: LensScreen,
    Connections: HomeScreen,
    Places: PlacesScreen,
  });
  
export default createAppContainer(TabNavigator);