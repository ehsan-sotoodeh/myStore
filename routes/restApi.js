import express from "express";
import clientRouter from "./clientRouter";
import userRouter from "./userRouter";
import categoryRouter from "./categoryRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";

//import authRouter  from './authRouter';

const app = express();
app.use("/client/", clientRouter);
app.use("/user/", userRouter);
app.use("/category/", categoryRouter);
app.use("/product/", productRouter);
app.use("/order/", orderRouter);
//app.use("/auth/", authRouter);

module.exports = app;
