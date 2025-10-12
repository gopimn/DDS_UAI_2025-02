const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;
app.get("/status", (request,response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

// Start the server
app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}`);
});