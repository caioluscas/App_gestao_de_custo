import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const navigation = useNavigation();

  const fetchEntradas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      const { listaDeMovimentacoes } = response.data;

      // Filtrar e formatar os dados de entradas
      const formattedEntradas = listaDeMovimentacoes
        .filter(mov => mov.valor > 0)
        .map(mov => ({
          id: mov.id,
          label: mov.descricao,
          value: mov.valor.toFixed(2),
          date: format(new Date(mov.dataEntrada), 'dd/MM/yyyy')
        }));

      setEntradas(formattedEntradas);
    } catch (error) {
      console.log('Erro ao obter as entradas:', error);
    }
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
        <Text style={styles.title}>Entradas</Text>
      </Animatable.View>

      <FlatList
        style={styles.list}
        data={entradas}
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
    color: '#2ecc71',
  },
});
