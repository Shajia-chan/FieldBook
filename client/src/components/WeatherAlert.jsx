import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const WeatherAlert = ({ defaultLocation = "" }) => {
  const { t } = useTranslation();

  const [location, setLocation] = useState(defaultLocation);
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleCheckWeather = async () => {
    if (!location || !date) {
      setError("Please select location and date");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/weather?location=${location}`
      );

      if (res.data.success) {
        setWeather(res.data.data);
      } else {
        setError("Failed to fetch weather");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Fog: "🌫️"
    };
    return iconMap[condition] || "🌡️";
  };

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Input Section */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleCheckWeather}
          disabled={loading}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Checking..." : t("weather.title")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ marginTop: "8px", color: "#dc2626" }}>{error}</p>
      )}

      {/* Weather Result */}
      {weather && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: weather.warning ? "#fee2e2" : "#ecfeff",
            border: weather.warning
              ? "1px solid #fca5a5"
              : "1px solid #67e8f9",
            color: weather.warning ? "#991b1b" : "#065f46"
          }}
        >
          <strong>
            {getWeatherIcon(weather.condition)} {weather.condition}
          </strong>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Date: {date}</p>

          {weather.warning && (
            <p style={{ marginTop: "6px", fontWeight: "500" }}>
              ⚠️ {t("weather.warning")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherAlert;

