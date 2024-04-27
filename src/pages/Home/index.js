import { StyleSheet, Text, View, FlatList } from 'react-native';
import Header from '../../Components/Header';
import Balance from '../../Components/Balance';
import Movements from '../../Components/Movements';
import Actions from '../../Components/Actions';




const list = [
  {
    id: 1,
    label: 'Avon conta',
    value: '50.00',
    date: '13/04/2024',
    type:0
  },
  {
    id: 2,
    label: 'Steam conta',
    value: '200.00',
    date: '14/04/2024',
    type:0
  },
  {
    id: 3,
    label: 'Enel conta',
    value: '150.00',
    date: '15/04/2024',
    type:0
  },
  {
    id: 4,
    label: 'Mercado conta',
    value: '44.00',
    date: '16/04/2024',
    type:0
  },
  {
    id: 5,
    label: 'Salario',
    value: '3000.00',
    date: '17/04/2024',
    type:1
  },
  {
    id: 6,
    label: 'Pix Dona Jô',
    value: '25980.10',
    date: '17/04/2024',
    type:1
  }

]

export default function Home() {
  return (
    <View style={styles.container}>
      <Header name="Caio Lucas"/>

      <Balance saldo="28980.10" gastos="444"/>

      <Actions/>

      <Text style={styles.title}>Últimas movimentações</Text>
      <FlatList
        style={styles.list}
        data={list}
        keyExtractor={(item)=>String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <Movements data={item}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  list:{
    marginStart: 14,
    marginEnd:14,
  }
});
