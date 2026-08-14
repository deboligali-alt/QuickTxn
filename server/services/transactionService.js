const { pool } = require("../config/db");

// ========================================
// Create Transaction
// ========================================
const createTransaction = async ({
    senderId = null,
    receiverId = null,
    type,
    amount,
    status = "SUCCESS",
    description,
    reference,
    paymentProvider = null,
    paymentReference = null
}, client = pool) => {

    const result = await client.query(
        `INSERT INTO transactions
        (
            sender_id,
            receiver_id,
            type,
            amount,
            description,
            status,
            reference,
            payment_provider,
            payment_reference
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            senderId,
            receiverId,
            type,
            amount,
            description,
            status,
            reference,
            paymentProvider,
            paymentReference
        ]
    );

    return result.rows[0];
};

// ========================================
// Get Transaction By Reference
// ========================================
const getTransactionByReference = async (
    reference,
    client = pool
) => {

    const result = await client.query(
        `SELECT *
         FROM transactions
         WHERE reference = $1`,
        [reference]
    );

    return result.rows[0];
};

// ========================================
// Get User Transactions
// ========================================
const getUserTransactions = async (
    userId,
    client = pool
) => {

    const result = await client.query(
        `SELECT *
         FROM transactions
         WHERE sender_id = $1
            OR receiver_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

// ========================================
// Update Transaction Status
// ========================================
const updateTransactionStatus = async (
    reference,
    status,
    client = pool
) => {

    const result = await client.query(
        `UPDATE transactions
         SET status = $1
         WHERE reference = $2
         RETURNING *`,
        [
            status,
            reference
        ]
    );

    return result.rows[0];
};

// ========================================
// Create Transfer Transactions
// ========================================
const createTransferTransactions = async ({
    senderId,
    receiverId,
    amount,
    senderReference,
    receiverReference,
    senderDescription,
    receiverDescription
}, client = pool) => {

    await createTransaction({
        senderId,
        receiverId,
        type: "DEBIT",
        amount,
        status: "SUCCESS",
        description: senderDescription,
        reference: senderReference
    }, client);

    await createTransaction({
        senderId,
        receiverId,
        type: "CREDIT",
        amount,
        status: "SUCCESS",
        description: receiverDescription,
        reference: receiverReference
    }, client);

};

module.exports = {
    createTransaction,
    getTransactionByReference,
    getUserTransactions,
    updateTransactionStatus,
    createTransferTransactions
};