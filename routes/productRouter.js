import express from "express";
import ProductController from "../controllers/ProductController";

const router = express.Router();
router.get("/", ProductController.productList);
router.post("/", ProductController.productStore);

router.get("/:id", ProductController.productDetails);
router.delete("/:id", ProductController.productDelete);
router.put("/:id", ProductController.productUpdate);

module.exports = router;
