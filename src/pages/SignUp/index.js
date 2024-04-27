import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import SignIn from '../SignIn';
import React from 'react';

import * as Animatable from 'react-native-animatable'
import { FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const navigation = useNavigation();

 return (
   <View style={styles.container}>

    <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
      <Text style={styles.message}>Cadastre-se</Text>
    </Animatable.View>

    <Animatable.View animation="fadeInUp" style={styles.containerForm}>
      <Text style={styles.title}>Nome</Text>
      <TextInput 
      placeholder='Digite um seu nome' 
      style={styles.input}
      />

      <Text style={styles.title}>Email</Text>
      <TextInput 
      placeholder='Digite seu email' 
      style={styles.input}
      />

      <Text style={styles.title}>Telefone</Text>
      <TextInput 
      placeholder='Digite seu telefone' 
      style={styles.input}
      />

      <Text style={styles.title}>Senha</Text>
      <TextInput 
      placeholder='Crie sua senha' 
      style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.registerText}>Já possui uma conta? Faça o login!</Text>
      </TouchableOpacity>

    </Animatable.View>
    
   </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#9EBE96',
  },
  containerHeader:{
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message:{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF'
  },
  containerForm:{
    backgroundColor: '#FFF',
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%' 
  },
  title:{
    fontSize: 20,
    marginTop: 28,
  },
  input:{
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button:{
    backgroundColor: '#198754',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    margintop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
   buttonText:{
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonRegister:{
    marginTop: 14,
    alignSelf: 'center'
  },
  registerText:{
    color: '#a1a1a1'
  }
})