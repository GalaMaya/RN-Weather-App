import { WeatherResponse } from '../type/weather';

export const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherResponse> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
   
    return response.json()
}