import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

export default function Grafico() {
  const navigation = useNavigation();
  const [options, setOptions] = useState({
    title: 'Gastos por Categoria',
    titleTextStyle: {
      fontSize: 24,
      bold: true,
      textAlign: 'center',
    }
  });
  const [data, setData] = useState([
    ['Categoria', 'Valor']
  ]);
  const [dataInicio, setDataInicial] = useState('');
  const [dataFim, setDataFinal] = useState('');

  useEffect(() => {
    if (dataInicio && dataFim) {
      fetchGastos();
    }
  }, [dataInicio, dataFim]);

  const dados = {
    carteiraId: global.userId,
    dataInicio: dataInicio,
    dataFim: dataFim
  }


  const fetchGastos = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user/gastos', dados, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      


      const { ENTRETERIMENTO, TRANSPORTE, ALIMENTAÇÃO, OUTROS } = response.data;

      const formattedData = [
        ['Categoria', 'Valor'],
        ['Entretenimento', Math.abs(ENTRETERIMENTO)],
        ['Transporte', Math.abs(TRANSPORTE)],
        ['Alimentação', Math.abs(ALIMENTAÇÃO)],
        ['Outros', Math.abs(OUTROS)]
      ];

      setData(formattedData);
    } catch (error) {
      console.log('Erro ao obter gastos:', error);
    }
  };

  // Função para formatar a entrada da data com barras
  const formatarData = (input) => {
    let numericValue = input.replace(/\D/g, '');
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
        <Text style={styles.title}>Grafico</Text>
      </Animatable.View>
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text>Data inicial:</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/MM/yyyy"
            value={dataInicio}
            onChangeText={(text) => setDataInicial(formatarData(text))}
          />
        </View>
        <View style={styles.filterItem}>
          <Text>Data final:</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/MM/yyyy"
            value={dataFim}
            onChangeText={(text) => setDataFinal(formatarData(text))}
          />
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Chart
          width={'90%'}
          height={400}
          chartType="PieChart"
          data={data}
          options={options}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  containerHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '90%',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
