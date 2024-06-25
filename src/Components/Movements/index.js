import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { MotiView, AnimatePresence, MotiText } from 'moti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSquarePen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Movements({ data, onSuccess }) {
  const [showValue, setShowValue] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoData, setInfoData] = useState(null);
  const [newSaldo, setNewSaldo] = useState('');

  const dados_delete = {
    id: data.id,
    idCarteira: global.idCarteira
  };

  const handleDelete = async () => {
    setLoading(true);
    const endpoint = data.type === 1 ? 'entrada' : 'gasto';
    try {
      const response = await axios.delete(`http://localhost:8080/user/${endpoint}`, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        },
        data: dados_delete
      });
      console.log('Resposta do servidor (deletar):', response.data);
      setModalDeleteVisible(false);
      onSuccess && onSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar o gasto. Tente novamente.');
      console.error('Erro ao deletar o gasto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInfo = async () => {
    setLoading(true);
    try {
      const carteiraResponse = await axios.get(`http://localhost:8080/user/carteira/${global.userId}`, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });
      console.log('Resposta do servidor (carteira):', carteiraResponse.data);
      setInfoData(carteiraResponse.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar informações. Tente novamente.');
      console.error('Erro ao buscar informações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    const dados_edit = {
      id: data.id,
      saldo: newSaldo
    };
    try {
      const response = await axios.put('http://localhost:8080/user', dados_edit, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });
      console.log('Resposta do servidor (editar):', response.data);
      setModalEditVisible(false);
      onSuccess && onSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao editar o saldo. Tente novamente.');
      console.error('Erro ao editar o saldo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalInfoVisible) {
      handleInfo();
    }
  }, [modalInfoVisible]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => setShowValue(!showValue)}>
      <Text style={styles.date}>{data.date}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>{data.label}</Text>
        {showValue ? (
          <AnimatePresence exitBeforeEnter>
            <MotiText
              style={data.type === 1 ? styles.value : styles.expenses}
              from={{
                translateX: 100,
              }}
              animate={{
                translateX: 0,
              }}
              transition={{
                type: 'timing',
                duration: 500,
              }}
            >
              {data.type === 1 ? `R$ ${data.value}` : `R$ -${data.value}`}
            </MotiText>
          </AnimatePresence>
        ) : (
          <AnimatePresence exitBeforeEnter>
            <MotiView
              style={styles.skeleton}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing' }}
            />
          </AnimatePresence>
        )}
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setModalInfoVisible(true)}>
          <FontAwesomeIcon icon={faCircleInfo} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalEditVisible(true)}>
          <FontAwesomeIcon icon={faSquarePen} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalDeleteVisible(true)}>
          <FontAwesomeIcon icon={faTrash} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Modal de informações */}
      <Modal visible={modalInfoVisible} animationType="slide" onRequestClose={() => setModalInfoVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informações do gasto/entrada:</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : infoData ? (
              <>
                {data.type === 2 && <Text>Categoria: {infoData.categoria}</Text>}
                <Text>Data: {data.date}</Text>
                <Text>Descrição: {data.label}</Text>
                <Text>Valor: {data.type === 1 ? `R$ ${data.value}` : `R$ -${data.value}`}</Text>
                <Text>ID da Carteira: {infoData.idCarteira}</Text>
              </>
            ) : (
              <Text>Carregando...</Text>
            )}
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalInfoVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de edição */}
      <Modal visible={modalEditVisible} animationType="slide" onRequestClose={() => setModalEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar informações do gasto/entrada:</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Saldo"
              value={newSaldo}
              onChangeText={setNewSaldo}
              keyboardType="numeric"
            />
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleEdit}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalEditVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de deletar */}
      <Modal visible={modalDeleteVisible} animationType="slide" onRequestClose={() => setModalDeleteVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar exclusão:</Text>
            <Text>Tem certeza de que deseja excluir este gasto/entrada?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalDeleteVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 8,
  },
  date: {
    color: '#DADADA',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  expenses: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  skeleton: {
    marginTop: 6,
    width: 80,
    height: 10,
    backgroundColor: '#DADADA',
    borderRadius: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#C0C0C0',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 10,
  },
});