require("dotenv").config(); // Load environment variables

const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;  // Use .env PORT
const API_KEY = process.env.API_KEY;    // Fetch API key from .env

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// Route to fetch recipes
app.post("/suggest_recipes", async (req, res) => {
    const ingredients = req.body.ingredients || [];

    if (ingredients.length === 0) {
        return res.status(400).json({ error: "No ingredients provided" });
    }

    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
            params: {
                ingredients: ingredients.join(","),
                number: 5,
                apiKey: API_KEY, // Now fetched from .env
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching recipes:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                error: `Spoonacular API error: ${error.response.data.message}`
            });
        } else if (error.request) {
            return res.status(500).json({ error: "No response from Spoonacular API" });
        } else {
            return res.status(500).json({ error: "Server error. Please try again later." });
        }
    }

});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
