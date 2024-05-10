const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Your API endpoint
app.post('https://hoanghamobile.com/Landing/GalaxyZ2024/Lists', (req, res) => {
    const jsonData = req.body; // JSON data received in the request

    // Process the JSON data and generate HTML/CSS
    const html = generateHTMLFromJSON(jsonData); // Function to convert JSON to HTML
    const css = generateCSS(); // Function to generate CSS styles

    res.send({ html, css });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
