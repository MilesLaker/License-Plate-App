import React, { useState, useRef, useEffect ,} from 'react';
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
import { useFocusEffect } from '@react-navigation/native';


const Stack = createStackNavigator();

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

function getDirectionFromHeading(heading) {
  if (heading >= 337.5 || heading < 22.5) return 'N';
  else if (heading >= 22.5 && heading < 67.5) return 'NE';
  else if (heading >= 67.5 && heading < 112.5) return 'E';
  else if (heading >= 112.5 && heading < 157.5) return 'SE';
  else if (heading >= 157.5 && heading < 202.5) return 'S';
  else if (heading >= 202.5 && heading < 247.5) return 'SW';
  else if (heading >= 247.5 && heading < 292.5) return 'W';
  else if (heading >= 292.5 && heading < 337.5) return 'NW';
  return '';
}

function HomeScreen({ navigation }) {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const angle = calculateHeading(data);
      setHeading(angle);
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
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(state).then((stored) => {
      if (stored) {
        setStatus(JSON.parse(stored));
      } else {
        const init = {};
        plates.forEach((p) => {
          init[p.type] = { seen: false, location: null, notes: '', heading: null };
        });
        setStatus(init);
      }
    });
  }, [state]);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const angle = calculateHeading(data);
      setHeading(angle);
    });
    Magnetometer.setUpdateInterval(33);
    return () => subscription.remove();
  }, []);

  const updatePlateData = async (type, field, value) => {
    const updated = {
      ...status,
      [type]: {
        ...status[type],
        [field]: value,
      },
    };
    setStatus(updated);
    await AsyncStorage.setItem(state, JSON.stringify(updated));
  };

  const togglePlate = async (type) => {
    const current = status[type] || { seen: false, location: null, notes: '', heading: null };
    const newSeen = !current.seen;
    let location = current.location;
    let headingDirection = current.heading;

    if (newSeen) {
      try {
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        if (locStatus === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          location = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          headingDirection = getDirectionFromHeading(heading);
        }
      } catch (err) {
        console.log("Location or heading error:", err);
      }
    } else {
      location = null;
      headingDirection = null;
    }

    const updated = {
      ...status,
      [type]: {
        ...current,
        seen: newSeen,
        location: newSeen ? location : null,
        heading: headingDirection,
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
        
          const plateStatus = status[item.type] || { seen: false, location: null, notes: '', heading: null };
          return (
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.plateButton, plateStatus.seen && styles.seenButton]}
                onPress={() => togglePlate(item.type)}
              >
                <Image source={item.image} style={styles.plateImage} />
                <Text style={styles.buttonText}>
                  {item.type} – {plateStatus.seen ? `SEEN going ${plateStatus.heading || 'N/A'}` : 'NOT SEEN'}
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
                    latitude: Number(plateStatus.location.latitude),
                    longitude: Number(plateStatus.location.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={{
                    latitude: Number(plateStatus.location.latitude),
                    longitude: Number(plateStatus.location.longitude),
                  }} title={`${item.type} - ${plateStatus.heading}`} />
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
  const stateKeys = Object.keys(STATE_PLATES);

  useEffect(() => {
    const loadMarkers = async () => {
      const newMarkers = [];
      try {
        const entries = await AsyncStorage.multiGet(stateKeys);
        entries.forEach(([state, data]) => {
          if (!data) return;
          try {
            const parsed = JSON.parse(data);
            for (const type in parsed) {
              const entry = parsed[type];
              if (
                entry &&
                entry.seen &&
                entry.location &&
                entry.location.latitude !== undefined &&
                entry.location.longitude !== undefined
              ) {
                const lat = parseFloat(entry.location.latitude);
                const lon = parseFloat(entry.location.longitude);
                if (
                  !isNaN(lat) && !isNaN(lon) &&
                  lat > -90 && lat < 90 && lon > -180 && lon < 180
                ) {
                  newMarkers.push({
                    coordinate: { latitude: lat, longitude: lon },
                    title: `${state} - ${type}`,
                  });
                }
              }
            }
          } catch (err) {}
        });
      } catch (err) {}
      setMarkers(newMarkers);
    };
    loadMarkers();
  }, []);

  const mapKey = markers.length > 0 ? 'withMarkers' : 'empty';

  return (
    <MapView
      key={mapKey}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 42.6,
        longitude: -83.3,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
    >
      {markers.map((marker, idx) => (
        <Marker key={idx} coordinate={marker.coordinate} title={marker.title} />
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
