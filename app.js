const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const userRoutes = require("./routes");
app.use(userRoutes);

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.get("/", (req, res) => {
    return res.json("Start with /users");
});

app.listen(3000, () => {
    console.log("Go to http://localhost:3000");
});