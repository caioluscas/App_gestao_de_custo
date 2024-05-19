import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Grafico() {
  const navigation = useNavigation();
  const [options, setOptions] = useState({
    title: 'Gráfico de Pizza',
    titleTextStyle: {
      fontSize: 24, // Aumentando o tamanho da fonte do título
      bold: true,
      textAlign: 'center',
    }
  });
  const [data, setData] = useState([
    ['Linguagens', 'Quantidade'],
    ['React', 150],
    ['Angular', 120],
    ['Vue', 80],
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Gráfico</Text>
      <View style={styles.chartContainer}>
        <Chart
          width={'90%'} // Utilizando 90% da largura da tela
          height={400} // Altura fixa
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
    justifyContent: 'center', // Centralizando na tela
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
