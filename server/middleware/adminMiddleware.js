const adminMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // User must already be authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please login.",
                });
            }

            // If no roles are passed, allow any authenticated admin
            if (allowedRoles.length === 0) {
                return next();
            }

            // Check whether the user's role is permitted
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Permission denied.",
                });
            }

            next();
        } catch (error) {
            console.error("Admin Middleware Error:", error);

            return res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    };
};

module.exports = adminMiddleware;