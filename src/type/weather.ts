// src/types/weather.ts

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number; // Terasa seperti
  relative_humidity_2m: number; // Kelembapan
  precipitation: number;        // Curah hujan
  weather_code: number;
  wind_speed_10m: number;       // Kecepatan angin
}

export interface DailyForecast {
  time: string[];               // Array tanggal (misal: ['2026-09-17', '2026-09-18'])
  weather_code: number[];       // Array kode cuaca per hari
  temperature_2m_max: number[]; // Array suhu max per hari
  temperature_2m_min: number[]; // Array suhu min per hari
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DailyForecast; // Tambahkan ini untuk ramalan 3 hari
}