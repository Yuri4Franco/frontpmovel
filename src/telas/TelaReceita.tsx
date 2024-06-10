import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

type RootStackParamList = {
  TelaHome: undefined;
  TelaReceita: {
    id: number;
    imagem: string;
    titulo: string;
    tempo: string;
    porcoes: number;
    dificuldade: string;
    ingredientes: {
      id: number;
      nome: string;
      quantidade: string;
    }[];
    utensilios: string;
    modoPreparo: string;
  };
};

const clock = require('@/assets/images/clock.png');
type TelaReceitaRouteProp = RouteProp<RootStackParamList, 'TelaReceita'>;

const TelaReceita = () => {
  const route = useRoute<TelaReceitaRouteProp>();
  const { id, imagem, titulo, tempo, porcoes, dificuldade, ingredientes, utensilios, modoPreparo } = route.params;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const AddIngredienteLista = async (ingredienteId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        'http://192.168.1.4:5000/adicionar-ingrediente',
        { ingredienteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Ingrediente adicionado à lista de compras!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar ingrediente à lista de compras');
    }
  };

  const AddReceitaPlano = async (receitaId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        'http://192.168.1.4:5000/adicionar-planejamento',
        { receitaId, data: selectedDate.toISOString().split('T')[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Receita adicionada ao planejamento!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar receita ao planejamento');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `http://192.168.1.4:5000/imagens/${imagem}` }} style={styles.image} />
      <Text style={styles.title}>{titulo}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}><Image source={clock} style={styles.ico} />{tempo}</Text>
        <Text style={styles.info}>{porcoes} porções</Text>
        <Text style={styles.info}>{dificuldade}</Text>
      </View>
      <Text style={styles.sectionTitle}>Ingredientes:</Text>
      {ingredientes.map((ingrediente) => (
        <View key={ingrediente.id} style={styles.ingredienteContainer}>
          <Text style={styles.text}>{ingrediente.nome} - {ingrediente.quantidade}</Text>
          <TouchableOpacity onPress={() => AddIngredienteLista(ingrediente.id)}>
            <Text style={styles.addButton}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Utensílios:</Text>
        <Text style={styles.text}>{utensilios}</Text>
      <Text style={styles.sectionTitle}>Modo de Preparo:</Text>
      <Text style={styles.text}>{modoPreparo}</Text>
      <Button title="Adicionar ao planejamento" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setSelectedDate(selectedDate);
              AddReceitaPlano(id);
            }
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  ico: {
    width: 13,
    height: 13,
    color: '#555',
    opacity: 0.7,
  },
  ingredienteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    color: 'blue',
  },
});

export default TelaReceita;