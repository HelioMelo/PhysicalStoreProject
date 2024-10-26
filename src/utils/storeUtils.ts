import { Store } from "../models/store";
import { Address } from "../models/address";
import { StoreDTO } from "../dto/storeDTO";

import { DocumentTypeEnum } from "../enums/documentTypeEnum";
import { AddressDTO } from "../dto/addressDTO";

export class StoreUtils {
  static toStore(
    storeDTO: StoreDTO,
    addressData: any,
    coordinates: { latitude: number; longitude: number }
  ): Store {
    const addressDTO = new AddressDTO(
      0,
      addressData.cep,
      addressData.logradouro,
      storeDTO.address.number || "S/N",
      "",
      addressData.bairro,
      addressData.localidade,
      addressData.uf
    );

    return new Store(
      0,
      storeDTO.name,
      storeDTO.document,
      new Address(
        0,
        addressDTO.zipCode,
        addressDTO.street,
        addressDTO.number,
        addressDTO.complement,
        addressDTO.neighborhood,
        addressDTO.city,
        addressDTO.state
      ),
      parseFloat(coordinates.latitude.toString()),
      parseFloat(coordinates.longitude.toString()),
      storeDTO.documentType
    );
  }
}
export class DistanceCalculator {
  private static readonly EARTH_RADIUS = 6371;

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const dLat = DistanceCalculator.toRadians(lat2 - lat1);
    const dLon = DistanceCalculator.toRadians(lon1 - lon2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(DistanceCalculator.toRadians(lat1)) *
        Math.cos(DistanceCalculator.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return DistanceCalculator.EARTH_RADIUS * c;
  }

  static formatDistance(distance: number): string {
    return distance === 0 ? "0 km" : distance.toFixed(2) + " km";
  }

  static filterNearbyStores(
    stores: Store[],
    latitude: number,
    longitude: number,
    radius: number
  ): StoreDTO[] {
    const uniqueStores = new Set<string>();
    const filteredStores = stores
      .filter(
        (store) => store.getLatitude() !== null && store.getLongitude() !== null
      )
      .map((store) => {
        const distance = DistanceCalculator.calculateDistance(
          latitude,
          longitude,
          store.getLatitude(),
          store.getLongitude()
        );

        const storeDTO = StoreDTO.fromStore(store, distance);
        storeDTO.distance = DistanceCalculator.formatDistance(distance);

        const storeIdentifier = `${storeDTO.name}-${storeDTO.address}`;
        if (
          storeDTO.name &&
          storeDTO.address &&
          !uniqueStores.has(storeIdentifier)
        ) {
          uniqueStores.add(storeIdentifier);
          return storeDTO;
        }
        return null;
      })
      .filter((storeDTO): storeDTO is StoreDTO => storeDTO !== null)
      .filter(
        (storeDTO) =>
          storeDTO.distance !== undefined &&
          parseFloat(storeDTO.distance) <= radius
      )
      .sort(
        (a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0")
      );

    if (filteredStores.length === 0) {
      throw new Error("Nenhuma loja encontrada em um raio de 100 km.");
    }

    return filteredStores;
  }
}

export const determineDocumentType = (
  document: string,
  validationEnabled: boolean = true
): DocumentTypeEnum => {
  const cleanedDocument = document.replace(/\D/g, "");

  if (validationEnabled) {
    if (cleanedDocument.length === 11) {
      return DocumentTypeEnum.CPF;
    } else if (cleanedDocument.length === 14) {
      return DocumentTypeEnum.CNPJ;
    } else {
      throw new Error(
        "Documento inválido. Deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ."
      );
    }
  } else {
    // Retorna um valor padrão ou faz outra lógica quando a validação está desabilitada
    return cleanedDocument.length === 11
      ? DocumentTypeEnum.CPF
      : DocumentTypeEnum.CNPJ;
  }
};

export const isValidCPF = (cpf: string): boolean => {
  const cleanedCPF = cpf.replace(/\D/g, "");

  if (cleanedCPF.length !== 11 || /^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(10, 11))) {
    return false;
  }

  return true;
};

export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanedCNPJ = cnpj.replace(/\D/g, "");

  if (cleanedCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanedCNPJ)) {
    return false;
  }

  let length = cleanedCNPJ.length - 2;
  let numbers = cleanedCNPJ.substring(0, length);
  let digits = cleanedCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  length = length + 1;
  numbers = cleanedCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }

  return true;
};
