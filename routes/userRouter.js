import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();
router.get("/", UserController.userList);
router.post("/", UserController.userStore);

router.get("/:id", UserController.userDetails);
router.delete("/:id", UserController.userDelete);
router.put("/:id", UserController.userUpdate);

module.exports = router;
