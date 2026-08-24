const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


const registerUser = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        // Check if all fields are provided
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // 👇 ADD THIS HERE
        const existingUser = await pool.query(
            `SELECT * FROM users WHERE email = $1 OR phone = $2`,
            [email, phone]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email or phone number already exists."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP expires in 10 minutes
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save user into the database
        // Save user and return the new user's ID
        const newUser = await pool.query(
            `INSERT INTO users
  (
    full_name,
    email,
    phone,
    password,
    otp_code,
    otp_expires
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id`,
            [
                full_name,
                email,
                phone,
                hashedPassword,
                otpCode,
                otpExpires,
            ]
        );

        // Create wallet automatically
        await pool.query(
            `INSERT INTO wallets (user_id, balance)
   VALUES ($1, $2)`,
            [newUser.rows[0].id, 0]
        );

        await sendEmail(
            email,
            "Verify Your QuickTxn Account",
            `
        <h2>Welcome to QuickTxn!</h2>
        <p>Your verification code is:</p>

        <h1 style="letter-spacing: 5px;">${otpCode}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>If you didn't create this account, you can ignore this email.</p>
    `
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for the verification code."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }


};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        // Check if email has been verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const result = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Expires in 15 minutes
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        // Save token
        await pool.query(
            `UPDATE users
             SET reset_token = $1,
                 reset_token_expires = $2
             WHERE email = $3`,
            [resetToken, expires, email]
        );

        return res.status(200).json({
            success: true,
            message: "Password reset token generated.",
            resetToken
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        // Find user with valid token
        const result = await pool.query(
            `SELECT id
             FROM users
             WHERE reset_token = $1
             AND reset_token_expires > NOW()`,
            [resetToken]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE users
             SET password = $1,
                 reset_token = NULL,
                 reset_token_expires = NULL
             WHERE id = $2`,
            [hashedPassword, result.rows[0].id]
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successful."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if both fields are provided
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        // Check if OTP matches
        if (user.otp_code !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // Check if OTP has expired
        if (new Date(user.otp_expires) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        // Mark user as verified
        await pool.query(
            `UPDATE users
             SET is_verified = TRUE,
                 otp_code = NULL,
                 otp_expires = NULL
             WHERE email = $1`,
            [email]
        );

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email was provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        // Check if already verified
        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified."
            });
        }

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save new OTP
        await pool.query(
            `UPDATE users
             SET otp_code = $1,
                 otp_expires = $2
             WHERE email = $3`,
            [otpCode, otpExpires, email]
        );

        // Send email
        await sendEmail(
            email,
            "Your New QuickTxn Verification Code",
            `
                <h2>QuickTxn Email Verification</h2>

                <p>Your new verification code is:</p>

                <h1 style="letter-spacing:5px;">${otpCode}</h1>

                <p>This code expires in 10 minutes.</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyOTP,
    resendOTP
};
