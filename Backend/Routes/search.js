const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST /api/search
router.post("/", async (req, res) => {
  const query = req.body.query; // Get the search query from the request

  try {
    // Make the request to the FAISS API to get the matches for the query
    const response = await axios.post("http://127.0.0.1:8009/search", {
      query: query,
    });

    // Get the matches from the FAISS API response
    const matches = response.data.matches;

    // Return the matches directly, which includes the product details and distance
    res.json(matches);
  } catch (error) {
    console.error("FAISS error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
