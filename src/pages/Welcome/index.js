import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import React from 'react';

import * as Animatable from 'react-native-animatable'

import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();

 return (
   <View style={styles.container}>

    <View style={styles.containerLogo}>
      <Animatable.Image
        animation="flipInY"
        source={require('../../assets/logo.png')}
        style={{width: '100%'}}
        resizeMode="contain"
      />
    </View>

    <Animatable.View delay={600} animation="fadeInUp"style={styles.containerForm}>
      <Text style={styles.title}>Monitore seus gastos aqui!</Text>
      <Text style={styles.text}>Faça o Login</Text>

      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.ButtonText}>Acessar</Text>
      </TouchableOpacity>
    </Animatable.View>

   </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#6B5536',
  },
  containerLogo:{
    flex: 2,
    backgroundColor: '#6B5536',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerForm:{
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  text:{
    flex: 0.3,
    color: '#a1a1a1'
  },
  button:{
    position: 'absotlute',
    backgroundColor: '#38a69d',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    buttom: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ButtonText:{
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  }

  
})