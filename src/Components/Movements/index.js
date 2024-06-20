import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MotiView, AnimatePresence, MotiText } from 'moti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSquarePen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Movements({ data }) {
  const [showValue, setShowValue] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [successPopupIsOpen, setSuccessPopupIsOpen] = useState(false);
  const [infoData, setInfoData] = useState(null);

  const dados_delete = {
    id: data.id,
    idCarteira: global.idCarteira
  };

  const handleDelete = async () => {
    if(data.type === 1){
      try {
        const response = await axios.delete('http://localhost:8080/user/entrada', {
          headers: {
            'Authorization': 'Bearer ' + global.userToken
          },
          data: dados_delete
        });
        console.log('Resposta do servidor (deletar):', response.data);
        setModalDeleteVisible(false);
      } catch (error) {
        console.error('Erro ao deletar o gasto:', error);
        console.error('CarteiraId: ', global.idCarteira);
      }
    }else{
      try {
        const response = await axios.delete('http://localhost:8080/user/gasto', {
          headers: {
            'Authorization': 'Bearer ' + global.userToken
          },
          data: dados_delete
        });
        console.log('Resposta do servidor (deletar):', response.data);
        setModalDeleteVisible(false);
      } catch (error) {
        console.error('Erro ao deletar o gasto:', error);
        console.error('CarteiraId: ', global.idCarteira);
      }
    }
  };

  const handleInfo = async () => {
    try {
      const carteiraResponse = await axios.get('http://localhost:8080/user/carteira/' + global.userId, {
        headers: {
          'Authorization': 'Bearer ' + global.userToken
        }
      });

      console.log('Resposta do servidor (carteira):', carteiraResponse.data);
      setInfoData(carteiraResponse.data);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const handleSave = async (dados) => {
    try {
      global.idCarteira = dados.idCarteira;
      dados.idCarteira = global.idCarteira;

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
            {infoData ? (
              <>
                <Text>Categoria: {infoData.categoria}</Text>
                <Text>Data: {data.date}</Text>
                <Text>Descrição: {data.label}</Text>
                <Text>Valor: {data.type === 1 ? `R$ ${data.value}` : `R$ -${data.value}`}</Text>
                <Text>ID da Carteira: {infoData.idCarteira}</Text>
                <Text>Saldo: R$ {infoData.saldo}</Text>
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
            {/* Adicione aqui os campos para editar as informações */}
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
    backgroundColor: '#dc3545', // Cor vermelha para o botão de excluir
  },
  cancelButton: {
    backgroundColor: '#C0C0C0', // Cor cinza para o botão de cancelar
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
