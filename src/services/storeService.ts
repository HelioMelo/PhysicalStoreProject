import { AddressService } from "./addressService";
import {
  determineDocumentType,
  DistanceCalculator,
  isValidCNPJ,
  isValidCPF,
  StoreUtils,
} from "../utils/storeUtils";
import { StoreDTO } from "../dto/storeDTO";
import { handleError, validateStoreDTO } from "../errors/errorHandlers";
import { ValidationError, handleKnownErrors } from "../errors/customErrors";
import { AddressData } from "../interfaces/addressData";
import { saveStore, getAllStores } from "../repository/storeRepository";

import { DocumentTypeEnum } from "../enums/documentTypeEnum";
import { zipCodeApi } from "../api/zipCodeApi";

export class StoreService {
  static async saveStore(storeDTO: StoreDTO): Promise<StoreDTO> {
    try {
      validateStoreDTO(storeDTO);
      storeDTO.documentType = this.validateDocument(storeDTO.document);

      const addressData: AddressData = await AddressService.getFullAddress(
        storeDTO.address.zipCode,
        storeDTO.address.number
      );
      const { street, city, state } = addressData;

      const coordinates = await AddressService.getCoordinates(
        street,
        state,
        city
      );

      const store = StoreUtils.toStore(storeDTO, addressData, coordinates);
      return await saveStore(store);
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
        throw new ValidationError("Código postal é obrigatório");
      }

      const addressData: AddressData = await AddressService.getFullAddress(
        zipCode,
        number
      );
      const { street, city, state } = addressData;

      const coordinates = await AddressService.getCoordinates(
        street,
        state,
        city
      );

      const nearbyStores = await this.getNearbyStores(
        coordinates.latitude.toString(),
        coordinates.longitude.toString()
      );

      if (nearbyStores.length === 0) {
        throw new ValidationError(
          "Nenhuma loja encontrada em um raio de 100 km."
        );
      }

      return nearbyStores;
    } catch (error) {
      const errorMessage = handleError(error, "Erro ao buscar lojas próximas");
      throw new Error(errorMessage);
    }
  }

  private static validateDocument(document: string): DocumentTypeEnum {
    if (!/^\d+$/.test(document)) {
      throw new ValidationError("O documento deve conter apenas números.");
    }
    const documentType = determineDocumentType(document);
    if (documentType === DocumentTypeEnum.CPF && !isValidCPF(document)) {
      throw new ValidationError("CPF inválido.");
    } else if (
      documentType === DocumentTypeEnum.CNPJ &&
      !isValidCNPJ(document)
    ) {
      throw new ValidationError("CNPJ inválido.");
    }
    return documentType;
  }

  private static async getAddressData(zipCode: string) {
    const addressData = await zipCodeApi(zipCode);
    if (!addressData) {
      throw new ValidationError("Endereço não encontrado.");
    }
    return addressData;
  }

  private static async getNearbyStores(
    userLat: string,
    userLon: string
  ): Promise<StoreDTO[]> {
    const stores = await getAllStores();
    return DistanceCalculator.filterNearbyStores(
      stores,
      parseFloat(userLat),
      parseFloat(userLon),
      100
    );
  }
}
