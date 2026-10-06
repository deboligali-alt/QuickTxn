const express = require("express");

const {
    runSMEPlugDiagnostic,
} = require("../controllers/smeplugDiagnosticController");

const router = express.Router();

router.get(
    "/",
    runSMEPlugDiagnostic
);

module.exports = router;