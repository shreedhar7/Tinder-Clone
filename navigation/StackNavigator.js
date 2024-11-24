import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import MessageScreen from "../screens/MessageScreen";
import useAuth from "../hooks/useAuth";
import ModalScreen from "../screens/ModalScreen";
import MatchScreen from "../screens/MatchScreen";

const Stack =  createStackNavigator();

const StackNavigator = () => {
   const {user} = useAuth();
   return (
      <Stack.Navigator 
        screenOptions={{
            headerShown : false
        }}
      >
         {
            user ? (
               <>
                  <Stack.Group>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Chat" component={ChatScreen} />
                  <Stack.Screen name="Message" component={MessageScreen} />
                  </Stack.Group>
                  <Stack.Group screenOptions={{
                     presentation : "modal",
                     ...TransitionPresets.ModalPresentationIOS
                  }}>
                    <Stack.Screen name ="Modal" component={ModalScreen} />
                  </Stack.Group>
                  <Stack.Group screenOptions={{
                     presentation : "transparentModal",
                  }}>
                     <Stack.Screen name="Match" component={MatchScreen} />
                  </Stack.Group>
               </>
            ) : (
               <Stack.Screen name="Login" component={LoginScreen} />
            )
         }
         
         
      </Stack.Navigator>
   )
}

export default StackNavigator;