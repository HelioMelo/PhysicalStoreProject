import { Request, Response } from "express";
import { StoreService } from "../services/storeService";
import { sendErrorResponse, handleError } from "../errors/errorHandlers";

export class StoreController {
  static async saveStore(req: Request, res: Response) {
    try {
      const savedStore = await StoreService.saveStore(req.body);
      res.status(201).json(savedStore);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : handleError(error, "Error saving store");
      sendErrorResponse(res, 400, errorMessage);
    }
  }
  static async findNearbyStores(req: Request, res: Response) {
    try {
      const { zipCode, number } = req.body;
      const stores = await StoreService.findNearbyStores(
        zipCode as string,
        number as string
      );
      res.status(200).json(stores);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : handleError(error, "Error finding nearby stores");
      sendErrorResponse(res, 400, errorMessage);
    }
  }
}
