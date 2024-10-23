import { Router } from "express";
import { StoreController } from "../controllers/storeController";

const router = Router();

router.post("/store", StoreController.saveStore);
router.post("/stores/nearby", StoreController.findNearbyStores);

export default router;
