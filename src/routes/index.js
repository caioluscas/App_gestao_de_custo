import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../pages/Welcome";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import Grafico from "../pages/Grafico";
import Perfil from "../pages/Perfil";
import ModalEntrada from "../Components/ModalEntrada";


const Stack = createNativeStackNavigator();


export default function Routes() {

  return (
    <Stack.Navigator>
        <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="Grafico"
        component={Grafico}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={{headerShown: false}}
        />

        
    </Stack.Navigator>
  )
}