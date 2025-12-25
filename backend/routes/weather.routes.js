const express = require("express");
const axios = require("axios");

const router = express.Router();

/**
 * GET /api/weather?location=Dhaka
 */
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;

    // 1️⃣ Validate input
    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required"
      });
    }

    // 2️⃣ Check API key
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Weather API key not found"
      });
    }

    // 3️⃣ Call OpenWeather API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&units=metric&appid=${apiKey}`;

    const response = await axios.get(url);

    // 4️⃣ Extract data
    const weatherInfo = response.data.weather[0];
    const condition = weatherInfo.main;       // Rain, Clear, Clouds, etc
    const description = weatherInfo.description;
    const icon = weatherInfo.icon;             // icon code
    const temperature = response.data.main.temp;

    // 5️⃣ Define bad weather
    const badWeather = ["Rain", "Thunderstorm", "Snow", "Storm"];
    const warning = badWeather.includes(condition);

    // 6️⃣ Send response
    res.json({
      success: true,
      data: {
        condition,
        description,
        temperature,
        icon,
        warning
      }
    });

  } catch (error) {
    console.error(
      "Weather API error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch weather"
    });
  }
});

module.exports = router;


