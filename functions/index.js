const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// require("dotenv").config();
// if (process.env.NODE_ENV == "development") {
//   process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
// }

console.log("---Backend Initiated---");
admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://devport-express-backend.firebaseio.com",
  // storageBucket: "formprojectback9-21-21.appspot.com",
  projectId: "formprojectback9-21-21",
});

const app = express();
// console.log("---Checking Cors...---");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    cacheControl: "private",
    allowedHeaders: ["set-cookie", "content-type", "cookie", "authorization"],
  })
);

app.use(cookieParser());
console.log("---Cors Passed---");
app.use("/posts", require("./routers/postRouter"));

exports.app = functions.https.onRequest(app);
