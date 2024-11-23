import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import MessageScreen from "../screens/MessageScreen";

const Stack =  createStackNavigator();

const StackNavigator = () => {
   return (
      <Stack.Navigator 
        screenOptions={{
            headerShown : false
        }}
      >
         <Stack.Screen name="Login" component={LoginScreen} />
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Chat" component={ChatScreen} />
         <Stack.Screen name="Message" component={MessageScreen} />
      </Stack.Navigator>
   )
}

export default StackNavigator;