import express from "express";
import CategoryController from "../controllers/CategoryController";

const router = express.Router();
router.get("/", CategoryController.categoryList);
router.post("/", CategoryController.categoryStore);

router.get("/:id", CategoryController.categoryDetails);
router.delete("/:id", CategoryController.categoryDelete);
router.put("/:id", CategoryController.categoryUpdate);

module.exports = router;
