import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MotiView, AnimatePresence, MotiText } from 'moti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSquarePen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Movements({ data }) {
  const [showValue, setShowValue] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

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
        <TouchableOpacity onPress={handleDelete}>
          <FontAwesomeIcon icon={faTrash} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Modal de informações */}
      <Modal visible={modalInfoVisible} animationType="slide" onRequestClose={() => setModalInfoVisible(false)}>
        <View style={styles.modalContent}>
          <Text>Informações do gasto:</Text>
          <Text>Data: {data.date}</Text>
          <Text>Descrição: {data.label}</Text>
          <Text>Valor: {data.value}</Text>
          <TouchableOpacity onPress={() => setModalInfoVisible(false)}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal de edição */}
      <Modal visible={modalEditVisible} animationType="slide" onRequestClose={() => setModalEditVisible(false)}>
        <View style={styles.modalContent}>
          <Text>Editar informações do gasto:</Text>
          {/* Adicione aqui os campos para editar as informações */}
          <TouchableOpacity onPress={() => setModalEditVisible(false)}>
            <Text>Fechar</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
