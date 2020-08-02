import express from "express";
import { authenticationMiddleware } from "../controllers/AuthController";

import clientRouter from "./clientRouter";
import userRouter from "./userRouter";
import categoryRouter from "./categoryRouter";
import productRouter from "./productRouter";
import orderRouter from "./orderRouter";
import authRouter from "./authRouter";

const app = express();
//app.use("/client/", clientRouter);
app.use("/user/", authenticationMiddleware, userRouter);
app.use("/category/", authenticationMiddleware, categoryRouter);
app.use("/product/", authenticationMiddleware, productRouter);
app.use("/order/", authenticationMiddleware, orderRouter);
app.use("/auth/", authRouter);

module.exports = app;
