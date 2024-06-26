import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const navigation = useNavigation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showIncorrectCredentials, setShowIncorrectCredentials] = useState(false);

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        login: login,
        password: password
      });

      // Armazena dados em variáveis globais
      global.userId = response.data.id;
      global.userLogin = response.data.login;
      global.userToken = response.data.token;

      // Log do ID do usuário
      console.log('ID do usuário:', global.userId);
      console.log('Token do usuário:', global.userToken);

      await AsyncStorage.setItem('login', response.data.login);
      console.log('Nome do usuário armazenado com sucesso:', response.data.login);

      setShowIncorrectCredentials(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      setShowIncorrectCredentials(true);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder='Digite um login'
          style={styles.input}
          value={login}
          onChangeText={text => setLogin(text)}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder='Digite sua senha'
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignIn}
        >
          <Text style={styles.ButtonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>

        {showIncorrectCredentials && <Text style={styles.alertText}>Credenciais incorretas</Text>}
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9EBE96',
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    backgroundColor: '#38a69d',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  registerText: {
    color: '#a1a1a1',
  },
  alertText: {
    color: '#FF0000',
    alignSelf: 'center',
  },
});
