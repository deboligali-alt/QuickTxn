const express = require("express");

const router = express.Router();

const {
    handlePaystackWebhook,
} = require("../controllers/paystackController");

/**
 * @swagger
 * tags:
 *   - name: Paystack
 *     description: Paystack payment and webhook operations
 */

/**
 * @swagger
 * /api/paystack/webhook:
 *   post:
 *     summary: Receive Paystack webhook events
 *     description: |
 *       Receives payment events sent by Paystack.
 *       The webhook verifies the Paystack signature before
 *       processing successful transactions.
 *     tags:
 *       - Paystack
 *     parameters:
 *       - in: header
 *         name: x-paystack-signature
 *         required: true
 *         description: Paystack webhook signature used to authenticate the request.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: charge.success
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 123456789
 *                   status:
 *                     type: string
 *                     example: success
 *                   reference:
 *                     type: string
 *                     example: QTXN-1755000000000-123456
 *                   amount:
 *                     type: integer
 *                     description: Amount in kobo.
 *                     example: 500000
 *                   currency:
 *                     type: string
 *                     example: NGN
 *                   customer:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: customer@example.com
 *     responses:
 *       200:
 *         description: Webhook received and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Webhook processed successfully.
 *       400:
 *         description: Invalid webhook data
 *       401:
 *         description: Missing or invalid Paystack signature
 *       404:
 *         description: User or wallet not found
 *       500:
 *         description: Webhook processing failed
 */

router.post(
    "/webhook",
    handlePaystackWebhook
);

module.exports = router;