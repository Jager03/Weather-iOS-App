import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

//Dentro del objeto devuelto por .get dame el width y ponle el nombre SCREEN-WIDTH
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState("");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);

  const icons = {
    Clouds: "cloudy",
    Rain: "rain",
    Clear: "day-sunny",
    Atmosphere: "day-haze",
    Snow: "snow",
    Drizzle: "snows",
    Thunderstorm: "lightning",
  };

  const APIkey = "eaa77a716bad80f304a9a46b4...";

  const getLocation = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }
    //Objeto devuelto por get() es un objeto con un atributo coords. De ahi guardamos latitud y longitude
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const loc = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      {
        useGoogleMpas: false,
      }
    );

    setLocation(loc[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`
    );
    const jsonWeather = await response.json();
    console.log(jsonWeather.list);

    setDays(jsonWeather.list.slice(0, 5));
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{location}</Text>
      </View>

      <ScrollView
        pagingEnabled
        horizontal
        indicatorStyle="black"
        contentContainerStyle={styles.scroll}
      >
        {days.length == 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={styles.weather}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={80}
                  color="black"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <StatusBar style="auto"></StatusBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DEAB46",
    flex: 1,
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {},
  weather: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  cityName: {
    fontSize: 50,
    fontWeight: 600,
  },
  loading: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "left",
  },
  temp: {
    fontSize: 100,
    marginTop: 10,
  },
  description: {
    fontSize: 50,
    marginTop: -30,
  },
  tinyText: {
    fontSize: 20,
    marginTop: -13,
  },
});
