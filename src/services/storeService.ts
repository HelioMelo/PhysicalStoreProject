import {
  determineDocumentType,
  isValidCNPJ,
  isValidCPF,
} from "../utils/storeUtils";
import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { saveStore, getAllStores } from "../repository/storeRepository";
import { StoreDTO } from "../dto/storeDTO";
import { handleError, validateStoreDTO } from "../errors/errorHandlers";
import { DistanceCalculator, StoreUtils } from "../utils/storeUtils";
import { AddressService } from "./addressService";
import { ValidationError, handleKnownErrors } from "../errors/customErrors";
import { DocumentTypeEnum } from "../enums/documentTypeEnum";

export class StoreService {
  static async saveStore(storeDTO: StoreDTO) {
    try {
      validateStoreDTO(storeDTO);

      storeDTO.documentType = determineDocumentType(storeDTO.document);

      if (
        storeDTO.documentType === DocumentTypeEnum.CPF &&
        !isValidCPF(storeDTO.document)
      ) {
        throw new ValidationError("CPF inválido.");
      } else if (
        storeDTO.documentType === DocumentTypeEnum.CNPJ &&
        !isValidCNPJ(storeDTO.document)
      ) {
        throw new ValidationError("CNPJ inválido.");
      }

      const addressData = await zipCodeApi(storeDTO.address.zipCode);
      if (!addressData) {
        throw new ValidationError("Endereço não encontrado.");
      }

      const fullAddress = `${addressData.logradouro}, ${
        storeDTO.address.number || "S/N"
      }`;

      const coordinates = await geocodeAddressApi(fullAddress);
      if (!coordinates) {
        throw new ValidationError("Não foi possível obter as coordenadas.");
      }

      const store = StoreUtils.toStore(storeDTO, addressData, coordinates);
      const savedStore = await saveStore(store);

      return savedStore;
    } catch (error) {
      const errorMessage = handleKnownErrors(error);
      handleError(errorMessage, "Erro ao salvar loja");
      throw error;
    }
  }

  static async findNearbyStores(
    zipCode: string,
    number?: string
  ): Promise<StoreDTO[]> {
    try {
      if (!zipCode) {
        throw new Error("O CEP é obrigatório.");
      }

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
        throw new Error("Nenhuma loja encontrada num raio de 100 km.");
      }

      return nearbyStores;
    } catch (error) {
      const errorMessage = handleError(error, "Erro ao buscar lojas próximas");
      throw new Error(errorMessage);
    }
  }
}
