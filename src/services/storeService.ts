import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { Store } from "../models/store";
import { StoreDTO } from "../dto/storeDTO";
import { saveStore, checkStoreExists } from "../repository/storeRepository";
import { validateStoreDTO, handleError } from "../errors/errorHandlers";

export class StoreService {
  static async saveStore(storeDTO: StoreDTO) {
    try {
      validateStoreDTO(storeDTO);

      const storeExists = await checkStoreExists(
        storeDTO.zipCode,
        storeDTO.number
      );
      if (storeExists) {
        throw new Error("A loja já existe nesse endereço.");
      }

      const addressData = await zipCodeApi(storeDTO.zipCode);
      const fullAddress = `${addressData.logradouro}, ${
        storeDTO.number || "S/N"
      }, ${addressData.bairro}, ${addressData.localidade}, ${addressData.uf}`;
      const coordinates = await geocodeAddressApi(fullAddress);
      if (!coordinates) {
        throw new Error("Não foi possível obter as coordenadas.");
      }

      const store = new Store(
        storeDTO.name,
        fullAddress,
        storeDTO.zipCode,
        storeDTO.number || "S/N",
        parseFloat(coordinates.latitude),
        parseFloat(coordinates.longitude)
      );

      const savedStore = await saveStore(store);
      return StoreDTO.fromStore(store);
    } catch (error) {
      const errorMessage = handleError(error, "Erro ao salvar loja");
      throw new Error(errorMessage);
    }
  }
}
