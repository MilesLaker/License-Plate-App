import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Animated, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

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
  Alabama: [{ type: "Standard", image: require('./assets/AlabamaPlate.jpeg') }],
  Alaska: [{ type: "Standard", image: require('./assets/AlaskaPlate.jpeg') }],
  Arizona: [{ type: "Standard", image: require('./assets/ArizonaPlate.jpeg') }],
  Arkansas: [{ type: "Standard", image: require('./assets/ArkansasPlate.jpeg') }],
  California: [{ type: "Standard", image: require('./assets/CaliforniaPlate.jpeg') }],
  Colorado: [{ type: "Standard", image: require('./assets/ColoradoPlate.jpeg') }],
  Connecticut: [{ type: "Standard", image: require('./assets/ConnecticutPlate.jpeg') }],
  Delaware: [{ type: "Standard", image: require('./assets/DelawarePlate.jpeg') }],
  Florida: [{ type: "Standard", image: require('./assets/FloridaPlate.jpeg') }],
  Georgia: [{ type: "Standard", image: require('./assets/GeorgiaPlate.jpeg') }],
  Hawaii: [{ type: "Standard", image: require('./assets/HawaiiPlate.jpeg') }],
  Idaho: [{ type: "Standard", image: require('./assets/IdahoPlate.jpeg') }],
  Illinois: [{ type: "Standard", image: require('./assets/IllinoisPlate.jpeg') }],
  Indiana: [{ type: "Standard", image: require('./assets/IndianaPlate.jpeg') }],
  Iowa: [{ type: "Standard", image: require('./assets/IowaPlate.jpeg') }],
  Kansas: [{ type: "Standard", image: require('./assets/KansasPlate.jpeg') }],
  Kentucky: [{ type: "Standard", image: require('./assets/KentuckyPlate.jpeg') }],
  Louisiana: [{ type: "Standard", image: require('./assets/LouisianaPlate.jpeg') }],
  Maine: [{ type: "Standard", image: require('./assets/MainePlate.jpeg') }],
  Maryland: [{ type: "Standard", image: require('./assets/MarylandPlate.jpeg') }],
  Massachusetts: [{ type: "Standard", image: require('./assets/MassachusettsPlate.jpeg') }],
  Michigan: [{ type: "Standard", image: require('./assets/MichiganPlate.jpeg') }],
  Minnesota: [{ type: "Standard", image: require('./assets/MinnesotaPlate.jpeg') }],
  Mississippi: [{ type: "Standard", image: require('./assets/MississippiPlate.jpeg') }],
  Missouri: [{ type: "Standard", image: require('./assets/MissouriPlate.jpeg') }],
  Montana: [{ type: "Standard", image: require('./assets/MontanaPlate.jpeg') }],
  Nebraska: [{ type: "Standard", image: require('./assets/NebraskaPlate.jpeg') }],
  Nevada: [{ type: "Standard", image: require('./assets/NevadaPlate.jpeg') }],
  "New Hampshire": [{ type: "Standard", image: require('./assets/NewHampshirePlate.jpeg') }],
  "New Jersey": [{ type: "Standard", image: require('./assets/NewJerseyPlate.jpeg') }],
  "New Mexico": [{ type: "Standard", image: require('./assets/NewMexicoPlate.jpeg') }],
  "New York": [{ type: "Standard", image: require('./assets/NewYorkPlate.jpeg') }],
  "North Carolina": [{ type: "Standard", image: require('./assets/NorthCarolinaPlate.jpeg') }],
  "North Dakota": [{ type: "Standard", image: require('./assets/NorthDakotaPlate.jpeg') }],
  Ohio: [{ type: "Standard", image: require('./assets/OhioPlate.jpeg') }],
  Oklahoma: [{ type: "Standard", image: require('./assets/OklahomaPlate.jpeg') }],
  Oregon: [{ type: "Standard", image: require('./assets/OregonPlate.jpeg') }],
  Pennsylvania: [{ type: "Standard", image: require('./assets/PennsylvaniaPlate.jpeg') }],
  "Rhode Island": [{ type: "Standard", image: require('./assets/RhodeIslandPlate.jpeg') }],
  "South Carolina": [{ type: "Standard", image: require('./assets/SouthCarolinaPlate.jpeg') }],
  "South Dakota": [{ type: "Standard", image: require('./assets/SouthDakotaPlate.jpeg') }],
  Tennessee: [{ type: "Standard", image: require('./assets/TennesseePlate.jpeg') }],
  Texas: [{ type: "Standard", image: require('./assets/TexasPlate.jpeg') }],
  Utah: [{ type: "Standard", image: require('./assets/UtahPlate.jpeg') }],
  Vermont: [{ type: "Standard", image: require('./assets/VermontPlate.jpeg') }],
  Virginia: [{ type: "Standard", image: require('./assets/VirginiaPlate.jpeg') }],
  Washington: [{ type: "Standard", image: require('./assets/WashingtonPlate.jpeg') }],
  "West Virginia": [{ type: "Standard", image: require('./assets/WestVirginiaPlate.jpeg') }],
  Wisconsin: [{ type: "Standard", image: require('./assets/WisconsinPlate.jpeg') }],
  Wyoming: [{ type: "Standard", image: require('./assets/WyomingPlate.jpeg') }]
};

