import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ModalEntrada() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [successPopupIsOpen, setSuccessPopupIsOpen] = useState(false);
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [refresh, setRefresh] = useState(false); // Novo estado para controlar o refresh

  const resetFields = () => {
    setLocal('');
    setDescricao('');
    setValorGasto('');
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
    setRefresh(!refresh); // Atualiza o estado de refresh
  };

  const fecharPopupSucesso = () => {
    setSuccessPopupIsOpen(false);
    fecharModal();
  };

  useEffect(() => {
    // Adicione aqui qualquer código que precise ser executado quando o componente re-renderizar
  }, [refresh]); // O useEffect será chamado sempre que o estado de refresh mudar

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
            <Text style={styles.message}>Informe os dados do gasto</Text>

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

            <Text style={styles.title}>Valor do Gasto:</Text>
            <TextInput
              placeholder='Digite o valor do gasto'
              style={styles.input}
              value={valorGasto}
              onChangeText={text => setValorGasto(text)}
              keyboardType='decimal-pad'
            />

            <TouchableOpacity style={styles.button} onPress={handleSalvarGasto}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCancelar} onPress={fecharModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: '#198754',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
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
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
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
});
