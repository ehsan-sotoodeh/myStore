import express from "express";
import mongoUtility from "./helpers/mongoUtility";
import apiResponse from "./helpers/apiResponse";
import cors from "cors";
require("dotenv").config();

//routes
import apiRouter from "./routes/restApi";
import indexRouter from "./routes/index";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoUtility.connect();

app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", (req, res) => {
  return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

app.listen(3000, () => console.log("Server running on port 3000!"));
