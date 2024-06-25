import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModalEntrada({ onSuccess }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [successPopupIsOpen, setSuccessPopupIsOpen] = useState(false);
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [isFutureRelease, setIsFutureRelease] = useState(false); // Estado para lançamento futuro
  const [futureReleaseDate, setFutureReleaseDate] = useState(new Date()); // Estado para a data de lançamento futuro

  const resetFields = () => {
    setLocal('');
    setDescricao('');
    setValorGasto('');
    setIsFutureRelease(false);
    setFutureReleaseDate(new Date());
  };

  const handleSalvarGasto = async () => {
    if (!local || !descricao || !valorGasto) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const dados = {
      idCarteira: 1,
      valor: valorGasto,
      descricao: descricao,
      local: local,
      dataFutura: isFutureRelease ? futureReleaseDate : null // Adiciona a data futura se for um lançamento futuro
    };

    console.log('Dados a serem enviados:', dados);

    try {
      const carteiraResponse = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      console.log('Resposta do servidor (carteira):', carteiraResponse.data);

      const idCarteira = carteiraResponse.data.idCarteira;
      dados.idCarteira = idCarteira;

      const gastoResponse = await axios.post('http://localhost:8080/user/entrada', dados, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      console.log('Resposta do servidor (gasto):', gastoResponse.data);
      setSuccessPopupIsOpen(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const abrirModal = () => {
    setIsOpen(true);
  };

  const fecharModal = () => {
    setIsOpen(false);
    resetFields();
  };

  const fecharPopupSucesso = () => {
    setSuccessPopupIsOpen(false);
    fecharModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
        <PlusCircleOutlined style={styles.addButtonIcon} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalIsOpen}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.message}>Informe os dados da entrada</Text>

            <Text style={styles.title}>Local:</Text>
            <TextInput
              placeholder='Digite o local'
              style={styles.input}
              value={local}
              onChangeText={text => setLocal(text)}
            />

            <Text style={styles.title}>Descrição:</Text>
            <TextInput
              placeholder='Digite a descrição'
              style={styles.input}
              value={descricao}
              onChangeText={text => setDescricao(text)}
            />

            <Text style={styles.title}>Valor da entrada:</Text>
            <TextInput
              placeholder='Digite o valor da entrada'
              style={styles.input}
              value={valorGasto}
              onChangeText={text => setValorGasto(text)}
              keyboardType='decimal-pad'
            />

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Lançamento futuro?</Text>
              <TouchableOpacity
                onPress={() => setIsFutureRelease(!isFutureRelease)}
                style={[styles.checkbox, isFutureRelease && styles.checkboxSelected]}
              >
                {isFutureRelease ? <Text style={styles.checkboxText}>✔</Text> : <Text style={styles.checkboxText}>❌</Text>}
              </TouchableOpacity>
            </View>

            {isFutureRelease && (
                <DatePicker
                  selected={futureReleaseDate}
                  onChange={date => setFutureReleaseDate(date)}
                  minDate={new Date()} // Seleciona apenas datas a partir de hoje
                  dateFormat='dd/MM/yyyy'
                  style={styles.datePicker}
                />
            )}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSalvarGasto}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonCancelar} onPress={fecharModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={successPopupIsOpen}
        onRequestClose={fecharPopupSucesso}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.successMessage}>Cadastrado com sucesso!</Text>
            <TouchableOpacity style={styles.successButton} onPress={fecharPopupSucesso}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#198754',
    borderRadius: 50,
    padding: 20,
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonIcon: {
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#198754',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonCancelar: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '45%',
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: '#198754',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#198754',
  },
  checkboxText: {
    color: '#FFF',
    fontSize: 14,
  },
  datePicker: {
    marginTop: 10,
    width: '100%',
  },
});