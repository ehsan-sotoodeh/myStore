import express from "express";
import OrderController from "../controllers/OrderController";

const router = express.Router();
router.get("/", OrderController.orderList);
router.post("/", OrderController.orderStore);

router.get("/:id", OrderController.orderDetails);
router.delete("/:id", OrderController.orderDelete);
router.put("/:id", OrderController.orderUpdate);

module.exports = router;
