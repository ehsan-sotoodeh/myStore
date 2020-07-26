import express from "express";
import clientRouter from "./clientRouter";
import userRouter from "./userRouter";

//import authRouter  from './authRouter';

const app = express();
app.use("/client/", clientRouter);
app.use("/user/", userRouter);
//app.use("/auth/", authRouter);

module.exports = app;
