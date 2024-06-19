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
import { addMonths, format } from 'date-fns';

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

      const formattedMovements = listaDeMovimentacoes.map(mov => {
        if (mov.eparcela) {
          return {
            id: mov.id,
            label: `${mov.descricao} ${mov.parcelaAtual}/${mov.parcelas}`,
            value: Math.abs(mov.valorParcela).toFixed(2),
            date: format(new Date(mov.dataEntrada), 'dd/MM/yyyy'),
            type: mov.valor >= 0 ? 1 : 0
          };
        } else {
          return {
            id: mov.id,
            label: mov.descricao,
            value: Math.abs(mov.valor).toFixed(2),
            date: format(new Date(mov.dataEntrada), 'dd/MM/yyyy'),
            type: mov.valor >= 0 ? 1 : 0
          };
        }
      });

      const entradas = listaDeMovimentacoes
        .filter(item => item.valor >= 0)
        .reduce((acc, item) => acc + item.valor, 0);

      const gastos = listaDeMovimentacoes
        .filter(item => item.valor < 0)
        .reduce((acc, item) => acc + Math.abs(item.valor), 0);

      setMovements(formattedMovements);
      setBalance({
        saldo: valorDisponivel.toFixed(2), // Atualiza saldo com valorDisponivel
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
      <View style={styles.mainContent}>
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
      </View>
      <View style={styles.actionsContainer}>
        <Actions />
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
  mainContent: {
    flex: 1, // Garante que a lista de movimentações ocupe o espaço restante
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
    paddingBottom: 200, // Adiciona um padding para evitar sobreposição com os botões
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});
