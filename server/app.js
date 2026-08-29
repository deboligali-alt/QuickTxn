require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const rateLimiter = require("./middleware/rateLimiter");

// ==========================
// Routes
// ==========================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const airtimeRoutes = require("./routes/airtimeRoutes");
const airtimePurchaseRoutes = require("./routes/airtimePurchaseRoutes");
const dataPurchaseRoutes = require("./routes/dataPurchaseRoutes");
const bettingRoutes = require("./routes/bettingRoutes");

const paystackRoutes = require("./routes/paystackRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const pinRoutes = require("./routes/pinRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const publicRoutes = require("./routes/publicRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminDataPlanRoutes = require("./routes/adminDataPlanRoutes");
const adminAirtimeRateRoutes = require("./routes/adminAirtimeRateRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTransactionRoutes = require("./routes/adminTransactionRoutes");
const adminAirtimeSwapRoutes = require("./routes/adminAirtimeSwapRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const bankTransferRoutes = require("./routes/bankTransferRoutes");
const cableRoutes = require("./routes/cableRoutes");
const waecRoutes = require("./routes/waecRoutes");
const app = express();

// ==========================
// Global Middleware
// ==========================
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

// ==========================
// Rate Limiter
// ==========================
app.use(rateLimiter);

// ==========================
// Swagger
// ==========================
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// ==========================
// Home Route
// ==========================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to QuickTxn API 🚀",
    });
});

// ==========================
// User Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);

// ==========================
// Wallet & Transactions
// ==========================
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);

// ==========================
// VTU Services
// ==========================
app.use("/api/airtime", airtimeRoutes);
app.use("/api/airtime-purchase", airtimePurchaseRoutes);
app.use("/api/data", dataPurchaseRoutes);
app.use("/api/betting", bettingRoutes);
app.use("/api/electricity", electricityRoutes);
app.use("/api/cable", cableRoutes);
app.use("/api/waec", waecRoutes);
// ==========================
// Dashboard & Notifications
// ==========================
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// ==========================
// Contact & Public
// ==========================
app.use("/api/contact", contactRoutes);
app.use("/api/public", publicRoutes);c

// ==========================
// Paystack
// ==========================
app.use("/api/paystack", paystackRoutes);
app.use("/api/bank", bankTransferRoutes);

// ==========================
// Admin Routes
// ==========================
app.use("/api/admin", adminRoutes);
app.use("/api/admin/data-plans", adminDataPlanRoutes);
app.use("/api/admin/airtime-rates", adminAirtimeRateRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);
app.use("/api/admin/airtime-swaps", adminAirtimeSwapRoutes);

// ==========================
// Webhooks
// ==========================
app.use("/api/webhook", webhookRoutes);

// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ==========================
// Export App
// ==========================
module.exports = app;