const express = require("express");
const router = express.Router();

const {
    sendContactMessage,
    getContactMessages,
} = require("../controllers/contactController");

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact form and customer messages
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Adebowale Ibrahim
 *               email:
 *                 type: string
 *                 example: ibrahimadebowale259@gmail.com
 *               subject:
 *                 type: string
 *                 example: Need Help
 *               message:
 *                 type: string
 *                 example: Hello QuickTxn, I need assistance.
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post("/", sendContactMessage);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Contact messages retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getContactMessages);

module.exports = router;