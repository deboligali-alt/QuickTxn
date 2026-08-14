const bcrypt = require("bcryptjs");

async function generateHash() {
    const password = "12345678"; // Change this if you want
    const hash = await bcrypt.hash(password, 10);

    console.log(hash);
}

generateHash();