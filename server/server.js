require("dotenv").config();

console.log("================================");
console.log(
    "Callback URL:",
    process.env.PAYSTACK_CALLBACK_URL
);
console.log("================================");

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

app.listen(PORT, () => {
    console.log(
        `🚀 Server is running on http://localhost:${PORT}`
    );
});