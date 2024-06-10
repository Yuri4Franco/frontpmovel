import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

type Planejamento = {
  data: string;
  titulo: string;
};

const TelaPlanejamento = () => {
  const [planejamento, setPlanejamento] = useState<Planejamento[]>([]);

  useEffect(() => {
    const fetchPlanejamento = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://192.168.1.4:5000/planejamento', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlanejamento(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar planejamento');
      }
    };

    fetchPlanejamento();
  }, []);

  const getReceitasPorDia = (diaIndex: number) => {
    const hoje = new Date();
    const diaDaSemanaAtual = hoje.getDay();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(inicioSemana.getDate() - diaDaSemanaAtual + diaIndex);
    const dataString = inicioSemana.toISOString().split('T')[0];

    return planejamento.filter(item => item.data.startsWith(dataString));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Planejamento de Refeições</Text>
      {diasDaSemana.map((dia, index) => (
        <View key={index} style={styles.diaContainer}>
          <View style={styles.diaHeader}>
            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
            <Text style={styles.dia}>{dia}</Text>
          </View>
          {getReceitasPorDia(index).map((receita, idx) => (
            <View key={idx} style={styles.receitaContainer}>
              <Ionicons name="restaurant-outline" size={20} color="#4CAF50" />
              <Text style={styles.receita}>{receita.titulo}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#388E3C',
  },
  diaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderColor: '#C8E6C9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  diaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dia: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C',
    marginLeft: 10,
  },
  receitaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  receita: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 10,
  },
});

export default TelaPlanejamento;
