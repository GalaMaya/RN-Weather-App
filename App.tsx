// App.tsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchWeather } from './src/api/weatherApi';
import { fetchGeolocation } from './src/api/GeoLocationApi';
import type { WeatherResponse } from './src/type/weather';
import type { GeolocationResponse } from './src/type/GeoLocation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const queryClient = new QueryClient();

// Helper sederhana untuk mengubah kode cuaca jadi Emoji & Teks
const getWeatherInfo = (code: number) => {
  if (code === 0) return { label: 'Sunny', icon: 'weather-sunny' };
  if (code >= 1 && code <= 3) return { label: 'Cloudy', icon: 'weather-partly-cloudy' };
  if (code >= 45 && code <= 48) return { label: 'Foggy', icon: 'weather-fog' };
  if (code >= 51 && code <= 67) return { label: 'Rain', icon: 'weather-rainy' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'weather-snowy' };
  if (code >= 80 && code <= 82) return { label: 'Rain', icon: 'weather-pouring' };
  if (code >= 95) return { label: 'Storm', icon: 'weather-lightning-rainy' };
  return { label: 'Clear', icon: 'weather-clear-night' };
};

// Helper untuk gradient berdasarkan cuaca
const getGradientColors = (code: number): string[] => {
  if (code === 0) return ['#f39c12', '#f1c40f', '#ffd89b']; // Sunny - Orange/Yellow
  if (code >= 1 && code <= 3) return ['#636e72', '#b2bec3', '#dfe6e9']; // Cloudy - Gray
  if (code >= 45 && code <= 48) return ['#b2bec3', '#636e72', '#2d3436']; // Foggy - Dark Gray
  if (code >= 51 && code <= 67) return ['#2c3e50', '#3498db', '#64b5f6']; // Rain - Blue
  if (code >= 71 && code <= 77) return ['#83a4d4', '#74ebd5', '#e0f7fa']; // Snow - Light Blue/White
  if (code >= 80 && code <= 82) return ['#1e3c72', '#2a5298', '#7e8ba3']; // Heavy Rain - Dark Blue
  if (code >= 95) return ['#232526', '#414345', '#6a11cb']; // Storm - Dark Purple
  return ['#14213d', '#2c3e50', '#4a69bd']; // Night/Clear - Dark Blue
};

