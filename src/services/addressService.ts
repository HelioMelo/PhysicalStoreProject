import { zipCodeApi } from "../api/zipCodeApi";
import { geocodeAddressApi } from "../api/geocodeAddressApi";
import { AddressData } from "../interfaces/addressData";

export class AddressService {
  static async getFullAddress(
    zipCode: string,
    number?: string
  ): Promise<AddressData> {
    try {
      const addressData = await zipCodeApi(zipCode);
      return {
        zipCode: addressData.cep,
        street: addressData.logradouro,
        neighborhood: addressData.bairro,
        city: addressData.localidade,
        state: addressData.uf,
        complement: addressData.complemento,
      };
    } catch (error) {
      throw new Error(
        "Erro ao buscar dados de endereço: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  static async getCoordinates(
    street: string,
    state: string,
    city: string
  ): Promise<{ latitude: number; longitude: number }> {
    const coordinates = await geocodeAddressApi(street, state, city);
    if (!coordinates) {
      throw new Error("Não foi possível obter as coordenadas.");
    }

    return coordinates;
  }
}
