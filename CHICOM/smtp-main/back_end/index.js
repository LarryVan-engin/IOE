const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const path = require("path");
const morgan = require("morgan");
const orderRoute = require("./routes/order");


dotenv.config();
const app = express();

//=======================
//Neu ko su dung VSCode de string MongoDB thi co the su dung string manual like this
//Because of security so using .env instead of show the link to database

async function connect_MONGODB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("CONNECTED TO MONGODB");
  } catch (err) {
    console.error("MONGODB CONNECTION ERROR:", err);
  }
}

connect_MONGODB();

//Dung express de chay html, khong can chay Flask
app.use(cors({
  //origin: "http://localhost:5500", //Flask front_end
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.get("/", (req, res)=>{
  res.send("Server is running!");
});
app.listen(8000, () => {
    console.log("Server is running");
});
app.use(express.static("../front_end"));
app.use(morgan("dev"));

app.use("/v1/orders", orderRoute);






