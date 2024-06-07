import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assumindo que você está usando o Expo
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

export default function Entradas() {
  const navigation = useNavigation();
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

      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={[
            { label: 'Todos', value: 'todos' },
            { label: 'Entradas', value: 'entradas' },
          ]}
          placeholder={{ label: 'Selecione uma opção...', value: null }}
          style={pickerSelectStyles}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50, // Ajuste conforme necessário para a barra de status
    paddingHorizontal: 20, // Ajuste conforme necessário para o preenchimento lateral
  },
  backButton: {
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    marginBottom: 20, // Espaço entre o botão e o dropdown
  },
  dropdownContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // Para garantir que o texto não sobreponha o ícone de dropdown
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // Para garantir que o texto não sobreponha o ícone de dropdown
  },
});

