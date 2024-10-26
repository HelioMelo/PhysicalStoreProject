import { Request, Response } from "express";
import { StoreService } from "../services/storeService";
import { sendErrorResponse, handleError } from "../errors/errorHandlers";
import { StoreDTO } from "../dto/storeDTO";

export class StoreController {
  static async saveStore(req: Request, res: Response) {
    try {
      const savedStore = await StoreService.saveStore(req.body);
      res.status(201).json(savedStore);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : handleError(error, "Erro ao salvar a loja");
      sendErrorResponse(res, 400, errorMessage);
    }
  }
  static async findNearbyStores(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode, number } = req.body;
      const nearbyStores: StoreDTO[] = await StoreService.findNearbyStores(
        zipCode,
        number
      );

      res.status(200).json(nearbyStores);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : handleError(error, "Erro ao buscar lojas próximas");
      sendErrorResponse(res, 404, errorMessage);
    }
  }
}
