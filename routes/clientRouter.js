import express from "express";
import ClientController from "../controllers/ClientController";

const router = express.Router();

router.get("/", ClientController.clientList);
router.post("/", ClientController.clientStore);

router.get("/:id", ClientController.clientDetails);
router.delete("/:id", ClientController.clientDelete);
router.put("/:id", ClientController.clientUpdate);

module.exports = router;
