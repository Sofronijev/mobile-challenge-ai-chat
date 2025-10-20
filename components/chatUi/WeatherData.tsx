import { useColors } from '@/hooks/useColors';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';

type Props = {
  data: { location: string; temperature: number };
};

const fahrenheitToCelsius = (temp: number): number => {
  return Math.round((temp - 32) * (5 / 9));
};

const getWeatherStatus = (tempF: number): string => {
  if (tempF <= 32) return 'Snowing ❄️';
  if (tempF <= 50) return 'Cloudy ☁️';
  if (tempF <= 68) return 'Cool 🌤️';
  if (tempF <= 86) return 'Sunny ☀️';
  return 'Hot 🔥';
};

const WeatherData: FC<Props> = ({ data }) => {
  const [isFahrenheit, setIsFahrenheit] = useState(true);
  const tColors = useColors();

  if (!data) {
    return null;
  }

  const changeUnit = () => {
    setIsFahrenheit(prev => !prev);
  };

  const { location, temperature } = data;

  const displayTemp = isFahrenheit
    ? temperature
    : fahrenheitToCelsius(temperature);

  return (
    <View>
      <View style={styles.row}>
        <Text
          style={styles.temp}
        >{`${displayTemp}° ${isFahrenheit ? 'F' : 'C'}`}</Text>
        <TouchableOpacity onPress={changeUnit}>
          <IconSymbol
            name="arrow.up.arrow.down"
            color={tColors.greyIcon}
            size={26}
          />
        </TouchableOpacity>
        <Text style={styles.temp}>{getWeatherStatus(temperature)}</Text>
      </View>

      <Text style={[styles.city, { color: tColors.greyIcon }]}>{location}</Text>
    </View>
  );
};

export default WeatherData;

const styles = StyleSheet.create({
  temp: { fontWeight: 700, fontSize: 24 },
  city: { fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
});
