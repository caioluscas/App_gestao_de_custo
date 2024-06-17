import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MotiView, AnimatePresence, MotiText } from 'moti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSquarePen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Movements({ data }) {
  const [showValue, setShowValue] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const handleDelete = () => {
    // Função para deletar o gasto
    // Chame a API ou execute a lógica necessária para deletar o item
    console.log('Deletar gasto:', data.id);
  };

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
            <Text style={styles.modalTitle}>Informações do gasto:</Text>
            <Text>Data: {data.date}</Text>
            <Text>Descrição: {data.label}</Text>
            <Text>Valor: {data.type === 1 ? `R$ ${data.value}` : `R$ -${data.value}`}</Text>
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
            <Text style={styles.modalTitle}>Editar informações do gasto:</Text>
            {/* Adicione aqui os campos para editar as informações */}
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalEditVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
      {/* Modal de deletar */}
      <Modal
            visible={modalDeleteVisible}
            animationType="slide"
            onRequestClose={() => setModalDeleteVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Confirmar exclusão:</Text>
                    <Text>Tem certeza de que deseja excluir este gasto?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.closeButton]}
                            onPress={() => { handleDelete(); setModalDeleteVisible(false); }}
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
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#dc3545', // Cor vermelha para o botão de fechar
  },
  cancelButton:{
    backgroundColor: '#C0C0C0', // Cor cinza para o botão de fechar no modal de cancelar
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
