import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';
import { format, parse } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const navigation = useNavigation();

  const fetchSaidas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      const { listaDeMovimentacoes } = response.data;

      // Filtrar e formatar os dados de saídas
      const formattedSaidas = listaDeMovimentacoes
        .filter(mov => mov.valor < 0)
        .map(mov => ({
          id: mov.id,
          label: mov.descricao,
          value: Math.abs(mov.valor).toFixed(2),
          date: format(new Date(mov.dataEntrada), 'dd/MM/yyyy')
        }))
        .filter(item => {
          if (!dataInicial && !dataFinal) return true; // Se nenhum filtro de data estiver definido, mostrar todos
          let movDate = parse(item.date, 'dd/MM/yyyy', new Date());
          let startDate = dataInicial ? parse(dataInicial, 'dd/MM/yyyy', new Date()) : new Date(0);
          let endDate = dataFinal ? parse(dataFinal, 'dd/MM/yyyy', new Date()) : new Date();
          // Usar <= para incluir a data final
          return movDate >= startDate && movDate <= endDate;
        });

      setSaidas(formattedSaidas);
    } catch (error) {
      console.log('Erro ao obter as saídas:', error);
    }
  };

  useEffect(() => {
    fetchSaidas();
  }, [dataInicial, dataFinal]);

  // Função para formatar a entrada da data com barras
  const formatarData = (input) => {
    // Remove caracteres não numéricos
    let numericValue = input.replace(/\D/g, '');
    
    // Formata a data com barras
    if (numericValue.length > 2) {
      numericValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    }
    if (numericValue.length > 5) {
      numericValue = `${numericValue.slice(0, 5)}/${numericValue.slice(5, 9)}`;
    }
    
    return numericValue;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.title}>Saídas</Text>
      </Animatable.View>

      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text>Data inicial:</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/MM/yyyy"
            value={dataInicial}
            onChangeText={(text) => setDataInicial(formatarData(text))}
          />
        </View>
        <View style={styles.filterItem}>
          <Text>Data final:</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/MM/yyyy"
            value={dataFinal}
            onChangeText={(text) => setDataFinal(formatarData(text))}
          />
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={saidas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>R$ {item.value}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    marginBottom: 20, 
  },
  containerHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#e74c3c',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
});
