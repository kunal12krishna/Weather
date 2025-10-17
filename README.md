# 🌤️ Weather App

A beautiful, responsive weather application that provides real-time weather information and 5-day forecasts for any location worldwide. Built with vanilla JavaScript, Express.js backend, and powered by the OpenWeather API.

![Weather App](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

## ✨ Features

- 🔍 **Real-time Weather Search** - Search for current weather conditions in any city
- 📅 **5-Day Forecast** - View detailed weather forecasts for the next 5 days
- 🌡️ **Detailed Metrics** - Temperature, humidity, wind speed, visibility, and pressure
- 🎨 **Modern UI/UX** - Glassmorphic design with smooth animations
- 🌓 **Dark/Light Theme** - Toggle between light and dark modes
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Dynamic Backgrounds** - Background changes based on weather conditions
- ⚡ **Fast & Lightweight** - Optimized performance with minimal dependencies

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key ([Get one for free](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunal12krishna/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then add your OpenWeather API key to the `.env` file:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3002
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3002`

## 📦 Project Structure

```
weather-app/
├── server.js           # Express server and API proxy
├── weather.html        # Main HTML file
├── weather.css         # Styles and themes
├── weather.js          # Client-side JavaScript
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🛠️ Built With

- **Frontend:**
  - HTML5
  - CSS3 (with CSS Variables & Glassmorphism)
  - Vanilla JavaScript (ES6+)
  
- **Backend:**
  - Node.js
  - Express.js
  - CORS middleware
  - dotenv for environment variables

- **API:**
  - OpenWeather API

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm start` - Start the production server
- `npm test` - Run tests (not yet implemented)

## 🎨 Features in Detail

### Current Weather Display
- City name and location
- Current temperature with "feels like" metric
- Weather condition with icon
- Humidity percentage
- Wind speed
- Visibility distance
- Atmospheric pressure

### 5-Day Forecast
- Date and day of the week
- Weather icons and conditions
- High and low temperatures
- Detailed weather descriptions

### Theme Toggle
- Seamless switching between light and dark modes
- Preference saved in browser
- Optimized color schemes for both themes

### Dynamic Backgrounds
- Background adapts to current weather conditions:
  - Clear skies
  - Cloudy
  - Rainy
  - Snowy
  - Night mode

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | Your OpenWeather API key | Yes |
| `PORT` | Server port (default: 3002) | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeather API](https://openweathermap.org/)
- Icons and design inspiration from modern weather applications

Made by Kunal Krishna
