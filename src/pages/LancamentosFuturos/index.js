import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function LancamentosFuturos() {
    const [futureReleases, setFutureReleases] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFutureReleases = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/future-releases'); // Substitua com a URL correta da sua API
                setFutureReleases(response.data);
            } catch (error) {
                console.log('Erro ao obter lançamentos futuros:', error);
            }
        };

        fetchFutureReleases();
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
            >
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <FlatList
                data={futureReleases}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.label}>{item.label}</Text>
                        <Text style={styles.value}>{item.value}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>Nenhum lançamento futuro encontrado.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50, 
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        marginBottom: 20, 
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
    date: {
        fontSize: 14,
        color: '#999',
    },
});
