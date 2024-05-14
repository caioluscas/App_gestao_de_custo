import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import Pie from 'react-native-pie';

export default function Grafico() {
  const navigation = useNavigation();
  const data = [
    {percentage: 40, color: '#FFAB0F'},
    {percentage: 40, color: '#247AFD'},
    {percentage: 20, color: '#FE46A5'},

  ]

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text>Grafico</Text>
    
    </View>
  );
}

