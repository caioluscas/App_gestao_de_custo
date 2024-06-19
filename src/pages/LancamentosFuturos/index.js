import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { format, addMonths } from 'date-fns';

const LancamentosFuturos = () => {
  const [futureReleases, setFutureReleases] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFutureReleases();
  }, []);

  const fetchFutureReleases = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/carteira/'+ global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken}
      });

      const formattedFutureReleases = response.data.flatMap(mov => {
        const parcelasRestantes = [];
        for (let i = 1; i <= mov.parcelaRestante; i++) {
          parcelasRestantes.push({
            id: `${mov.id}-${i}`,
            label: `${mov.descricao} ${mov.parcelaAtual + i}/${mov.parcelas}`,
            value: Math.abs(mov.valorParcela).toFixed(2),
            date: format(addMonths(new Date(mov.dataEntrada), i), 'dd/MM/yyyy')
          });
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
      <FlatList
        data={futureReleases}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
});

export default LancamentosFuturos;
