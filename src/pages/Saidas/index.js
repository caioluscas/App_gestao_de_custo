import { useNavigation } from '@react-navigation/native';

export default function Saidas(){
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
     );
}