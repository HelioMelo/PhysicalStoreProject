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
}
