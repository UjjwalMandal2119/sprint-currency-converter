const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/**
 * Health Check API
 */
app.get("/", (req, res) => {
    res.json({ message: "Currency Converter Backend is running" });
});

/**
 * GET Exchange Rate
 * Example:
 * http://localhost:5000/rate?from=USD&to=INR
 */
app.get("/rate", (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: "from and to parameters are required" });
    }

    const sql =
        "SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = ?";

    db.query(sql, [from, to], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Exchange rate not found" });
        }

        res.json({
            fromCurrency: from,
            toCurrency: to,
            rate: result[0].rate
        });
    });
});

/**
 * GET Currency Conversion
 * Example:
 * http://localhost:5000/convert?from=USD&to=INR&amount=100
 */
app.get("/convert", (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({
            error: "from, to, and amount parameters are required"
        });
    }

    const sql =
        "SELECT rate FROM exchange_rates WHERE from_currency = ? AND to_currency = ?";

    db.query(sql, [from, to], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Conversion not possible" });
        }

        const rate = result[0].rate;
        const convertedAmount = Number(amount) * rate;

        res.json({
            fromCurrency: from,
            toCurrency: to,
            amount: Number(amount),
            exchangeRate: rate,
            convertedAmount: convertedAmount
        });
    });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
