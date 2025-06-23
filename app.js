import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const STATE_PLATES = {
  Michigan: [
    {
      type: "Standard",
      image: require('./assets/MichLicensePlate.jpeg')
    }
  ]
};

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LICENSE PLATE TRACKER</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tracker')}>
        <Text style={styles.buttonText}>START TRACKING</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrackerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Select a State:</Text>
      <FlatList
        data={STATES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listButton}
            onPress={() => navigation.navigate('StateDetail', { state: item })}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function StateDetailScreen({ route }) {
  const { state } = route.params;
  const plates = STATE_PLATES[state] || [];
  const [status, setStatus] = useState({});

  useEffect(() => {
    AsyncStorage.getItem(state).then((stored) => {
      if (stored) {
        setStatus(JSON.parse(stored));
      } else {
        const defaultStatus = {};
        plates.forEach((p) => (defaultStatus[p.type] = false));
        setStatus(defaultStatus);
      }
    });
  }, []);

  const togglePlate = async (type) => {
    const updated = { ...status, [type]: !status[type] };
    setStatus(updated);
    await AsyncStorage.setItem(state, JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{state} Plates:</Text>
      <FlatList
        data={plates}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.plateButton, status[item.type] && styles.seenButton]}
            onPress={() => togglePlate(item.type)}
          >
            <Image source={item.image} style={styles.plateImage} />
            <Text style={styles.buttonText}>
              {item.type} – {status[item.type] ? 'SEEN' : 'NOT SEEN'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tracker" component={TrackerScreen} />
        <Stack.Screen name="StateDetail" component={StateDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 60,
  },
  listButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  seenButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  plateButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  plateImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
});
