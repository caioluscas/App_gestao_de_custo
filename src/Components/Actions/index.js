import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ScrollView
} from 'react-native';

import {AntDesign} from '@expo/vector-icons'
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Actions() {
    const navigation = useNavigation();
 return (
   <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>

    <TouchableOpacity style={styles.actionButton}>
        <View style={styles.areaButton}>
            <AntDesign name="arrowup" size={26} color="#000"/>
        </View>
        <Text style={styles.labelButton}>Entradas</Text>
        
    </TouchableOpacity>
    
    <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Saidas')}
    >
        <View style={styles.areaButton}>
            <AntDesign name="arrowdown" size={26} color="#000"/>
        </View>
        <Text style={styles.labelButton}>Saídas</Text>
    </TouchableOpacity>

    <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Grafico')}
    >
        <View style={styles.areaButton}>
            <FontAwesome6 name="pizza-slice" size={24} color="black" />
        </View>
        <Text style={styles.labelButton}>Grafico</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton}>
        <View style={styles.areaButton}>
            <AntDesign name="barcode" size={26} color="#000"/>
        </View>
        <Text style={styles.labelButton}>Boletos</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton}>
        <View style={styles.areaButton}>
            <AntDesign name="setting" size={26} color="#000"/>
        </View>
        <Text style={styles.labelButton}>Conta</Text>
    </TouchableOpacity>
    
   </ScrollView>
  );
}

const styles = StyleSheet.create({
    container:{
        maxHeight: 100,
        marginBottom: 14,
        marginTop: 18,
        paddingEnd: 14,
        paddingStart: 14,
    },
    actionButton:{
        alignItems: 'center',
        marginRight: 32,
    },
    areaButton:{
        backgroundColor: '#ecf0f1',
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    labelButton:{
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        marginBottom: 30,
    }
})