const express = require("express");
const connectDb = require("./Config/dbConfig");
const env = require("dotenv").config()
const userRoutes = require("./Routes/UserRoutes");
const cors = require("cors");
const ErrorHandler = require("./Middlewares/ErrorHandlers")
const app = express()





app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/Api/User", userRoutes)

app.use(ErrorHandler)

console.log("Working Tree Clean");

const port = process.env.PORT || 6000

connectDb()

app.listen(port, ()=>{
    console.log(`App is Running on port ${port}`);
})