import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

const LancamentosFuturos = () => {
  const [futureReleases, setFutureReleases] = useState([]);
  const [days, setDays] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchFutureReleases();
  }, [days]);

  const fetchFutureReleases = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/carteiraFuturo/${global.userId}/dias=${days}`, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      const releases = response.data;
      console.log('Resposta da API:', JSON.stringify(releases, null, 2));

      let releasesArray = [];

      if (releases.listaDeMovimentacoes && Array.isArray(releases.listaDeMovimentacoes)) {
        releasesArray = releases.listaDeMovimentacoes;
      } else {
        console.log('Erro: Estrutura inesperada de resposta da API');
      }

      const formattedReleases = releasesArray.map(release => ({
        id: release.id,
        label: release.descricao,
        value: Math.abs(release.valor).toFixed(2),
        date: format(new Date(release.dataEntrada), 'dd/MM/yyyy'),
        type: release.valor >= 0 ? 1 : 2 // Considerando que valores positivos são entradas e negativos são saídas
      }));

      setFutureReleases(formattedReleases);
    } catch (error) {
      console.log('Erro ao obter lançamentos futuros:', error);
    }
  };

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.containerHeader}>
        <Text style={styles.title}>Lançamentos Futuros</Text>
        <View style={styles.daysContainer}>
          <Text style={styles.daysLabel}>Informe os dias:</Text>
          <TextInput
            style={styles.daysInput}
            keyboardType="numeric"
            onChangeText={setDays}
            value={days}
            placeholder="inserir"
          />
        </View>
      </View>

      <FlatList
        data={futureReleases}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={item.type === 1 ? styles.valueEntry : styles.valueExit}>R$ {item.type === 1 ? item.value : `-${item.value}`}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text>Nenhum lançamento futuro encontrado.</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20
  },
  backButton: {
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    marginBottom: 20
  },
  containerHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  daysLabel: {
    fontSize: 16,
    marginRight: 5
  },
  daysInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  list: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  date: {
    fontSize: 16,
    color: '#666'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  valueEntry: {
    fontSize: 16,
    color: '#2ecc71' // Verde para entradas
  },
  valueExit: {
    fontSize: 16,
    color: '#e74c3c' // Vermelho para saídas
  }
});

export default LancamentosFuturos;
