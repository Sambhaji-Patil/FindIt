const express = require('express');
const axios = require('axios');
const path = require('path');
const { env } = require('process');
const app = express();
const port = 3000;

require("dotenv").config();

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files
app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(lat);
    console.log(lon);
    const apiKey = process.env.openweathermap_api_key;// Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Tourism API endpoint (example using a mock API)
// Tourism API endpoint
// Tourism API endpoint 
app.get('/api/tourism', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey2 = process.env.tourism_api_key; // Add your actual API key here
    const url2 = `https://api.geoapify.com/v2/place-details?lat=${lat}&lon=${lon}&features=radius_500,radius_500.atm,radius_500.restaurant,drive_5,drive_5.fuel&apiKey=${apiKey2}`;
 
    try {
        const response = await axios.get(url2);
        const features = response.data.features;

        // Filter restaurants, ATMs, and fuel stations
        const restaurants = features.filter(feature => feature.properties.feature_type === "radius_500.restaurant");
        const atms = features.filter(feature => feature.properties.feature_type === "radius_500.atm");
        const fuelStations = features.filter(feature => feature.properties.feature_type === "drive_5.fuel");

        // Send the filtered data to the client
        res.json({ restaurants, atms, fuelStations });
    } catch (error) {
        console.error('Error fetching tourism data:', error);
        res.status(500).json({ error: 'Failed to fetch tourism data' });
    }
});


// Render the main page
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});