function calculateHeading({ x, y }) {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return Math.round(angle);
}
 
function HomeScreen({ navigation }) {
  const [heading, setHeading] = useState(0);
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const angle = calculateHeading(data);
      setHeading(angle);
      Animated.timing(rotateAnim, {
        toValue: angle,
        duration: 33,
        useNativeDriver: true,
      }).start();
    });
    Magnetometer.setUpdateInterval(33);
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LICENSE PLATE TRACKER</Text>
      <View style={styles.compassContainerCentered}>
        <Animated.Image
          source={require('./assets/Compass.png')}
          style={[styles.compassImageLarge, { transform: [{ rotate: `${360 - heading}deg` }] }]}
        />
        <Text style={styles.headingText}>{heading}°</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tracker')}>
        <Text style={styles.buttonText}>START TRACKING</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FullMap')}>
        <Text style={styles.buttonText}>VIEW ALL TAGS</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrackerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Select a State:</Text>
      <FlatList
        data={Object.keys(STATE_PLATES)}
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
        const init = {};
        plates.forEach((p) => init[p.type] = { seen: false, location: null, notes: '' });
        setStatus(init);
      }
    });
  }, []);
const updatePlateData = async (type, field, value) => {
  const updated = {
    ...status,
    [type]: {
      ...status[type],
      [field]: value
    }
  };
  setStatus(updated);
  await AsyncStorage.setItem(state, JSON.stringify(updated));
};
 const togglePlate = async (type) => {
  const current = status[type] || { seen: false, location: null, notes: '' };
  const newSeen = !current.seen;
  let location = current.location;

  if (newSeen) {
    try {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      }
    } catch (err) {
      console.log("Location error:", err);
    }
  }

  const updated = {
    ...status,
    [type]: {
      ...current,
      seen: newSeen,
      location: newSeen ? location : null,
    },
  };

  setStatus(updated);
  await AsyncStorage.setItem(state, JSON.stringify(updated));
};

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{state} Plates:</Text>
      <FlatList
        data={plates}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          const plateStatus = status[item.type] || { seen: false, location: null, notes: '' };
          return (
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.plateButton, plateStatus.seen && styles.seenButton]}
                onPress={() => togglePlate(item.type)}
              >
                <Image source={item.image} style={styles.plateImage} />
                <Text style={styles.buttonText}>
                  {item.type} – {plateStatus.seen ? 'SEEN' : 'NOT SEEN'}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.notesInput}
                placeholder="Add notes..."
                value={plateStatus.notes || ''}
                onChangeText={(text) => updatePlateData(item.type, 'notes', text)}
                multiline
              />
              {plateStatus.seen && plateStatus.location && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: plateStatus.location.latitude,
                    longitude: plateStatus.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={plateStatus.location} title={item.type} />
                </MapView>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

function FullMapScreen() {

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadMarkers = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const allMarkers = [];
      entries.forEach(([state, data]) => {
        try {
          const parsed = JSON.parse(data);
          for (const type in parsed) {
            const entry = parsed[type];
            if (
              entry &&
              entry.seen &&
              entry.location &&
              typeof entry.location.latitude === 'number' &&
              typeof entry.location.longitude === 'number'
            ) {
              allMarkers.push({
                coordinate: entry.location,
                title: `${state} - ${type}`,
              });
            }
          }
        } catch (e) {
          console.warn(`Error parsing data for state: ${state}`, e);
        }
      });
      setMarkers(allMarkers);
    };
    loadMarkers();
  }, []);

  return (
    <MapView style={styles.fullMap} initialRegion={{
      latitude: 39.8283,
      longitude: -98.5795,
      latitudeDelta: 50,
      longitudeDelta: 50,
    }}>
      {markers.map((marker, index) => (
        <Marker key={index} coordinate={marker.coordinate} title={marker.title} />
      ))}
    </MapView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tracker" component={TrackerScreen} />
        <Stack.Screen name="StateDetail" component={StateDetailScreen} />
        <Stack.Screen name="FullMap" component={FullMapScreen} />
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
  compassContainerCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  compassImageLarge: {
    width: 200,
    height: 200,
  },
  headingText: {
    marginTop: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
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
  notesInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: '#f9f9f9',
  },
  map: {
    width: '100%',
    height: 150,
    marginTop: 10,
  },
  fullMap: {
    flex: 1,
  },
});

