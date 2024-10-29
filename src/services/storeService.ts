import {
  determineDocumentType,
  isValidCNPJ,
  isValidCPF,
  DistanceCalculator,
  StoreUtils,
} from "../utils/storeUtils";
import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { saveStore, getAllStores } from "../repository/storeRepository";
import { StoreDTO } from "../dto/storeDTO";
import { handleError, validateStoreDTO } from "../errors/errorHandlers";
import { AddressService } from "./addressService";
import { ValidationError, handleKnownErrors } from "../errors/customErrors";
import { DocumentTypeEnum } from "../enums/documentTypeEnum";

export class StoreService {
  static async saveStore(storeDTO: StoreDTO): Promise<StoreDTO> {
    try {
      validateStoreDTO(storeDTO);

      storeDTO.documentType = this.validateDocument(storeDTO.document);

      const addressData = await this.getAddressData(storeDTO.address.zipCode);
      const coordinates = await this.getCoordinates(
        addressData,
        storeDTO.address.number
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
        throw new ValidationError("O CEP é obrigatório.");
      }

      const fullAddress = await AddressService.getFullAddress(zipCode, number);
      const coordinates = await AddressService.getCoordinates(fullAddress);
      const nearbyStores = await this.getNearbyStores(
        coordinates.latitude,
        coordinates.longitude
      );

      if (nearbyStores.length === 0) {
        throw new ValidationError(
          "Nenhuma loja encontrada num raio de 100 km."
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

  private static async getCoordinates(addressData: any, number?: string) {
    const fullAddress = `${addressData.logradouro}, ${number || "S/N"}`;
    const coordinates = await geocodeAddressApi(fullAddress);
    if (!coordinates) {
      throw new ValidationError("Não foi possível obter as coordenadas.");
    }
    return coordinates;
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
