import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Header from '../../Components/Header';
import Balance from '../../Components/Balance';
import Movements from '../../Components/Movements';
import Actions from '../../Components/Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ModalGasto from '../../Components/ModalGasto';
import ModalEntrada from '../../Components/ModalEntrada';
import { format } from 'date-fns';

export default function Home() {
  const [login, setLogin] = useState('');
  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState({ saldo: '0', gastos: '0', totalGastos: '0' });

  const fetchMovements = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      const { valorDisponivel, listaDeMovimentacoes } = response.data;

      // Transformar os dados de movimentações
      const formattedMovements = listaDeMovimentacoes.map(mov => ({
        id: mov.id,
        label: mov.descricao,
        value: Math.abs(mov.valor).toFixed(2),
        date: format(new Date(mov.dataEntrada), 'dd/MM/yyyy'), // Formatar a data
        type: mov.valor >= 0 ? 1 : 0  // Assumindo que valores positivos são entradas e negativos são gastos
      }));

      const entradas = listaDeMovimentacoes
        .filter(item => item.valor >= 0)
        .reduce((acc, item) => acc + item.valor, 0);

      const gastos = listaDeMovimentacoes
        .filter(item => item.valor < 0)
        .reduce((acc, item) => acc + Math.abs(item.valor), 0);

      setMovements(formattedMovements);
      setBalance({
        saldo: (entradas - gastos).toFixed(2),
        gastos: entradas.toFixed(2),
        totalGastos: gastos.toFixed(2)
      });
    } catch (error) {
      console.log('Erro ao obter os movimentos:', error);
    }
  };

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
    fetchMovements();
  }, []);

  return (
    <View style={styles.container}>
      <Header name={login} />

      <Balance saldo={balance.saldo} gastos={balance.gastos} totalGastos={balance.totalGastos} />

      <Actions />

      <View style={styles.header}>
        <Text style={styles.title}>Todas as movimentações</Text>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={movements}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Movements data={item} />}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <ModalEntrada onSuccess={fetchMovements} />
        </View>
        <View style={styles.buttonWrapper}>
          <ModalGasto onSuccess={fetchMovements} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  list: {
    marginStart: 14,
    marginEnd: 14,
  },
  listContent: {
    paddingBottom: 150, // Adiciona um padding para evitar sobreposição com os botões
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});
