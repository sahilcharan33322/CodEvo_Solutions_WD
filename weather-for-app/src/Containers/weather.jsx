import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaSmog } from 'react-icons/fa';
import { WiDaySunny, WiCloudy, WiShowers, WiSnow, WiFog } from 'react-icons/wi';
import Select from 'react-select';

// List of major Indian cities
const indianCities = [
  { label: 'Delhi', value: 'Delhi' }, { label: 'Mumbai', value: 'Mumbai' }, { label: 'Bangalore', value: 'Bangalore' },
  { label: 'Kolkata', value: 'Kolkata' }, { label: 'Chennai', value: 'Chennai' }, { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Ahmedabad', value: 'Ahmedabad' }, { label: 'Pune', value: 'Pune' }, { label: 'Jaipur', value: 'Jaipur' },
  { label: 'Surat', value: 'Surat' }, { label: 'Kanpur', value: 'Kanpur' }, { label: 'Lucknow', value: 'Lucknow' },
  { label: 'Nagpur', value: 'Nagpur' }, { label: 'Indore', value: 'Indore' }, { label: 'Thane', value: 'Thane' },
  // Add more cities as needed
];

const apiKey = '8996ee2b340d4367a0f110207240709'; // Your WeatherAPI key

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchWeather();
      fetchForecast();
    }
  }, [selectedCity]);

  const fetchWeather = async () => {
    if (!selectedCity) return;
    setError('');
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
        params: {
          key: apiKey,
          q: selectedCity,
          days: 5  // Changed from 3 to 5
        }
      });
      if (response.status === 200 && response.data.current) {
        setWeather(response.data.current);
      } else {
        throw new Error('Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  const fetchForecast = async () => {
    if (!selectedCity) return;
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json`, {
        params: {
          key: apiKey,
          q: selectedCity,
          days: 3
        }
      });
      if (response.status === 200 && response.data.forecast) {
        setForecast(response.data.forecast.forecastday);
      } else {
        throw new Error('Failed to fetch forecast data');
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setError('Failed to fetch forecast data. Please try again.');
    }
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption.value);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny':
        return <FaSun className="text-yellow-500 text-6xl" />;
      case 'Cloudy':
        return <FaCloud className="text-gray-500 text-6xl" />;
      case 'Rainy':
        return <FaCloudRain className="text-blue-500 text-6xl" />;
      case 'Snowy':
        return <FaSnowflake className="text-blue-300 text-6xl" />;
      case 'Fog':
        return <FaSmog className="text-gray-400 text-6xl" />;
      default:
        return <FaSun className="text-gray-500 text-6xl" />;
    }
  };

  const getForecastIcon = (code) => {
    switch (code) {
      case 1000: return <WiDaySunny className="text-yellow-500 text-4xl" />;
      case 1003: return <WiCloudy className="text-gray-500 text-4xl" />;
      case 1006: return <WiCloudy className="text-gray-500 text-4xl" />;
      case 1009: return <WiCloudy className="text-gray-500 text-4xl" />;
      case 1030: return <WiFog className="text-gray-400 text-4xl" />;
      case 1063: return <WiShowers className="text-blue-500 text-4xl" />;
      case 1066: return <WiSnow className="text-blue-300 text-4xl" />;
      case 1069: return <WiSnow className="text-gray-400 text-4xl" />;
      case 1072: return <WiSnow className="text-gray-400 text-4xl" />;
      default: return <WiDaySunny className="text-gray-500 text-4xl" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10 rounded-full border-2 border-white" />
          <span className="text-2xl font-bold">Check Weather</span>
        </div>
        <div className="w-60 max-w-xs">
          <Select
            value={indianCities.find(city => city.value === selectedCity)}
            onChange={handleCityChange}
            options={indianCities}
            className="basic-single text-black"
            classNamePrefix="select"
            placeholder="Select a city"
          />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col mt-8 p-6 flex-grow lg:flex-row lg:space-x-6 lg:px-12 lg:py-8">
        {/* City Name */}
        <div className="text-4xl font-bold text-gray-800 mb-4 lg:mb-0 lg:text-5xl lg:mr-6 lg:sticky lg:top-0">
          {selectedCity}
        </div>

        {/* Main Weather and 3-Day Forecast Container */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 w-full lg:w-full lg:space-y-0">
          {/* Current Weather */}
          {weather && (
            <div className="flex flex-col items-center mb-6 lg:mb-0 lg:flex-1 lg:items-start lg:space-y-4">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weather.condition.text)}
                <div>
                  <p className="text-6xl font-bold">{weather.temp_c}°C</p>
                  <p className="text-lg text-gray-600">Feels Like: {weather.feelslike_c}°C</p>
                  <p className="text-lg text-gray-700">Humidity: {weather.humidity}%</p>
                  <p className="text-lg text-gray-700">Condition: {weather.condition.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3-Day Forecast */}
          {forecast && (
            <div className="flex flex-col lg:flex-1 lg:ml-6 lg:space-y-4 lg:w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">3-Day Forecast</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-2 text-left">Date</th>
                      <th className="border-b p-2 text-left">Temp (°C)</th>
                      <th className="border-b p-2 text-left">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map(day => (
                      <tr key={day.date}>
                        <td className="border-b p-2">{day.date}</td>
                        <td className="border-b p-2">{day.day.avgtemp_c}°C</td>
                        <td className="border-b p-2 flex items-center space-x-2">
                          {getForecastIcon(day.day.condition.code)}
                          <span>{day.day.condition.text}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;