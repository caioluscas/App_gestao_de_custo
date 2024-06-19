import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';
import { format, addMonths } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const LancamentosFuturos = () => {
  const [futureReleases, setFutureReleases] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFutureReleases();
  }, []);

  const fetchFutureReleases = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      const { listaDeMovimentacoes } = response.data;

      // Filtrar e formatar os dados de lançamentos futuros
      const formattedFutureReleases = listaDeMovimentacoes.flatMap(mov => {
        const parcelasRestantes = [];
        if (mov.eparcela) {
          for (let i = 1; i <= mov.parcelaRestante; i++) {
            parcelasRestantes.push({
              id: `${mov.id}-${i}`,
              label: `${mov.descricao} ${mov.parcelaAtual + i}/${mov.parcelas}`,
              value: Math.abs(mov.valorParcela).toFixed(2),
              date: format(addMonths(new Date(mov.dataEntrada), mov.parcelaAtual + i - 1), 'dd/MM/yyyy')
            });
          }
        }
        return parcelasRestantes;
      });

      setFutureReleases(formattedFutureReleases);
    } catch (error) {
      console.log('Erro ao obter lançamentos futuros:', error);
    }
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
        <Text style={styles.title}>Lançamentos Futuros</Text>
      </Animatable.View>

      <FlatList
        style={styles.list}
        data={futureReleases}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>R$ {item.value}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>Nenhum lançamento futuro encontrado.</Text>}
      />
    </View>
  );
};

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
});

export default LancamentosFuturos;
