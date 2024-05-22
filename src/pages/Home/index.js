import { StyleSheet, Text, View, FlatList } from 'react-native';
import Header from '../../Components/Header';
import Balance from '../../Components/Balance';
import Movements from '../../Components/Movements';
import Actions from '../../Components/Actions';
import ModalHome from '../../Components/ModalHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';



const list = [
  {
    "id": 1,
    "label": "Avon conta",
    "value": "50.00",
    "date": "13/04/2024",
    "type": 0
  },
  {
    "id": 2,
    "label": "Steam conta",
    "value": "200.00",
    "date": "14/04/2024",
    "type": 0
  },
  {
    "id": 3,
    "label": "Enel conta",
    "value": "150.00",
    "date": "15/04/2024",
    "type": 0
  },
  {
    "id": 4,
    "label": "Mercado conta",
    "value": "44.00",
    "date": "16/04/2024",
    "type": 0
  },
  {
    "id": 5,
    "label": "Salario",
    "value": "3000.00",
    "date": "17/04/2024",
    "type": 1
  },
  {
    "id": 6,
    "label": "Pix Dona Jô",
    "value": "25980.10",
    "date": "17/04/2024",
    "type": 1
  },
  {
    "id": 7,
    "label": "Amazon",
    "value": "150.00",
    "date": "18/04/2024",
    "type": 0
  },
  {
    "id": 8,
    "label": "Netflix",
    "value": "29.90",
    "date": "19/04/2024",
    "type": 0
  },
  {
    "id": 9,
    "label": "Conta de Água",
    "value": "80.00",
    "date": "20/04/2024",
    "type": 0
  },
  {
    "id": 10,
    "label": "Venda de móveis",
    "value": "500.00",
    "date": "21/04/2024",
    "type": 1
  }

]

export default function Home() {

  const [login, setLogin] = useState('');

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const storedLogin = await AsyncStorage.getItem('login');
        console.log('Login do usuário recuperado:', storedLogin);
        if (storedLogin !== null) {
          setLogin(storedLogin);
        } else {
          console.log('Login do usuário não encontrado no AsyncStorage.');
        }
      } catch (error) {
        console.log('Erro ao recuperar o login do usuário do AsyncStorage:', error);
      }
    };

    fetchLogin();
  }, []);
  

  return (
    <View style={styles.container}>
      <Header name={login}/>

      <Balance saldo="28980.10" gastos="444"/>

      <Actions/>

      <Text style={styles.title}>Últimas movimentações</Text>
      <FlatList
        style={styles.list}
        data={list}
        keyExtractor={(item)=>String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <Movements data={item}/>}
      />

    <ModalHome/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  list:{
    marginStart: 14,
    marginEnd:14,
  }
});