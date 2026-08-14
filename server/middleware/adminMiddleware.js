const { pool } = require("../config/db");

const adminMiddleware = async (req, res, next) => {
    try {
        console.log("JWT User:", req.user);

        const result = await pool.query(
            "SELECT id, email, role FROM users WHERE id = $1",
            [req.user.id]
        );

        console.log("Database Result:", result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        console.log("Role from DB:", user.role);

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        next();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



module.exports = adminMiddleware;