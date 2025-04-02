import express from 'express';
import axios from 'axios';

const app = express();

// Window size configuration
const WINDOW_SIZE = 10;
let numberWindow = []; // Stores last 'WINDOW_SIZE' numbers

// Third-party API endpoints
const API_URLS = {
    p: "http://20.244.56.144/evaluation-service/primes",
    f: "http://20.244.56.144/evaluation-service/fibo",
    e: "http://20.244.56.144/evaluation-service/even",
    r: "http://20.244.56.144/evaluation-service/rand"
};

// Root Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Numbers API Route
app.get('/numbers/:numberid', async (req, res) => {
    const numberType = req.params.numberid;

    // Validate the number type
    if (!API_URLS[numberType]) {
        return res.status(400).json({ error: "Invalid number type! Use 'p', 'f', 'e', or 'r'." });
    }

    try {
        // Fetch numbers from third-party API
        const response = await axios.get(API_URLS[numberType], { timeout: 500 });

        // Extract numbers from response
        const newNumbers = response.data.numbers.filter(num => !numberWindow.includes(num));

        // Maintain window size
        numberWindow.push(...newNumbers);
        if (numberWindow.length > WINDOW_SIZE) {
            numberWindow = numberWindow.slice(numberWindow.length - WINDOW_SIZE);
        }

        // Calculate average
        const average = numberWindow.length > 0
            ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2)
            : 0;

        // Send response
        res.json({
            windowPrevState: numberWindow.slice(0, -newNumbers.length),
            windowCurrState: numberWindow,
            numbers: newNumbers,
            avg: average
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch numbers. Please try again." });
    }
});

// Start Server
const PORT = 9876;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
