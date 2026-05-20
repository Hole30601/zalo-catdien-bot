const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {

    console.log(req.body);

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Bot running");
});
