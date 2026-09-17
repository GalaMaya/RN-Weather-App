# 🌤️ React Native Weather App

A modern, dynamic, and beautiful weather application built with **React Native (Expo)** and **TypeScript**. This app fetches real-time weather data and forecasts, featuring a dynamic UI that changes its background gradient based on the current weather conditions.

> **Built as a learning project to master modern React Native patterns, including TanStack Query, TypeScript, and advanced UI styling.**

---

## ✨ Features

-  **City Search**: Find weather for any city worldwide using Geocoding API.
- 🌡️ **Real-time Weather**: Displays current temperature, humidity, wind speed, and precipitation.
- 📅 **3-Day Forecast**: Shows upcoming weather predictions with dynamic icons.
- 🎨 **Dynamic Gradients**: Background colors automatically adapt to the weather (e.g., Orange for Sunny, Blue for Rain, Dark Purple for Storm).
- 💎 **Glassmorphism UI**: Modern, translucent card designs for a premium look.
- ⚡ **Optimized Data Fetching**: Powered by TanStack Query for seamless caching, background refetching, and loading states.
- 📱 **Cross-Platform**: Runs smoothly on both iOS and Android via Expo.

---

## ️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Styling**: \`StyleSheet\`, \`expo-linear-gradient\`
- **Icons**: \`@expo/vector-icons\` (MaterialCommunityIcons)
- **API**: [Open-Meteo API](https://open-meteo.com/) (Free, no API key required)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app installed on your mobile device (optional, for testing on phone)

###
Key Learnings

This project was built to solidify understanding of:
1. **Dependent Queries**: Using \`enabled\` in TanStack Query to fetch weather data *only after* geocoding coordinates are resolved.
2. **Type Safety**: Defining strict TypeScript interfaces for nested API responses.
3. **Dynamic Styling**: Mapping API weather codes to specific UI gradients and icons.




## 📄 License

This project is open source and available under the [MIT License](LICENSE).