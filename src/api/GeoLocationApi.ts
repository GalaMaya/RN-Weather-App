import {GeolocationResponse} from '../type/GeoLocation';

export const fetchGeolocation = async (cityName: string): Promise<GeolocationResponse> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch geolocation data');
    }
    
    return response.json();
}