function WeatherScreen() {
  const [inputCity, setInputCity] = useState('Jakarta');
  const [targetCity, setTargetCity] = useState('Jakarta');

  // 1. Query Geocoding
  const { data: geoData, isLoading: isGeoLoading } = useQuery<GeolocationResponse>({
    queryKey: ['geo', targetCity],
    queryFn: () => fetchGeolocation(targetCity),
  });

  const lat = geoData?.results?.[0]?.latitude ?? -6.2088;
  const lon = geoData?.results?.[0]?.longitude ?? 106.8456;

  // 2. Query Weather (Dependent)
  const { data: weatherData, isLoading: isWeatherLoading, refetch, isFetching } = useQuery<WeatherResponse>({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    enabled: !!lat && !!lon,
  });

  const handleSearch = () => {
    if (inputCity.trim() !== '') setTargetCity(inputCity);
  };

  console.log('Geo Data:', geoData);
  console.log('Weather Data:', weatherData);

  // Loading State
  if (isGeoLoading || isWeatherLoading || !weatherData) {
    return (
      <LinearGradient colors={['#14213d', '#2c3e50', '#4a69bd']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Memuat data {targetCity}...</Text>
      </LinearGradient>
    );
  }

  const current = weatherData.current;
  const daily = weatherData.daily;
  const weatherInfo = getWeatherInfo(current.weather_code);
const gradientColors = weatherData ? getGradientColors(weatherData.current.weather_code) : ['#14213d', '#2c3e50'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={inputCity}
            onChangeText={setInputCity}
            placeholderTextColor="rgba(255,255,255,0.7)"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Main Weather Info */}
        <Text style={styles.cityName}>{geoData?.results?.[0]?.name || targetCity}</Text>
        <Text style={styles.mainTemp}>{Math.round(current.temperature_2m)}°C</Text>
        <View style={styles.conditionRow}>
          <Text style={styles.conditionIcon}>
            <MaterialCommunityIcons name={weatherInfo.icon} size={40} color="#070707" />
          </Text>
          <Text style={styles.conditionText}>{weatherInfo.label}</Text>
        </View>
        <Text style={styles.highLow}>
          {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
        </Text>

        {/* Glassmorphism Card (Stats) */}
        <View style={styles.glassCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>
              <MaterialCommunityIcons name="water" size={24} color="#070707" />
            </Text>
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>{current.relative_humidity_2m}%</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>
              <MaterialCommunityIcons name="weather-windy" size={24} color="#070707" />
            </Text>
            <Text style={styles.statLabel}>Wind</Text>
            <Text style={styles.statValue}>{Math.round(current.wind_speed_10m)} km/h</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>
              <MaterialCommunityIcons name="weather-rainy" size={24} color="#070707" />
            </Text>
            <Text style={styles.statLabel}>Precip</Text>
            <Text style={styles.statValue}>{current.precipitation} mm</Text>
          </View>
        </View>

        {/* 3-Day Forecast */}
        <Text style={styles.sectionTitle}>3-day forecast</Text>
        <View style={styles.forecastList}>
          {daily.time.slice(1, 4).map((day, index) => { // Ambil 3 hari setelah hari ini
            const dayInfo = getWeatherInfo(daily.weather_code[index + 1]);
            const date = new Date(day).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: '2-digit' });
            
            return (
              <View key={day} style={styles.forecastItem}>
                <Text style={styles.forecastDate}>{date}</Text>
                <Text style={styles.forecastIcon}>
                  <MaterialCommunityIcons name={dayInfo.icon} size={40} color="#070707" />
                </Text>
                <Text style={styles.forecastTemp}>
                  {Math.round(daily.temperature_2m_max[index + 1])}° / {Math.round(daily.temperature_2m_min[index + 1])}°
                </Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherScreen />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, alignItems: 'center' },
  loadingText: { color: '#ffffff', marginTop: 20, fontSize: 16, flexWrap: 'wrap', textAlign: 'center' , marginTop: 20, paddingHorizontal: 20},
  
  // Search
  searchRow: { flexDirection: 'row', width: '100%', marginBottom: 30, gap: 10 },
  searchInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 15, color: '#070707', height: 40 },
  searchBtn: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' },
  searchBtnText: { color: '#070707', fontWeight: 'bold' },

  // Main Info
  cityName: { fontSize: 32, fontWeight: '500', color: '#070707', marginBottom: 10 },
  mainTemp: { fontSize: 80, fontWeight: '200', color: '#070707', lineHeight: 90 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  conditionIcon: { fontSize: 24 },
  conditionText: { fontSize: 20, color: '#070707', fontWeight: '500' },
  highLow: { fontSize: 18, color: 'rgba(0, 0, 0, 0.8)', marginTop: 10 },

  // Glass Card
  glassCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparan
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 40,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Border tipis untuk efek kaca
  },
  statItem: { alignItems: 'center', flex: 1 },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statLabel: { color: 'rgba(0, 0, 0, 0.7)', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#070707', fontSize: 18, fontWeight: 'bold' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Forecast
  sectionTitle: { color: 'rgba(10, 10, 10, 0.7)', fontSize: 14, marginTop: 30, alignSelf: 'flex-start', marginBottom: 10 },
  forecastList: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 20, padding: 10 },
  forecastItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  forecastDate: { color: '#070707', fontSize: 16, width: 80 },
  forecastIcon: { fontSize: 20 },
  forecastTemp: { color: '#070707', fontSize: 16, fontWeight: '500', width: 80, textAlign: 'right' },
});