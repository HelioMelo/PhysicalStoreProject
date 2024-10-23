import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { Store } from "../models/store";
import { StoreDTO } from "../dto/storeDTO";
import {
  saveStore,
  checkStoreExists,
  getAllStores,
} from "../repository/storeRepository";
import { validateStoreDTO, handleError } from "../errors/errorHandlers";
import { AddressService } from "./AddressService";
import { DistanceCalculator } from "../utils/DistanceCalculator";

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
  static async findNearbyStores(
    zipCode: string,
    number?: string
  ): Promise<StoreDTO[]> {
    try {
      validateStoreDTO({ name: "dummy", zipCode });

      const fullAddress = await AddressService.getFullAddress(zipCode, number);
      const coordinates = await AddressService.getCoordinates(fullAddress);

      const userLat = parseFloat(coordinates.latitude);
      const userLon = parseFloat(coordinates.longitude);

      const stores = await getAllStores();

      const nearbyStores = DistanceCalculator.filterNearbyStores(
        stores,
        userLat,
        userLon,
        100
      );
      if (nearbyStores.length === 0) {
        throw new Error("Não há lojas dentro de um raio de 100 km.");
      }

      return nearbyStores;
    } catch (error) {
      const errorMessage = handleError(error, "Erro ao buscar lojas próximas");
      throw new Error(errorMessage);
    }
  }
}
