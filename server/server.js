require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const { connectDB } = require("./config/db");
// const cron = require("node-cron");
// const sendDataReminders = require("./jobs/dataReminderJob");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            process.env.CLIENT_URL,
        ],
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

connectDB();

// Run every day at 9:00 AM
// cron.schedule("0 9 * * *", async () => {
//     console.log("Running data expiry reminder...");

//     await sendDataReminders();
// });

server.listen(PORT, () => {
    console.log("================================");
    console.log("Server running on port:", PORT);
    console.log("Client URL:", process.env.CLIENT_URL);
    console.log("Callback URL:", process.env.PAYSTACK_CALLBACK_URL);
    console.log("================================");
});

// Graceful shutdown
const shutdown = (signal) => {
    console.log(`Received ${signal}. Closing server...`);

    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));