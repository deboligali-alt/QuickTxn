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
const adminRoutes = require("./routes/adminRoutes");
const paystackRoutes = require("./routes/paystackRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const airtimePurchaseRoutes = require("./routes/airtimePurchaseRoutes");
const dataPurchaseRoutes = require("./routes/dataPurchaseRoutes");
const bettingRoutes = require("./routes/bettingRoutes");
const pinRoutes = require("./routes/pinRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const publicRoutes = require("./routes/publicRoutes");

const adminDataPlanRoutes = require("./routes/adminDataPlanRoutes");
const adminAirtimeRateRoutes = require("./routes/adminAirtimeRateRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTransactionRoutes = require("./routes/adminTransactionRoutes");
const adminAirtimeSwapRoutes = require("./routes/adminAirtimeSwapRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const app = express();

// ==========================
// Global Middleware
// ==========================

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

// IMPORTANT:
// Preserve the raw request body.
// Paystack webhook signature verification
// requires the original request body.

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
// Swagger Documentation
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
// API Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/wallet", walletRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/airtime", airtimeRoutes);

app.use("/api/admin", adminRoutes);

// ==========================
// Paystack
// ==========================

app.use("/api/paystack", paystackRoutes);

app.use("/api/beneficiaries", beneficiaryRoutes);

app.use("/api/notifications", notificationRoutes);

app.use(
    "/api/airtime-purchase",
    airtimePurchaseRoutes
);

app.use("/api/data", dataPurchaseRoutes);

app.use("/api/betting", bettingRoutes);

app.use("/api/pin", pinRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/public", publicRoutes);

// ==========================
// Admin Routes
// ==========================

app.use(
    "/api/admin/data-plans",
    adminDataPlanRoutes
);

app.use(
    "/api/admin/airtime-rates",
    adminAirtimeRateRoutes
);

app.use(
    "/api/admin/users",
    adminUserRoutes
);

app.use(
    "/api/admin/transactions",
    adminTransactionRoutes
);

// ==========================
// Admin Routes
// ==========================

app.use("/api/admin/data-plans", adminDataPlanRoutes);

app.use("/api/admin/airtime-rates", adminAirtimeRateRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/admin/transactions", adminTransactionRoutes);

// ✅ ADD THIS
app.use("/api/admin/airtime-swaps", adminAirtimeSwapRoutes);

app.use("/api/webhook", webhookRoutes);



app.use("/api/webhook", webhookRoutes);


// ==========================
// Export App
// ==========================

module.exports = app;