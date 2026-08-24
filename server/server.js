require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

connectDB();

server.listen(PORT, () => {
    console.log("================================");
    console.log("Callback URL:", process.env.PAYSTACK_CALLBACK_URL);
    console.log("================================");
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
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