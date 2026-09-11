require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

// ==========================
// Routes
// ==========================

// User
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pinRoutes = require("./routes/pinRoutes");
const kycRoutes = require("./routes/kycRoutes");
const adminKycRoutes = require("./routes/adminKycRoutes");

// Wallet
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const bankTransferRoutes = require("./routes/bankTransferRoutes");

// Payment Gateways
const paystackRoutes = require("./routes/paystackRoutes");
const monnifyRoutes = require("./routes/monnifyRoutes");

// VTU
const airtimeRoutes = require("./routes/airtimeRoutes");
const airtimePurchaseRoutes = require("./routes/airtimePurchaseRoutes");
const dataPurchaseRoutes = require("./routes/dataPurchaseRoutes");
const bettingRoutes = require("./routes/bettingRoutes");
const electricityRoutes = require("./routes/electricityRoutes");
const cableRoutes = require("./routes/cableRoutes");
const waecRoutes = require("./routes/waecRoutes");
const airtimeSwapRoutes = require("./routes/airtimeSwapRoutes");

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const publicRoutes = require("./routes/publicRoutes");

// Admin
const adminRoutes = require("./routes/adminRoutes");
const adminDataPlanRoutes = require("./routes/adminDataPlanRoutes");
const adminAirtimeRateRoutes = require("./routes/adminAirtimeRateRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTransactionRoutes = require("./routes/adminTransactionRoutes");
const adminAirtimeSwapRoutes = require("./routes/adminAirtimeSwapRoutes");

const biometricRoutes = require("./routes/biometricRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// ==========================
// Global Middleware
// ==========================

app.use(helmet());

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            process.env.CLIENT_URL,
        ],
        credentials: true,
    })
);

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
// Home
// ==========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to QuickTxn API 🚀",
        version: "2.0.0",
        gateways: {
            checkout: "Paystack",
            virtualAccount: "Monnify",
        },
    });
});

// ==========================
// User Routes
// ==========================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin/kyc", adminKycRoutes);

// ==========================
// Wallet & Transactions
// ==========================

app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/bank", bankTransferRoutes);

// ==========================
// Payment Gateways
// ==========================

app.use("/api/paystack", paystackRoutes);
app.use("/api/monnify", monnifyRoutes);

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
app.use("/api/airtime-swap", airtimeSwapRoutes);

// ==========================
// Dashboard
// ==========================

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// ==========================
// Public
// ==========================

app.use("/api/contact", contactRoutes);
app.use("/api/public", publicRoutes);

// ==========================
// Admin
// ==========================

app.use("/api/admin", adminRoutes);
app.use("/api/admin/data-plans", adminDataPlanRoutes);
app.use("/api/admin/airtime-rates", adminAirtimeRateRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);
app.use("/api/admin/airtime-swaps", adminAirtimeSwapRoutes);
app.use("/api/biometric", biometricRoutes);

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

module.exports = app;