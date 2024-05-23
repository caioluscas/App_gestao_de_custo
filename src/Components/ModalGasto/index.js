import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-modal';
import { PlusCircleOutlined } from '@ant-design/icons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

Modal.setAppElement('#root');

export default function ModalGasto() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [Local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [parcela, setParcela] = useState('');
  const [valorParcela, setValorParcela] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [eparcela, setEParcela] = useState(false);

  const handleSalvarGasto = () => {
    if (!Local || !descricao || (eparcela && (!parcela || !valorParcela)) || (!eparcela && !valorGasto)) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    const dados = {
      valor: eparcela ? '' : valorGasto, // Se for parcelado, o valor do gasto é vazio
      valorParcela: valorParcela,
      parcela: parcela,
      descricao: descricao,
      Local: Local,
    };
  
    axios.post('http://localhost:8080/user/gasto', dados)
      .then(response => {
        console.log('Resposta do servidor:', response);
      })
      .catch(error => {
        console.error('Erro ao enviar requisição:', error);
      });

      fecharModal();
  };

  function abrirModal() {
    setIsOpen(true);
  }

  function fecharModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (eparcela && parcela && valorParcela) {
      const valorCalculado = parseFloat(parcela) * parseFloat(valorParcela);
      setValorGasto(valorCalculado.toString());
    }
  }, [parcela, valorParcela, eparcela]);

  // function handleSalvarGasto() {
  //   // Aqui você pode adicionar a lógica para salvar os dados do gasto
  //   console.log('Local:', local);
  //   console.log('Descrição:', descricao);
  //   console.log('Parcela:', parcela);
  //   console.log('Valor da Parcela:', valorParcela);
  //   console.log('Valor do Gasto:', valorGasto);
  //   // Depois de salvar, você pode fechar o modal
  //   fecharModal();
  // }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
        <PlusCircleOutlined style={styles.addButtonIcon} />
      </TouchableOpacity>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={fecharModal}
        contentLabel="Modal de exemplo"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0 ,0, 0.8)',
            transition: 'opacity 200ms ease-in-out', // Adiciona transição de opacidade para a sobreposição
          },
          content: {
            width: '80%', // Largura da caixa do modal
            maxWidth: 400, // Largura máxima da caixa do modal
            margin: 'auto', // Centraliza a caixa do modal horizontalmente
            border: '1px solid green',
            background: '#839cff',
            borderRadius: '20px',
            padding: '5%',
            transition: 'transform 0.3s ease-in-out', // Adiciona transição de transformação para o conteúdo do modal
            transform: modalIsOpen ? 'translateY(0)' : 'translateY(100%)', // Move o modal para cima quando aberto e para baixo quando fechado
          }
        }}
      >
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Informe os dados do gasto</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Local:</Text>
          <TextInput
            placeholder='Digite o local'
            style={styles.input}
            value={Local}
            onChangeText={text => setLocal(text)}
          />

          <Text style={styles.title}>Descrição:</Text>
          <TextInput
            placeholder='Digite a descrição'
            style={styles.input}
            value={descricao}
            onChangeText={text => setDescricao(text)}
          />

          {eparcela && ( // Renderiza o campo de parcela apenas se a compra for parcelada
            <>
              <Text style={styles.title}>Parcela:</Text>
              <TextInput
                placeholder='Digite a parcela'
                style={styles.input}
                value={parcela}
                onChangeText={text => setParcela(text)}
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
              {eparcela && <Text style={styles.checkboxText}>✔</Text>} {/* Ícone de marca de seleção quando a compra for parcelada */}
              {!eparcela && <Text style={styles.checkboxText}>❌</Text>} {/* Ícone de marca de seleção vazio quando a compra não for parcelada */}
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

        </Animatable.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
   
  container: {
    flex: 100,
    justifyContent: 'center', // Centraliza os elementos verticalmente
    alignItems: 'center', // Centraliza os elementos horizontalmente
    },
  addButton: {
    position: 'fixed',
    backgroundColor: '#198754',
    borderRadius: 50,
    padding: 20,
    right: 20, // Ajusta a posição do botão para a esquerda
    top: 1000, // Ajusta a posição do botão para cima
    zIndex: 10,
  },
  addButtonIcon: {
    color: '#FFF',
    flex:20,
  },

  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF'
  },
  containerForm: {
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%' 
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#198754',
    borderRadius: 4,
    paddingVertical: 30,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonCancelar: {
    backgroundColor: '#dc3545',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxSelected: {
    backgroundColor: '#198754', // Cor de fundo quando selecionado
    borderWidth: 2, // Largura da borda quando selecionado
  },
  checkboxContainer: {
    flexDirection: 'row', // Alinha os itens horizontalmente
    alignItems: 'center', // Alinha os itens verticalmente
    marginBottom: 12, // Espaçamento inferior
  },
  checkboxLabel: {
    fontSize: 16, // Tamanho do texto
    marginRight: 10, // Espaçamento à direita do texto
  },
  checkboxText: {
    fontSize: 20, // Tamanho do texto
    color: '#FFF', // Cor do texto
    marginLeft: 5, // Espaçamento à esquerda do texto
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5', // Cor de fundo quando desabilitado
    color: '#999', // Cor do texto quando desabilitado
  },
});