export interface Geolocation {
    name: string;
    latitude: number;
    longitude: number;
}

export interface GeolocationResponse {
    results?: Geolocation[];
}