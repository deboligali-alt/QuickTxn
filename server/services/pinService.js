const bcrypt = require("bcrypt");
const { pool } = require("../config/db");

// ================================
// Create PIN
// ================================
const createPin = async (userId, pin, client = pool) => {
    const hashedPin = await bcrypt.hash(pin, 10);

    const result = await client.query(
        `UPDATE users
         SET transaction_pin = $1
         WHERE id = $2`,
        [hashedPin, userId]
    );

    if (result.rowCount === 0) {
        throw new Error("User not found.");
    }

    return true;
};

// ================================
// Verify PIN
// ================================
const verifyPin = async (userId, pin, client = pool) => {
    const result = await client.query(
        `SELECT transaction_pin
         FROM users
         WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found.");
    }

    const storedHash = result.rows[0].transaction_pin;

    if (!storedHash) {
        throw new Error("Transaction PIN has not been set.");
    }

    const valid = await bcrypt.compare(
        String(pin),
        storedHash
    );

    if (!valid) {
        throw new Error("Invalid transaction PIN.");
    }

    return true;
};

// ================================
// Change PIN
// ================================
const changePin = async (
    userId,
    oldPin,
    newPin,
    client = pool
) => {
    await verifyPin(userId, oldPin, client);

    const hashedPin = await bcrypt.hash(newPin, 10);

    const result = await client.query(
        `UPDATE users
         SET transaction_pin = $1
         WHERE id = $2`,
        [hashedPin, userId]
    );

    if (result.rowCount === 0) {
        throw new Error("User not found.");
    }

    return true;
};

module.exports = {
    createPin,
    verifyPin,
    changePin
};