import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ModalGasto({ onSuccess }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [successPopupIsOpen, setSuccessPopupIsOpen] = useState(false);
  const [local, setLocal] = useState(''); // Certifique-se de que o nome do estado está em minúsculas
  const [descricao, setDescricao] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [valorParcela, setValorParcela] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [eparcela, setEParcela] = useState(false);

  const resetFields = () => {
    setLocal('');
    setDescricao('');
    setParcelas('');
    setValorParcela('');
    setValorGasto('');
    setEParcela(false);
  };

  const handleSalvarGasto = async () => {
    if (!local || !descricao || (eparcela && (!parcelas || !valorParcela)) || (!eparcela && !valorGasto)) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    let valorCalculado = valorGasto;
    if (eparcela) {
      valorCalculado = (parseFloat(parcelas) * parseFloat(valorParcela)).toString();
    }

    const dados = {
      idCarteira: 1,
      valor: valorCalculado,
      eparcela: eparcela,
      parcelas: eparcela ? parseInt(parcelas) : 0,
      valorParcela: eparcela ? parseFloat(valorParcela) : 0,
      descricao: descricao,
      Local: local, // Certifique-se de que o valor de "local" está sendo incluído corretamente
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

      const gastoResponse = await axios.post('http://localhost:8080/user/gasto', dados, {
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

  useEffect(() => {
    if (eparcela && parcelas && valorParcela) {
      const valorCalculado = parseFloat(parcelas) * parseFloat(valorParcela);
      setValorGasto(valorCalculado.toString());
    }
  }, [parcelas, valorParcela, eparcela]);

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
              value={local} // Certifique-se de que o valor de "local" está sendo atribuído corretamente
              onChangeText={text => setLocal(text)}
            />

            <Text style={styles.title}>Descrição:</Text>
            <TextInput
              placeholder='Digite a descrição'
              style={styles.input}
              value={descricao}
              onChangeText={text => setDescricao(text)}
            />

            {eparcela && (
              <>
                <Text style={styles.title}>Parcelas:</Text>
                <TextInput
                  placeholder='Digite o número de parcelas'
                  style={styles.input}
                  value={parcelas}
                  onChangeText={text => setParcelas(text)}
                  keyboardType='decimal-pad'
                />

                <Text style={styles.title}>Valor da Parcela:</Text>
                <TextInput
                  placeholder='Digite o valor da parcela'
                  style={styles.input}
                  value={valorParcela}
                  onChangeText={text => setValorParcela(text)}
                  keyboardType='decimal-pad'
                />
              </>
            )}

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Compra parcelada?</Text>
              <TouchableOpacity
                onPress={() => setEParcela(!eparcela)}
                style={[styles.checkbox, eparcela && styles.checkboxSelected]}
              >
                {eparcela ? <Text style={styles.checkboxText}>✔</Text> : <Text style={styles.checkboxText}>❌</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Valor do Gasto:</Text>
            <TextInput
              placeholder='Digite o valor do gasto'
              style={[styles.input, eparcela && styles.inputDisabled]}
              value={valorGasto}
              onChangeText={text => setValorGasto(text)}
              editable={!eparcela}
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
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
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
