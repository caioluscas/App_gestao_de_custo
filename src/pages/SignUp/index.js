import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SignUp() {
  const navigation = useNavigation();
  
  // Variáveis para os inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelefone, setNumeroTelefone] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validatePhoneNumber = (numero) => {
    const re = /^\d{10,11}$/; // Verifica se o número tem 10 ou 11 dígitos
    return re.test(numero);
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setModalMessage('Por favor, insira um e-mail válido.');
      setModalVisible(true);
      return;
    }
    if (!validatePhoneNumber(numeroTelefone)) {
      setModalMessage('Por favor, insira um número de telefone válido.');
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        email,
        numeroTelefone,
        nome,
        password,
        login
      });
      setModalMessage('Cadastro efetuado com sucesso');
      setModalVisible(true);
    } catch (error) {
      setModalMessage('Erro ao cadastrar, favor tentar novamente');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalMessage === 'Cadastro efetuado com sucesso') {
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <Button
                onPress={closeModal}
                title="Fechar"
                color="#2196F3"
              />
            </View>
          </View>
        </Modal>

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Cadastre-se</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <TextInput 
          placeholder='Digite seu nome' 
          style={styles.input}
          onChangeText={setNome}
          value={nome}
        />

        <Text style={styles.title}>Email</Text>
        <TextInput 
          placeholder='Digite seu email' 
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.title}>Telefone</Text>
        <TextInput 
          placeholder='Digite seu telefone' 
          style={styles.input}
          onChangeText={setNumeroTelefone}
          value={numeroTelefone}
        />

        <Text style={styles.title}>Login</Text>
        <TextInput 
          placeholder='Digite seu login' 
          style={styles.input}
          onChangeText={setLogin}
          value={login}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput 
          placeholder='Crie sua senha' 
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Finalizar o cadastro</Text>
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
    marginTop: 25,
  },
  input:{
    borderBottomWidth: 1,
    height: 40,
    marginTop: 5,
    marginBottom: 12,
    fontSize: 16,
  },
  button:{
    backgroundColor: '#198754',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
